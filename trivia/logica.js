// Lógica pura de la trivia: sin DOM ni Firebase. La usan pantalla.html, index.html y las pruebas.
export const DURACION = 20000;

export function puntos(dt, duracion, correcta, doble) {
  if (!correcta) return 0;
  const d = Math.min(Math.max(dt, 0), duracion);
  return Math.round(1000 * (1 - d / (2 * duracion))) * (doble ? 2 : 1);
}

export const normalizar = nombre => nombre.trim().replace(/\s+/g, ' ').slice(0, 20).trim();

const clave = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const porLlegada = ([ua, a], [ub, b]) => (a.unido || 0) - (b.unido || 0) || (ua < ub ? -1 : 1);

export function nombresVisibles(jugadores) {
  const vistos = {}, out = {};
  for (const [uid, j] of Object.entries(jugadores).sort(porLlegada)) {
    const k = clave(j.nombre);
    vistos[k] = (vistos[k] || 0) + 1;
    out[uid] = vistos[k] > 1 ? `${j.nombre} ${vistos[k]}` : j.nombre;
  }
  return out;
}

export function ordenar(jugadores) {
  return Object.entries(jugadores)
    .sort((x, y) => (y[1].puntos || 0) - (x[1].puntos || 0) || (x[1].tiempo || 0) - (y[1].tiempo || 0) || porLlegada(x, y))
    .map(([uid]) => uid);
}

export function cerrarPregunta({ p, pregunta, inicio, duracion, jugadores, respuestas }) {
  const conteo = [0, 0, 0, 0], nuevos = {};
  for (const [uid, j] of Object.entries(jugadores)) {
    const r = respuestas[uid];
    if (r) conteo[r.opcion]++;
    const correcta = !!r && r.opcion === pregunta.correcta;
    const dt = r ? Math.min(Math.max(r.t - inicio, 0), duracion) : duracion;
    const pts = puntos(dt, duracion, correcta, !!pregunta.doble);
    nuevos[uid] = { ...j, puntos: (j.puntos || 0) + pts, tiempo: (j.tiempo || 0) + dt,
      ultima: { pregunta: p, opcion: r ? r.opcion : -1, correcta, puntos: pts } };
  }
  ordenar(nuevos).forEach((uid, i) => { nuevos[uid].puesto = i + 1; });
  const actualizacion = { [`resultados/${p}`]: { correcta: pregunta.correcta, conteo } };
  for (const [uid, j] of Object.entries(nuevos))
    for (const k of ['puntos', 'tiempo', 'puesto', 'ultima']) actualizacion[`jugadores/${uid}/${k}`] = j[k];
  return { actualizacion, conteo };
}
