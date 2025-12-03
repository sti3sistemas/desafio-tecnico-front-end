import { delay, http, HttpResponse } from 'msw';
import { v4 as uuidv4 } from 'uuid';

const LATENCY_MS = 250;
const PRODS_KEY = 'mock.produtos.v1';
const PEDIDOS_KEY = 'mock.pedidos.v1';

function obterJSONLocalStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function salvarJSONLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function obterProdutosLocalStorage() {
  const itens = obterJSONLocalStorage(PRODS_KEY, []);
  return Array.isArray(itens) ? itens : [];
}

function obterPedidosLocalStorage() {
  return obterJSONLocalStorage(PEDIDOS_KEY, []);
}

function salvarPedidosLocalStorage(pedidos) {
  salvarJSONLocalStorage(PEDIDOS_KEY, pedidos);
}

export const handlersPedidos = [
  // Listar pedidos
  http.get('/api/pedidos', async () => {
    await delay(LATENCY_MS);
    const pedidos = obterPedidosLocalStorage();
    return HttpResponse.json({ dados: pedidos });
  }),

  // Buscar pedido por id
  http.get('/api/pedidos/:id', async ({ params }) => {
    await delay(LATENCY_MS);
    const pedidos = obterPedidosLocalStorage();
    const pedido = pedidos.find((p) => p.id === params.id);
    if (!pedido)
      return HttpResponse.json(
        { erro: 'Não encontrado', avisos: ['Pedido não encontrado'] },
        { status: 404 },
      );
    return HttpResponse.json({ dados: pedido });
  }),

  // Criar pedido
  http.post('/api/pedidos', async ({ request }) => {
    await delay(LATENCY_MS);
    let body = {};
    try {
      body = await request.json();
    } catch {
      return HttpResponse.json(
        { erro: 'Body inválido', avisos: ['Body JSON inválido'] },
        { status: 400 },
      );
    }
    const itens = Array.isArray(body?.itens) ? body.itens : [];
    if (itens.length === 0)
      return HttpResponse.json(
        { erro: 'Validação falhou', avisos: ['Campo itens é obrigatório'] },
        { status: 400 },
      );

    const produtos = obterProdutosLocalStorage();

    // Validação de estoque
    const avisos = [];
    for (const item of itens) {
      const { produtoId, quantidade } = item || {};
      const prod = produtos.find((p) => p.id === produtoId);
      const qtd = Number.isFinite(quantidade) ? Math.trunc(quantidade) : NaN;
      if (!prod) avisos.push(`Produto inválido`);
      else if (!Number.isFinite(qtd) || qtd <= 0)
        avisos.push(`Quantidade inválida para ${prod.nome}`);
      else if (prod.estoque < qtd) avisos.push(`Estoque insuficiente de ${prod.nome}`);
    }
    if (avisos.length)
      return HttpResponse.json({ erro: 'Validação falhou', avisos }, { status: 400 });

    // Monta pedido e debita estoque
    const horaAtual = new Date().toISOString();
    let valorTotal = 0;
    const itensPedido = itens.map(({ produtoId, quantidade }) => {
      const idx = produtos.findIndex((p) => p.id === produtoId);
      const prod = produtos[idx];
      const qtd = Math.trunc(quantidade);
      produtos[idx] = { ...prod, estoque: prod.estoque - qtd, atualizadoEm: horaAtual };
      const precoUnitario = prod.preco;
      valorTotal += precoUnitario * qtd;
      return { produtoId, quantidade: qtd, precoUnitario, nomeProduto: prod.nome };
    });
    salvarJSONLocalStorage(PRODS_KEY, produtos);

    const pedidos = obterPedidosLocalStorage();
    const numeroPedido =
      (pedidos.reduce((max, p) => Math.max(max, p.numeroPedido || 0), 0) || 0) + 1;
    const novo = {
      id: uuidv4(),
      numeroPedido,
      clienteNome: body?.clienteNome || '',
      itens: itensPedido,
      valorTotal: Number(valorTotal.toFixed(2)),
      criadoEm: horaAtual,
      atualizadoEm: horaAtual,
      status: 'ativo',
    };
    pedidos.push(novo);
    salvarPedidosLocalStorage(pedidos);
    return HttpResponse.json({ dados: novo }, { status: 201 });
  }),

  // Alterar pedido (PUT)
  http.put('/api/pedidos/:id', async ({ params, request }) => {
    await delay(LATENCY_MS);
    let body = {};
    try {
      body = await request.json();
    } catch {
      return HttpResponse.json(
        { erro: 'Body inválido', avisos: ['Body JSON inválido'] },
        { status: 400 },
      );
    }
    const pedidos = obterPedidosLocalStorage();
    const idxPedido = pedidos.findIndex((p) => p.id === params.id);
    if (idxPedido === -1)
      return HttpResponse.json(
        { erro: 'Não encontrado', avisos: ['Pedido não encontrado'] },
        { status: 404 },
      );
    if (pedidos[idxPedido]?.status === 'cancelado') {
      return HttpResponse.json(
        { erro: 'Regra de negócio', avisos: ['Pedido cancelado não pode ser alterado'] },
        { status: 400 },
      );
    }

    const itensNovos = Array.isArray(body?.itens) ? body.itens : [];
    if (itensNovos.length === 0)
      return HttpResponse.json(
        { erro: 'Validação falhou', avisos: ['Campo itens é obrigatório'] },
        { status: 400 },
      );

    const produtos = obterProdutosLocalStorage();
    const antigo = pedidos[idxPedido];

    const mapAntigo = new Map(antigo.itens.map((i) => [i.produtoId, i.quantidade]));

    // Validação de estoque considerando deltas
    const avisos = [];
    for (const item of itensNovos) {
      const { produtoId, quantidade } = item || {};
      const qtdNova = Number.isFinite(quantidade) ? Math.trunc(quantidade) : NaN;
      const qtdAntiga = mapAntigo.get(produtoId) || 0;
      const qntNovaMenosAntiga = qtdNova - qtdAntiga;
      const prod = produtos.find((p) => p.id === produtoId);
      if (!prod) avisos.push(`Produto ${produtoId} inexistente`);
      else if (!Number.isFinite(qtdNova) || qtdNova <= 0)
        avisos.push(`Quantidade inválida para ${prod.nome}`);
      else if (qntNovaMenosAntiga > 0 && prod.estoque < qntNovaMenosAntiga)
        avisos.push(`Estoque insuficiente de ${prod.nome}`);
    }
    if (avisos.length)
      return HttpResponse.json({ erro: 'Validação falhou', avisos }, { status: 400 });

    // Repor estoque antigo e debitar novo
    const now = new Date().toISOString();
    for (const it of antigo.itens) {
      const idx = produtos.findIndex((p) => p.id === it.produtoId);
      if (idx !== -1)
        produtos[idx] = {
          ...produtos[idx],
          estoque: produtos[idx].estoque + it.quantidade,
          atualizadoEm: now,
        };
    }

    let valorTotal = 0;
    const itensFinal = itensNovos.map(({ produtoId, quantidade }) => {
      const idx = produtos.findIndex((p) => p.id === produtoId);
      const prod = produtos[idx];
      const qtd = Math.trunc(quantidade);
      produtos[idx] = { ...prod, estoque: prod.estoque - qtd, atualizadoEm: now };
      valorTotal += prod.preco * qtd;
      return { produtoId, quantidade: qtd, precoUnitario: prod.preco, nomeProduto: prod.nome };
    });
    salvarJSONLocalStorage(PRODS_KEY, produtos);

    const atualizado = {
      ...antigo,
      clienteNome: body?.clienteNome ?? antigo.clienteNome,
      itens: itensFinal,
      valorTotal: Number(valorTotal.toFixed(2)),
      atualizadoEm: now,
    };
    pedidos[idxPedido] = atualizado;
    salvarPedidosLocalStorage(pedidos);
    return HttpResponse.json({ dados: atualizado });
  }),

  // Cancelar pedido
  http.patch('/api/pedidos/:id/cancelar', async ({ params }) => {
    await delay(LATENCY_MS);
    const pedidos = obterPedidosLocalStorage();
    const idxPedido = pedidos.findIndex((p) => p.id === params.id);
    if (idxPedido === -1)
      return HttpResponse.json(
        { erro: 'Não encontrado', avisos: ['Pedido não encontrado'] },
        { status: 404 },
      );
    const atual = pedidos[idxPedido];
    if (atual.status === 'cancelado') return HttpResponse.json({ dados: atual });

    // Repor estoque de todos os itens
    const produtos = obterProdutosLocalStorage();
    const now = new Date().toISOString();
    for (const item of atual.itens || []) {
      const idx = produtos.findIndex((p) => p.id === item.produtoId);
      if (idx !== -1) {
        produtos[idx] = {
          ...produtos[idx],
          estoque: (produtos[idx].estoque || 0) + (item.quantidade || 0),
          atualizadoEm: now,
        };
      }
    }
    salvarJSONLocalStorage(PRODS_KEY, produtos);

    const atualizado = { ...atual, status: 'cancelado', atualizadoEm: now };
    pedidos[idxPedido] = atualizado;
    salvarPedidosLocalStorage(pedidos);
    return HttpResponse.json({ dados: atualizado });
  }),
];
