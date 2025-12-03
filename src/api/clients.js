import axios from 'axios';

const BASE = '/api/clientes';

async function handle(request) {
  try {
    const res = await request;
    return res?.data?.dados ?? null;
  } catch (error) {
    const data = error.response?.data ?? {};
    const msg = data?.erro || (error.response?.status ? `HTTP ${error.response.status}` : error.message);
    const avisos = data?.avisos;
    const err = new Error(msg);
    if (avisos) err.avisos = avisos;
    throw err;
  }
}

export async function listClients() {
  const dados = await handle(axios.get(BASE));
  return Array.isArray(dados) ? dados : [];
}

export function getClient(id) {
  return handle(axios.get(`${BASE}/${id}`));
}

export function createClient(payload) {
  return handle(axios.post(BASE, payload, { headers: { 'Content-Type': 'application/json' } }));
}

export function updateClient(id, payload) {
  return handle(
    axios.put(`${BASE}/${id}`, payload, { headers: { 'Content-Type': 'application/json' } }),
  );
}

export function deleteClient(id) {
  return handle(axios.delete(`${BASE}/${id}`));
}

export default {
  listClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
};
