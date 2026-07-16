'use strict';

/**
 * Lógica pura del carrito de compras (sin I/O).
 * Formato de operación: "<id de producto> <cantidad a sumar>"
 */

function createCart() {
  return {};
}

function parseCommand(line) {
  const trimmed = (line || '').trim();

  if (trimmed.toLowerCase() === 'bye') {
    return { type: 'bye' };
  }

  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length !== 2) {
    return { type: 'invalid' };
  }

  const [idRaw, qtyRaw] = parts;
  if (!/^[a-zA-Z0-9]+$/.test(idRaw) || !/^-?\d+$/.test(qtyRaw)) {
    return { type: 'invalid' };
  }

  return { type: 'update', id: idRaw, qty: parseInt(qtyRaw, 10) };
}

function formatCartMessage(cart) {
  const ids = Object.keys(cart);
  if (ids.length === 0) {
    return 'Tu carrito está vacío, que más deseas hacer?';
  }
  const lines = ids.map((id) => `  - ${id} con ${cart[id]} unidades`);
  return `Tu carrito es:\n${lines.join('\n')}\nQue más deseas hacer?`;
}

function processCommand(cart, line) {
  const cmd = parseCommand(line);

  if (cmd.type === 'bye') {
    return { cart, message: 'Adiós fue un gusto atenderte!', exit: true };
  }

  if (cmd.type === 'invalid') {
    return {
      cart,
      message: 'Oops, formato inválido. Usa "<id de producto> <cantidad>". Que más deseas hacer?',
      exit: false,
    };
  }

  const { id, qty } = cmd;
  const exists = Object.prototype.hasOwnProperty.call(cart, id);

  if (!exists) {
    if (qty <= 0) {
      return {
        cart,
        message: `Oops parece que no tienes el producto ${id} agregado a tu carrito. Que más deseas hacer?`,
        exit: false,
      };
    }
    const newCart = { ...cart, [id]: qty };
    return { cart: newCart, message: formatCartMessage(newCart), exit: false };
  }

  const newQty = cart[id] + qty;
  const newCart = { ...cart };
  if (newQty <= 0) {
    delete newCart[id];
  } else {
    newCart[id] = newQty;
  }
  return { cart: newCart, message: formatCartMessage(newCart), exit: false };
}

module.exports = {
  createCart,
  parseCommand,
  formatCartMessage,
  processCommand,
};
