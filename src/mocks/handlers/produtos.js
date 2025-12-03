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

function salvarProdutosLocalStorage(produtos) {
  salvarJSONLocalStorage(PRODS_KEY, produtos);
}

export const handlersProdutos = [
  // Listar produtos
  http.get('/api/produtos', async () => {
    await delay(LATENCY_MS);
    const produtos = obterProdutosLocalStorage();
    return HttpResponse.json({ dados: produtos });
  }),

  // Buscar por id
  http.get('/api/produtos/:id', async ({ params }) => {
    await delay(LATENCY_MS);
    const produtos = obterProdutosLocalStorage();
    const produto = produtos.find((p) => p.id === params.id);
    if (!produto)
      return HttpResponse.json(
        { erro: 'Não encontrado', avisos: ['Produto não encontrado'] },
        { status: 404 },
      );
    return HttpResponse.json({ dados: produto });
  }),

  // Criar
  http.post('/api/produtos', async ({ request }) => {
    await delay(LATENCY_MS);
    let payload = {};
    try {
      payload = await request.json();
    } catch {
      return HttpResponse.json(
        { erro: 'Body inválido', avisos: ['Body JSON inválido'] },
        { status: 400 },
      );
    }
    const pt = payload;
    if (!pt?.nome || typeof pt.preco !== 'number') {
      const avisos = [];
      if (!pt?.nome) avisos.push('Campo nome é obrigatório');
      if (typeof pt.preco !== 'number') avisos.push('Campo preço deve ser numérico');
      return HttpResponse.json({ erro: 'Validação falhou', avisos }, { status: 400 });
    }
    const now = new Date().toISOString();
    const newItem = {
      id: uuidv4(),
      nome: pt.nome,
      descricao: pt.descricao || '',
      preco: pt.preco,
      estoque: Number.isFinite(pt.estoque) ? Math.trunc(pt.estoque) : 0,
      criadoEm: now,
      atualizadoEm: now,
    };
    const listaProdutos = obterProdutosLocalStorage();
    listaProdutos.push(newItem);
    salvarProdutosLocalStorage(listaProdutos);
    return HttpResponse.json({ dados: newItem }, { status: 201 });
  }),

  // Atualizar
  http.put('/api/produtos/:id', async ({ params, request }) => {
    await delay(LATENCY_MS);
    let payload = {};
    try {
      payload = await request.json();
    } catch {
      return HttpResponse.json(
        { erro: 'Body inválido', avisos: ['Body JSON inválido'] },
        { status: 400 },
      );
    }
    const listaProdutos = obterProdutosLocalStorage();
    const idx = listaProdutos.findIndex((p) => p.id === params.id);
    if (idx === -1)
      return HttpResponse.json(
        { erro: 'Não encontrado', avisos: ['Produto não encontrado'] },
        { status: 404 },
      );
    const now = new Date().toISOString();
    const pt = payload;
    const updated = {
      ...listaProdutos[idx],
      ...pt,
      estoque:
        pt.estoque === undefined
          ? (listaProdutos[idx].estoque ?? 0)
          : Number.isFinite(pt.estoque)
            ? Math.trunc(pt.estoque)
            : (listaProdutos[idx].estoque ?? 0),
      criadoEm: listaProdutos[idx].criadoEm,
      atualizadoEm: now,
    };
    listaProdutos[idx] = updated;
    salvarProdutosLocalStorage(listaProdutos);
    return HttpResponse.json({ dados: updated });
  }),

  // Atualizar parcial
  http.patch('/api/produtos/:id', async ({ params, request }) => {
    await delay(LATENCY_MS);
    let payload = {};
    try {
      payload = await request.json();
    } catch {
      return HttpResponse.json(
        { erro: 'Body inválido', avisos: ['Body JSON inválido'] },
        { status: 400 },
      );
    }
    const listaProdutos = obterProdutosLocalStorage();
    const idx = listaProdutos.findIndex((p) => p.id === params.id);
    if (idx === -1)
      return HttpResponse.json(
        { erro: 'Não encontrado', avisos: ['Produto não encontrado'] },
        { status: 404 },
      );
    const now = new Date().toISOString();
    const pt = payload;
    const updated = {
      ...listaProdutos[idx],
      ...pt,
      estoque:
        pt.estoque === undefined
          ? (listaProdutos[idx].estoque ?? 0)
          : Number.isFinite(pt.estoque)
            ? Math.trunc(pt.estoque)
            : (listaProdutos[idx].estoque ?? 0),
      criadoEm: listaProdutos[idx].criadoEm,
      atualizadoEm: now,
    };
    listaProdutos[idx] = updated;
    salvarProdutosLocalStorage(listaProdutos);
    return HttpResponse.json({ dados: updated });
  }),

  // Excluir (bloquear se em pedido ativo)
  http.delete('/api/produtos/:id', async ({ params }) => {
    await delay(LATENCY_MS);
    const itens = obterProdutosLocalStorage();
    const idx = itens.findIndex((p) => p.id === params.id);
    if (idx === -1)
      return HttpResponse.json(
        { erro: 'Não encontrado', avisos: ['Produto não encontrado'] },
        { status: 404 },
      );
    try {
      const pedidos = obterPedidosLocalStorage();
      const vinculado = (pedidos || []).some(
        (pd) =>
          pd?.status !== 'cancelado' &&
          Array.isArray(pd?.itens) &&
          pd.itens.some((it) => it?.produtoId === params.id),
      );
      if (vinculado) {
        const msg = 'Produto vinculado a pedido ativo. Cancele o pedido antes de excluir.';
        return HttpResponse.json({ erro: 'Conflito', avisos: [msg] }, { status: 409 });
      }
    } catch {
      return HttpResponse.json(
        { erro: 'Outros', avisos: ['Não foi possível excluir o produto'] },
        { status: 404 },
      );
    }
    itens.splice(idx, 1);
    salvarProdutosLocalStorage(itens);
    return new HttpResponse(null, { status: 204 });
  }),
];
