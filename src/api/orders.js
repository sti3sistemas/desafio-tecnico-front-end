import axios from 'axios';

const BASE = '/api/pedidos';

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

export async function listOrders() {
  const dados = await handle(axios.get(BASE));
  return Array.isArray(dados) ? dados : [];
}

export async function getOrder(id) {
  return handle(axios.get(`${BASE}/${id}`));
}

export async function createOrder(payload) {
  return handle(
    axios.post(BASE, payload, { headers: { 'Content-Type': 'application/json' } }),
  );
}

export async function updateOrder(id, payload) {
  return handle(
    axios.put(`${BASE}/${id}`, payload, { headers: { 'Content-Type': 'application/json' } }),
  );
}

export async function cancelOrder(id) {
  return handle(axios.patch(`${BASE}/${id}/cancelar`));
}

export default {
  listOrders,
  getOrder,
  createOrder,
  updateOrder,
  cancelOrder,
};
