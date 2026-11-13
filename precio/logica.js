// Lógica pura de «El precio justo de la paternidad»: sin DOM ni Firebase. La usan pantalla.html, index.html y las pruebas.
import { ordenar } from '../trivia/logica.js';

export const DURACION = 40000;
export const MIN = 1000, MAX = 50000000;   // también en reglas.json

export function puntosPrecio(precio, real, doble) {
  if (precio == null || precio > real) return 0;
  const base = Math.round(1000 * precio / real) + (real - precio <= real * 0.02 ? 500 : 0);
  return base * (doble ? 2 : 1);
}

export const pesos = n => '$ ' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
export const leerPrecio = txt => +(String(txt).replace(/\D/g, '').slice(0, 8) || 0);

const lejania = f => Math.max(f.precio / f.real, f.real / f.precio);

export function cerrarRonda({ r, producto, inicio, duracion, jugadores, respuestas }) {
  const real = producto.precio, doble = !!producto.doble, filas = [], nuevos = {};
  for (const [uid, j] of Object.entries(jugadores)) {
    const x = respuestas[uid];
    const dt = x ? Math.min(Math.max(x.t - inicio, 0), duracion) : duracion;
    const pts = puntosPrecio(x ? x.precio : null, real, doble);
    nuevos[uid] = { ...j, puntos: (j.puntos || 0) + pts, tiempo: (j.tiempo || 0) + dt,
      ultima: { ronda: r, precio: x ? x.precio : -1, puntos: pts } };
    if (x) filas.push({ uid, precio: x.precio, real, pts, dt });
  }
  ordenar(nuevos).forEach((uid, i) => { nuevos[uid].puesto = i + 1; });
  // Más cerca sin pasarse; empate → quien respondió primero.
  const cercanos = filas.filter(f => f.precio <= real).sort((a, b) => b.precio - a.precio || a.dt - b.dt)
    .slice(0, 3).map(f => ({ uid: f.uid, precio: f.precio, puntos: f.pts }));
  const lejos = filas.reduce((m, f) => (!m || lejania(f) > lejania(m) ? f : m), null);
  const actualizacion = { [`resultados/${r}`]: {
    real, cercanos, alejada: lejos && { uid: lejos.uid, precio: lejos.precio },
    pasados: filas.filter(f => f.precio > real).length, respondieron: filas.length, precios: filas.map(f => f.precio),
  } };
  for (const [uid, j] of Object.entries(nuevos))
    for (const k of ['puntos', 'tiempo', 'puesto', 'ultima']) actualizacion[`jugadores/${uid}/${k}`] = j[k];
  return { actualizacion };
}
