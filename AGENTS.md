# AGENTS.md

Guía para desarrolladores humanos y herramientas agénticas (Claude Code, Copilot, etc.)
que quieran contribuir a este proyecto.

## Qué es esto

POC de una TUI (Text User Interface) para el manejo del carrito de compras de un
usuario anónimo en Shop 502. Node.js puro, sin frameworks ni base de datos: el
carrito vive en memoria durante la sesión.

## Estructura

```
src/cart.js     Lógica pura del carrito (sin I/O). Aquí vive casi toda la lógica de negocio.
src/cli.js      Capa de TUI (readline) que llama a cart.js.
bin/index.js    Entry point ejecutable.
test/           Tests con Jest.
```

## Comandos

```
npm install     Instalar dependencias
npm test        Correr tests con cobertura (jest.config.js exige 100% en src/cart.js)
npm start        Ejecutar la TUI localmente
```

## Convenciones de código

- `src/cart.js` debe permanecer libre de I/O (sin `console.log`, `process.stdin`, etc.)
  para que sea trivial de testear al 100%.
- Toda la lógica nueva del carrito (altas, bajas, cambios) va en `cart.js` como
  función pura que recibe el estado y regresa un nuevo estado + mensaje.
- `cli.js` solo debe orquestar I/O; no debe contener reglas de negocio.

## Tests y cobertura

El estándar de Shop 502 pide 80% de cobertura general. Dado que este ejercicio
tiene un alcance reducido (un par de funciones puras), el proyecto apunta a
100% de cobertura sobre `src/cart.js` (ver `jest.config.js`,
`collectCoverageFrom` y `coverageThreshold`). Si agregas lógica nueva ahí,
agrega los casos de prueba correspondientes en `test/cart.test.js`.

## Flujo de trabajo (GitHub Flow)

1. No se permite hacer push directo a `main`.
2. Crea una rama descriptiva desde `main` (ej. `feature/descuentos-por-cantidad`).
3. Haz commits pequeños y claros.
4. Abre un Pull Request hacia `main`. El pipeline de CI (`.github/workflows/ci.yml`)
   correrá los tests automáticamente.
5. Requiere al menos una revisión antes de mergear. Squash o merge commit queda
   a discreción del equipo.
6. Al mergear a `main`, el pipeline de CD (`.github/workflows/cd.yml`) construye
   un binario standalone y lo publica como GitHub Artifact.

## Para agentes automatizados

- Antes de proponer un cambio, corre `npm test` localmente y confirma que la
  cobertura se mantiene en 100% para `src/cart.js`.
- No modifiques `main` directamente; siempre trabaja en una rama y abre PR.
- Si agregas una nueva regla de negocio al carrito, documenta el comportamiento
  esperado en el mensaje del commit/PR, ya que el formato de la TUI es parte
  del contrato con el usuario (ver mocks en `README.md`).
