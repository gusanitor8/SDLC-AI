# Shop 502 - Carrito TUI (POC)

Prueba de concepto de una interfaz de texto (TUI) para que un usuario anónimo
maneje su carrito de compras, escrita en Node.js.

> Nota: este proyecto es un ejercicio universitario. Las menciones a "4000
> usuarios diarios" en el enunciado original son solo contexto de la
> asignación, no un requisito de infraestructura real.

## Ejemplo de uso

```
Por favor ingrese su nombre.
> Rodrigo Custodio
Hola Rodrigo Custodio! Que deseas modificar en tu carrito?
> 12345 5
Tu carrito es:
  - 12345 con 5 unidades
Que más deseas hacer?
> 12345 -5
Tu carrito está vacío, que más deseas hacer?
> 12345 -5
Oops parece que no tienes el producto 12345 agregado a tu carrito. Que más deseas hacer?
> 456 29
Tu carrito es:
  - 456 con 29 unidades
Que más deseas hacer?
> bye
Adiós fue un gusto atenderte!
```

El formato de entrada de operaciones es `<id de producto> <cantidad a sumar al carrito>`,
usando espacio como delimitador. La cantidad puede ser negativa para restar unidades.

## Desarrollo

```bash
npm install
npm start        # correr la TUI
npm test          # correr tests con cobertura
```

## Estructura

- `src/cart.js` — lógica pura del carrito (altas, bajas, cambios).
- `src/cli.js` — interfaz de texto (readline) sobre `cart.js`.
- `bin/index.js` — entry point ejecutable.
- `test/cart.test.js` — tests unitarios, 100% de cobertura sobre `src/cart.js`.

Ver [AGENTS.md](./AGENTS.md) para convenciones de código y flujo de contribución.

## Calidad y CI/CD

- **Cobertura:** el estándar pide 80%; este proyecto apunta a 100% sobre la
  lógica del carrito (`src/cart.js`), ya que es el único módulo con reglas de
  negocio no triviales.
- **CI** (`.github/workflows/ci.yml`): corre los tests en cada Pull Request
  hacia `main`.
- **CD** (`.github/workflows/cd.yml`): al hacer merge a `main`, construye un
  binario standalone (con [`pkg`](https://github.com/vercel/pkg)) y lo publica
  como GitHub Artifact.

## Estrategia de branches

Este repo sigue [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow):

- `main` está protegida — no se permite push directo, todo cambio pasa por Pull Request.
- Las ramas de feature salen de `main` y se nombran de forma descriptiva.
- Squash o merge commit al mergear queda a discreción del equipo.

## Licencia

MIT — ver [LICENSE](./LICENSE).
