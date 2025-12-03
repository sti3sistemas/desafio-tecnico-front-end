import axios from 'axios';

const BASE = '/api/produtos';

async function handle(request) {
  try {
    const res = await request;
    return res?.data?.dados ?? null;
  } catch (error) {
    const data = error.response?.data ?? {};
    const msg =
      data?.erro || (error.response?.status ? `HTTP ${error.response.status}` : error.message);
    const avisos = data?.avisos;
    const err = new Error(msg);
    if (avisos) err.avisos = avisos;
    throw err;
  }
}

export async function listProducts() {
  const dados = await handle(axios.get(BASE));
  return Array.isArray(dados) ? dados : [];
}

export async function getProduct(id) {
  return handle(axios.get(`${BASE}/${id}`));
}

export async function createProduct(payload) {
  return handle(axios.post(BASE, payload, { headers: { 'Content-Type': 'application/json' } }));
}

export async function updateProduct(id, payload) {
  return handle(
    axios.put(`${BASE}/${id}`, payload, { headers: { 'Content-Type': 'application/json' } }),
  );
}

export async function deleteProduct(id) {
  return handle(axios.delete(`${BASE}/${id}`));
}

export default {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
