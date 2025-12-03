import { delay, http, HttpResponse } from 'msw';
import { v4 as uuidv4 } from 'uuid';

const LATENCY_MS = 250;
const CLIENTES_KEY = 'mock.clientes.v1';

function parseJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function salvarJSON(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function obterClientesLocalStorage() {
  const itens = parseJSON(CLIENTES_KEY, []);
  return Array.isArray(itens) ? itens : [];
}

function salvarClientesLocalStorage(itens) {
  salvarJSON(CLIENTES_KEY, itens);
}

function validarPayloadCliente(payload) {
  const avisos = [];
  if (!payload?.nome || typeof payload.nome !== 'string') avisos.push('Campo nome e obrigatorio');
  if (!payload?.email || typeof payload.email !== 'string')
    avisos.push('Campo email e obrigatorio');
  return avisos;
}

export const handlersClientes = [
  http.get('/api/clientes', async () => {
    await delay(LATENCY_MS);
    const clientes = obterClientesLocalStorage();
    return HttpResponse.json({ dados: clientes });
  }),

  http.get('/api/clientes/:id', async ({ params }) => {
    await delay(LATENCY_MS);
    const clientes = obterClientesLocalStorage();
    const cliente = clientes.find((c) => c.id === params.id);
    if (!cliente)
      return HttpResponse.json({ erro: 'Nao encontrado', avisos: ['Cliente nao encontrado'] }, { status: 404 });
    return HttpResponse.json({ dados: cliente });
  }),

  http.post('/api/clientes', async ({ request }) => {
    await delay(LATENCY_MS);
    let payload = {};
    try {
      payload = await request.json();
    } catch {
      return HttpResponse.json(
        { erro: 'Body invalido', avisos: ['Body JSON invalido'] },
        { status: 400 },
      );
    }
    const avisos = validarPayloadCliente(payload);
    if (avisos.length) return HttpResponse.json({ erro: 'Validacao falhou', avisos }, { status: 400 });
    const now = new Date().toISOString();
    const novo = {
      id: uuidv4(),
      nome: payload.nome.trim(),
      telefone: payload.telefone?.trim() || '',
      email: payload.email.trim().toLowerCase(),
      criadoEm: now,
      atualizadoEm: now,
    };
    const clientes = obterClientesLocalStorage();
    clientes.push(novo);
    salvarClientesLocalStorage(clientes);
    return HttpResponse.json({ dados: novo }, { status: 201 });
  }),

  http.put('/api/clientes/:id', async ({ params, request }) => {
    await delay(LATENCY_MS);
    let payload = {};
    try {
      payload = await request.json();
    } catch {
      return HttpResponse.json(
        { erro: 'Body invalido', avisos: ['Body JSON invalido'] },
        { status: 400 },
      );
    }
    const avisos = validarPayloadCliente(payload);
    if (avisos.length) return HttpResponse.json({ erro: 'Validacao falhou', avisos }, { status: 400 });

    const clientes = obterClientesLocalStorage();
    const idx = clientes.findIndex((c) => c.id === params.id);
    if (idx === -1)
      return HttpResponse.json(
        { erro: 'Nao encontrado', avisos: ['Cliente nao encontrado'] },
        { status: 404 },
      );
    const now = new Date().toISOString();
    const atualizado = {
      ...clientes[idx],
      nome: payload.nome.trim(),
      telefone: payload.telefone?.trim() || '',
      email: payload.email.trim().toLowerCase(),
      atualizadoEm: now,
    };
    clientes[idx] = atualizado;
    salvarClientesLocalStorage(clientes);
    return HttpResponse.json({ dados: atualizado });
  }),

  http.delete('/api/clientes/:id', async ({ params }) => {
    await delay(LATENCY_MS);
    const clientes = obterClientesLocalStorage();
    const idx = clientes.findIndex((c) => c.id === params.id);
    if (idx === -1)
      return HttpResponse.json(
        { erro: 'Nao encontrado', avisos: ['Cliente nao encontrado'] },
        { status: 404 },
      );
    clientes.splice(idx, 1);
    salvarClientesLocalStorage(clientes);
    return new HttpResponse(null, { status: 204 });
  }),
];
