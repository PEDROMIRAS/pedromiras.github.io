import test from 'node:test';
import assert from 'node:assert/strict';
import { aFila, aRegistro } from './historialNube.js';

test('un duelo va y vuelve de la nube sin perder datos', () => {
    const instante = Date.UTC(2026, 9, 12, 20, 30);
    const local = { id: instante, cantidad: 12, isMultiplayer: true, player2Count: 9, player1Name: 'Pedro', player2Name: 'Ana' };
    const fila = aFila(local);
    assert.equal(fila.played_at, '2026-10-12T20:30:00.000Z');
    const vuelta = aRegistro({ id: 'uuid-1', ...fila });
    assert.deepEqual(
        { ...vuelta, date: undefined, time: undefined },
        { id: 'uuid-1', nube: true, date: undefined, time: undefined, cantidad: 12, isMultiplayer: true, player2Count: 9, player1Name: 'Pedro', player2Name: 'Ana' }
    );
});

test('lo que la tabla rechazaría se ajusta antes de enviarlo', () => {
    const fila = aFila({ id: 0, cantidad: 999999, isMultiplayer: false, player2Count: 5, player1Name: '   ', player2Name: 'x' });
    assert.equal(fila.pieces, 10000);
    assert.equal(fila.player1_name, 'Tú');
    assert.equal(fila.player2_name, null); // sin duelo no se guarda rival
    assert.equal(fila.player2_pieces, null);
    assert.equal(aFila({ id: 0, cantidad: -3, player1Name: 'a'.repeat(60) }).player1_name.length, 40);
    assert.equal(aFila({ id: 0, cantidad: 'abc', player1Name: 'P' }).pieces, 0);
});
