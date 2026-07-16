'use strict';

const readline = require('readline');
const { createCart, processCommand } = require('./cart');

/**
 * Arranca la TUI. Recibe streams inyectables para poder probarla/reutilizarla.
 */
function start(input = process.stdin, output = process.stdout) {
  const rl = readline.createInterface({ input, output, terminal: false });
  let cart = createCart();

  rl.question('Por favor ingrese su nombre.\n> ', (name) => {
    output.write(`Hola ${name}! Que deseas modificar en tu carrito?\n`);
    promptCommand();
  });

  function promptCommand() {
    rl.question('> ', (line) => {
      const result = processCommand(cart, line);
      cart = result.cart;
      output.write(`${result.message}\n`);

      if (result.exit) {
        rl.close();
        return;
      }
      promptCommand();
    });
  }
}

module.exports = { start };
