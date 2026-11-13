import assert from 'node:assert/strict';
import { puntosPrecio, pesos, leerPrecio, cerrarRonda, DURACION, MIN, MAX } from '../precio/logica.js';
import { PRODUCTOS } from '../precio/productos-4b9e1d.js';

assert.equal(DURACION, 40000);

// Puntaje: 1000 × precio / real; +500 si queda a 2 % o menos por debajo; pasarse da máximo 500 (500 × real / precio); ×2 en la final
assert.equal(puntosPrecio(100001, 100000, false), 500);          // se pasó por $ 1
assert.equal(puntosPrecio(250000, 100000, false), 200);          // se pasó al doble y medio
assert.equal(puntosPrecio(250000, 100000, true), 400);
assert.equal(puntosPrecio(50000000, 55000, false), 1);           // locura total: casi nada, pero no 0
assert.equal(puntosPrecio(100000, 100000, false), 1500);         // exacto: 1000 + bono
assert.equal(puntosPrecio(98000, 100000, false), 1480);          // justo en el 2 %: 980 + 500
assert.equal(puntosPrecio(97999, 100000, false), 980);           // apenas fuera del 2 %
assert.equal(puntosPrecio(50000, 100000, false), 500);
assert.equal(puntosPrecio(50000, 100000, true), 1000);           // vale doble
assert.equal(puntosPrecio(100000, 100000, true), 3000);
assert.equal(puntosPrecio(null, 100000, true), 0);               // no respondió
assert.equal(puntosPrecio(1000, 4599900, false), 0);             // redondea a 0, no negativo

// Formato y lectura de precios
assert.equal(pesos(85000).replace('\u00a0', ' '), '$ 85.000');
assert.equal(pesos(4599900).replace('\u00a0', ' '), '$ 4.599.900');
assert.equal(pesos(1000).replace('\u00a0', ' '), '$ 1.000');
assert.equal(pesos(950).replace('\u00a0', ' '), '$ 950');
assert.equal(leerPrecio('$ 85.000'), 85000);
assert.equal(leerPrecio(pesos(4599900)), 4599900);         // el campo del celular se relee bien
assert.equal(leerPrecio('85,000'), 85000);
assert.equal(leerPrecio('abc'), 0);
assert.equal(leerPrecio('9'.repeat(20)), 99999999);              // se corta a 8 cifras
assert.ok(MIN === 1000 && MAX === 50000000);

// Cierre de ronda
const jugadores = {
  a: { nombre: 'Ana', unido: 1 },
  b: { nombre: 'Beto', unido: 2, puntos: 100, tiempo: 50 },
  c: { nombre: 'Caro', unido: 3 },
  d: { nombre: 'Dani', unido: 4 },
  e: { nombre: 'Eva', unido: 5 },
};
const r = cerrarRonda({
  r: '0', producto: { precio: 100000 }, inicio: 1000, duracion: DURACION, jugadores,
  respuestas: {
    a: { precio: 90000, t: 6000 },     // 900
    b: { precio: 90000, t: 3000 },     // 900, respondió antes que Ana
    c: { precio: 250000, t: 2000 },    // se pasó
    d: { precio: 5000, t: 9000 },      // 50, el más alejado (20 veces menos)
    intruso: { precio: 100000, t: 1000 },
  },
});
const res = r.actualizacion['resultados/0'];
assert.equal(res.real, 100000);
assert.equal(res.respondieron, 4);                                // el intruso no cuenta
assert.equal(res.pasados, 1);
assert.deepEqual(res.cercanos, [{ uid: 'b', precio: 90000, puntos: 900 }, { uid: 'a', precio: 90000, puntos: 900 }, { uid: 'd', precio: 5000, puntos: 50 }]);
assert.deepEqual(res.alejada, { uid: 'd', precio: 5000 });
assert.deepEqual(res.precios.slice().sort((x, y) => x - y), [5000, 90000, 90000, 250000]);
assert.equal(r.actualizacion['jugadores/b/puntos'], 1000);
assert.equal(r.actualizacion['jugadores/b/tiempo'], 2050);
assert.deepEqual(r.actualizacion['jugadores/c/ultima'], { ronda: '0', precio: 250000, puntos: 200 });
assert.deepEqual(r.actualizacion['jugadores/e/ultima'], { ronda: '0', precio: -1, puntos: 0 });
assert.equal(r.actualizacion['jugadores/e/tiempo'], DURACION);    // no respondió: suma el tiempo completo
assert.equal(r.actualizacion['jugadores/b/puesto'], 1);           // 1000 puntos
assert.equal(r.actualizacion['jugadores/a/puesto'], 2);
assert.equal(r.actualizacion['intruso/puntos'], undefined);

// Nadie respondió / todos se pasaron
const vacio = cerrarRonda({ r: '1', producto: { precio: 5000 }, inicio: 0, duracion: DURACION, jugadores, respuestas: {} });
assert.deepEqual(vacio.actualizacion['resultados/1'], { real: 5000, cercanos: [], alejada: null, pasados: 0, respondieron: 0, precios: [] });
const todos = cerrarRonda({ r: '2', producto: { precio: 5000 }, inicio: 0, duracion: DURACION, jugadores: { a: jugadores.a }, respuestas: { a: { precio: 9000, t: 10 } } });
assert.deepEqual(todos.actualizacion['resultados/2'].cercanos, []);
assert.equal(todos.actualizacion['resultados/2'].pasados, 1);

// Productos: 10, precios entre los límites, solo la última vale doble, todos con foto y fuente
assert.equal(PRODUCTOS.length, 10);
PRODUCTOS.forEach((p, i) => {
  assert.ok(p.nombre && p.foto && p.fuente && p.fecha && p.dato, 'producto ' + i);
  assert.ok(Number.isInteger(p.precio) && p.precio >= MIN && p.precio <= MAX, 'precio ' + i);
  assert.equal(!!p.doble, i === PRODUCTOS.length - 1);
});

console.log('precio: todo bien');
