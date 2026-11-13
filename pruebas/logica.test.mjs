import assert from 'node:assert/strict';
import { puntos, normalizar, nombresVisibles, ordenar, cerrarPregunta, DURACION } from '../trivia/logica.js';

assert.equal(DURACION, 20000);

// Puntaje: 1000 al instante, 500 en el último segundo, ×2 si vale doble
assert.equal(puntos(0, 20000, true, false), 1000);
assert.equal(puntos(10000, 20000, true, false), 750);
assert.equal(puntos(20000, 20000, true, false), 500);
assert.equal(puntos(25000, 20000, true, false), 500);   // tarde: se recorta a la duración
assert.equal(puntos(-300, 20000, true, false), 1000);   // nunca más de 1000
assert.equal(puntos(10000, 20000, true, true), 1500);
assert.equal(puntos(1000, 20000, false, true), 0);

// Nombres
assert.equal(normalizar('  María   José  '), 'María José');
assert.equal(normalizar('x'.repeat(30)).length, 20);
assert.equal(normalizar('   '), '');
assert.deepEqual(
  nombresVisibles({ a: { nombre: 'María', unido: 2 }, b: { nombre: 'maria', unido: 1 }, c: { nombre: 'Ana', unido: 3 } }),
  { b: 'maria', a: 'María 2', c: 'Ana' });

// Ranking: más puntos; empate → menos tiempo; luego quien entró antes
assert.deepEqual(ordenar({
  a: { puntos: 900, tiempo: 5000, unido: 1 },
  b: { puntos: 900, tiempo: 4000, unido: 2 },
  c: { puntos: 1200, tiempo: 9000, unido: 3 },
  d: { unido: 4 },
}), ['c', 'b', 'a', 'd']);

// Cierre de una pregunta
const r = cerrarPregunta({
  p: '0', pregunta: { correcta: 2 }, inicio: 1000, duracion: DURACION,
  jugadores: { a: { nombre: 'A', unido: 1 }, b: { nombre: 'B', unido: 2, puntos: 100, tiempo: 50 }, c: { nombre: 'C', unido: 3 } },
  respuestas: { a: { opcion: 2, t: 1000 }, b: { opcion: 1, t: 3000 }, intruso: { opcion: 0, t: 1000 } },
});
assert.deepEqual(r.conteo, [0, 1, 1, 0]);                        // el intruso (no es jugador) no cuenta
assert.equal(r.actualizacion['jugadores/a/puntos'], 1000);
assert.deepEqual(r.actualizacion['jugadores/a/ultima'], { pregunta: '0', opcion: 2, correcta: true, puntos: 1000 });
assert.equal(r.actualizacion['jugadores/b/puntos'], 100);
assert.equal(r.actualizacion['jugadores/b/tiempo'], 2050);
assert.equal(r.actualizacion['jugadores/c/tiempo'], DURACION);  // sin respuesta: cuenta la duración
assert.deepEqual(r.actualizacion['jugadores/c/ultima'], { pregunta: '0', opcion: -1, correcta: false, puntos: 0 });
assert.equal(r.actualizacion['jugadores/a/puesto'], 1);
assert.equal(r.actualizacion['jugadores/b/puesto'], 2);
assert.equal(r.actualizacion['jugadores/c/puesto'], 3);
assert.deepEqual(r.actualizacion['resultados/0'], { correcta: 2, conteo: [0, 1, 1, 0] });
assert.equal(Object.keys(r.actualizacion).some(k => k.includes('intruso')), false);

console.log('logica: todo bien');
