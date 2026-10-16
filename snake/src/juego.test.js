import assert from 'node:assert/strict';
import test from 'node:test';
import { CELDAS, DIRECCIONES, avanzar, entre, estadoInicial, girar } from './juego.js';

const { ArrowUp, ArrowLeft, ArrowRight } = DIRECCIONES;

test('dos teclas rápidas en el mismo tick no dan la vuelta a la serpiente', () => {
  const e = { ...estadoInicial(), ...ArrowRight, food: { x: 0, y: 0 } };
  e.snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }];
  girar(e, ArrowUp);
  girar(e, ArrowLeft); // iría contra su propio cuerpo: se ignora
  assert.equal(avanzar(e), true);
  assert.deepEqual(e.snake[0], { x: 5, y: 4 });
});

test('atraviesa el borde y aparece por el lado contrario', () => {
  const e = { ...estadoInicial(), ...ArrowRight, food: { x: 0, y: 0 } };
  e.snake = [{ x: CELDAS - 1, y: 7 }];
  avanzar(e);
  assert.deepEqual(e.snake[0], { x: 0, y: 7 });
});

test('al comer crece y la fruta nueva no cae sobre la serpiente', () => {
  const e = { ...estadoInicial(), ...ArrowRight, food: { x: 6, y: 5 } };
  e.snake = [{ x: 5, y: 5 }];
  avanzar(e);
  assert.equal(e.snake.length, 2);
  assert.ok(!e.snake.some((p) => p.x === e.food.x && p.y === e.food.y));
});

test('chocar con su propio cuerpo termina la partida', () => {
  const e = { ...estadoInicial(), ...ArrowUp, food: { x: 0, y: 0 } };
  // cabeza en (5,5) rodeada por su cuerpo: al subir pisa (5,4)
  e.snake = [{ x: 5, y: 5 }, { x: 6, y: 5 }, { x: 6, y: 4 }, { x: 5, y: 4 }, { x: 4, y: 4 }];
  assert.equal(avanzar(e), false);
});

test('entre dos ticks, cada segmento se dibuja a medio camino y cruza los bordes por el lado corto', () => {
  assert.deepEqual(entre({ x: 4, y: 5 }, { x: 5, y: 5 }, 0.25), { x: 4.25, y: 5 });
  assert.deepEqual(entre({ x: CELDAS - 1, y: 3 }, { x: 0, y: 3 }, 0.5), { x: CELDAS - 0.5, y: 3 });
  assert.deepEqual(entre({ x: 2, y: 0 }, { x: 2, y: CELDAS - 1 }, 0.5), { x: 2, y: -0.5 });
  assert.deepEqual(entre(undefined, { x: 7, y: 7 }, 0.5), { x: 7, y: 7 }); // el que nace al comer no se mueve
});
