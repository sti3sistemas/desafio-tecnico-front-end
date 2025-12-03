import { setupWorker } from 'msw/browser';
import { handlersPedidos } from './handlers/pedidos';
import { handlersProdutos } from './handlers/produtos';
import { handlersClientes } from './handlers/clientes';

export const worker = setupWorker(...handlersProdutos, ...handlersPedidos, ...handlersClientes);

function storedToggle() {
  try {
    const v = localStorage.getItem('mocks.enabled');
    return v === null ? null : v === 'true';
  } catch {
    return null;
  }
}

export function isMocksEnabled() {
  const stored = storedToggle();
  if (stored !== null) return stored;
  const env = import.meta?.env?.VITE_ENABLE_MOCKS;
  if (env === 'false') return false;
  return true;
}

export async function applyMocksState() {
  if (typeof window === 'undefined') return;
  const enabled = isMocksEnabled();
  if (enabled) {
    await worker.start({
      serviceWorker: { url: '/mockServiceWorker.js' },
      onUnhandledRequest: 'bypass',
    });

    console.info('[MOCK] MSW worker started (enabled)');
  } else {
    worker.stop();

    console.info('[MOCK] MSW worker stopped (disabled)');
  }
}

export async function setMocksEnabled(enabled) {
  try {
    localStorage.setItem('mocks.enabled', String(Boolean(enabled)));
  } catch (e) {
    console.log(e);
  }
  await applyMocksState();
}

export async function startWorker() {
  await applyMocksState();
}
