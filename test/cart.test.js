'use strict';

const {
  createCart,
  parseCommand,
  formatCartMessage,
  processCommand,
} = require('../src/cart');

describe('createCart', () => {
  test('retorna un carrito vacío', () => {
    expect(createCart()).toEqual({});
  });
});

describe('parseCommand', () => {
  test('reconoce el comando "bye" sin importar mayúsculas/espacios', () => {
    expect(parseCommand('bye')).toEqual({ type: 'bye' });
    expect(parseCommand('  BYE  ')).toEqual({ type: 'bye' });
  });

  test('parsea una operación válida', () => {
    expect(parseCommand('12345 5')).toEqual({ type: 'update', id: '12345', qty: 5 });
    expect(parseCommand('456 -29')).toEqual({ type: 'update', id: '456', qty: -29 });
  });

  test('marca inválido si no hay exactamente 2 tokens', () => {
    expect(parseCommand('12345')).toEqual({ type: 'invalid' });
    expect(parseCommand('12345 5 extra')).toEqual({ type: 'invalid' });
    expect(parseCommand('')).toEqual({ type: 'invalid' });
  });

  test('marca inválido si el id tiene caracteres no alfanuméricos', () => {
    expect(parseCommand('12-45 5')).toEqual({ type: 'invalid' });
  });

  test('marca inválido si la cantidad no es un entero', () => {
    expect(parseCommand('12345 abc')).toEqual({ type: 'invalid' });
  });
});

describe('formatCartMessage', () => {
  test('mensaje de carrito vacío', () => {
    expect(formatCartMessage({})).toBe('Tu carrito está vacío, que más deseas hacer?');
  });

  test('mensaje de carrito con productos', () => {
    expect(formatCartMessage({ 12345: 5 })).toBe(
      'Tu carrito es:\n  - 12345 con 5 unidades\nQue más deseas hacer?'
    );
  });
});

describe('processCommand', () => {
  test('agrega un producto nuevo al carrito', () => {
    const cart = createCart();
    const result = processCommand(cart, '12345 5');
    expect(result.exit).toBe(false);
    expect(result.cart).toEqual({ 12345: 5 });
    expect(result.message).toBe('Tu carrito es:\n  - 12345 con 5 unidades\nQue más deseas hacer?');
  });

  test('resta unidades y vacía el carrito cuando llega a 0', () => {
    const cart = { 12345: 5 };
    const result = processCommand(cart, '12345 -5');
    expect(result.cart).toEqual({});
    expect(result.message).toBe('Tu carrito está vacío, que más deseas hacer?');
  });

  test('resta unidades parcialmente sin eliminar el producto', () => {
    const cart = { 12345: 5 };
    const result = processCommand(cart, '12345 -2');
    expect(result.cart).toEqual({ 12345: 3 });
    expect(result.message).toContain('12345 con 3 unidades');
  });

  test('incrementa unidades de un producto existente', () => {
    const cart = { 12345: 5 };
    const result = processCommand(cart, '12345 3');
    expect(result.cart).toEqual({ 12345: 8 });
  });

  test('error al restar producto que no existe en el carrito', () => {
    const cart = createCart();
    const result = processCommand(cart, '12345 -5');
    expect(result.cart).toEqual({});
    expect(result.message).toBe(
      'Oops parece que no tienes el producto 12345 agregado a tu carrito. Que más deseas hacer?'
    );
  });

  test('agrega un segundo producto sin afectar el primero', () => {
    const cart = { 12345: 5 };
    const result = processCommand(cart, '456 29');
    expect(result.cart).toEqual({ 12345: 5, 456: 29 });
  });

  test('termina la sesión con "bye"', () => {
    const cart = { 456: 29 };
    const result = processCommand(cart, 'bye');
    expect(result.exit).toBe(true);
    expect(result.cart).toBe(cart);
    expect(result.message).toBe('Adiós fue un gusto atenderte!');
  });

  test('responde con mensaje de formato inválido', () => {
    const cart = createCart();
    const result = processCommand(cart, 'no-valido');
    expect(result.exit).toBe(false);
    expect(result.cart).toBe(cart);
    expect(result.message).toContain('formato inválido');
  });

  test('no cambia el carrito ante una cantidad 0 en producto nuevo', () => {
    const cart = createCart();
    const result = processCommand(cart, '999 0');
    expect(result.cart).toEqual({});
    expect(result.message).toContain('no tienes el producto 999');
  });
});
