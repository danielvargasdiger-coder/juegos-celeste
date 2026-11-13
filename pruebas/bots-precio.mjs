// Simula jugadores del precio justo contra el Firebase real. Requiere precio/pantalla.html abierta con la sesión de Daniel, en la sala y recién reiniciada.
// Uso: node pruebas/bots-precio.mjs [cantidad=80]
// OJO: cada bot es una cuenta anónima nueva. Subir antes el cupo de registros en Firebase y no correrlo el día del evento.
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getDatabase, ref, set, onValue, get, serverTimestamp, goOffline, goOnline } from 'firebase/database';
import { config } from '../trivia/config.js';
import { puntosPrecio } from '../precio/logica.js';
import { PRODUCTOS } from '../precio/productos-4b9e1d.js';

const N = +(process.argv[2] || 80);
const espera = ms => new Promise(r => setTimeout(r, ms));
const fallos = [];
async function debeFallar(nombre, promesa) {
  try { await promesa; fallos.push(`NO se bloqueó: ${nombre}`); }
  catch { console.log(`  bloqueado como se esperaba: ${nombre}`); }
}

async function bot(i) {
  await espera(Math.random() * 8000);
  const app = initializeApp(config, 'bot' + i);
  const db = getDatabase(app);
  const R = p => ref(db, 'precio/' + p);
  const { user } = await signInAnonymously(getAuth(app));
  const uid = user.uid, registro = {};

  if (i === 0) await debeFallar('entrar con un avatar que no existe', set(R('jugadores/' + uid), { nombre: 'Raro', avatar: { i: 99, c: 0 }, unido: serverTimestamp() }));
  await set(R('jugadores/' + uid), { nombre: i % 10 === 0 ? 'Tía Marta' : `Bot ${i}`, avatar: { i: i % 20, c: i % 10 }, unido: serverTimestamp() });
  if (i === 0) {
    await debeFallar('escribir mis propios puntos', set(R(`jugadores/${uid}/puntos`), 99999));
    await debeFallar('cambiar el estado del juego', set(R('juego/estado'), 'final'));
    await debeFallar('leer las respuestas de todos', get(R('respuestas')));
    await debeFallar('leer los productos desde la base', get(ref(db, 'precio/productos')));
  }

  return new Promise(fin => {
    let vista = null, probadoCierre = false;
    onValue(R('juego'), async s => {
      const j = s.val();
      if (!j) return;
      if (j.estado === 'final') return fin({ uid, db, registro });
      if (j.estado === 'revela' && i === 1 && j.clave === '1' && !probadoCierre) {
        probadoCierre = true;
        await debeFallar('responder con la ronda cerrada', set(R(`respuestas/1/${uid}`), { precio: 5000, t: serverTimestamp() }));
      }
      if (j.estado !== 'ronda' || j.clave === vista) return;
      vista = j.clave;
      if (i === 1 && j.clave === '1') return;                       // deja pasar la ronda 2 para probar la regla de cierre
      if (Math.random() < 0.1) return;                               // 10 % no responde
      if (i % 7 === 3) { goOffline(db); await espera(3000); goOnline(db); }   // algunos pierden la señal un momento
      await espera(500 + Math.random() * 30000);
      const real = PRODUCTOS[j.ronda].precio;
      const precio = Math.max(1000, Math.round(real * (0.3 + Math.random() * 1.1) / 100) * 100);   // a veces se pasan
      try {
        if (i === 2) await debeFallar('precio fuera de rango', set(R(`respuestas/${j.clave}/${uid}`), { precio: 999, t: serverTimestamp() }));
        await set(R(`respuestas/${j.clave}/${uid}`), { precio, t: serverTimestamp() });
        registro[j.clave] = { precio, doble: !!j.doble, real };
        if (i === 0) await debeFallar('responder dos veces', set(R(`respuestas/${j.clave}/${uid}`), { precio: real, t: serverTimestamp() }));
      } catch { /* llegó tarde: cuenta como sin respuesta */ }
    });
  });
}

async function verificar({ uid, db, registro }) {
  const yo = (await get(ref(db, 'precio/jugadores/' + uid))).val();
  let esperado = 0;
  for (const x of Object.values(registro)) esperado += puntosPrecio(x.precio, x.real, x.doble);
  if ((yo.puntos || 0) !== esperado) fallos.push(`puntaje de ${yo.nombre}: ${yo.puntos} en Firebase, ${esperado} esperado`);
}

console.log(`Conectando ${N} jugadores. Dale «Empezar» en el televisor cuando aparezcan y juega hasta el podio.`);
const bots = await Promise.all(Array.from({ length: N }, (_, i) => bot(i)));
for (const b of bots) await verificar(b);
console.log(fallos.length ? 'FALLOS:\n' + fallos.join('\n') : `Todo bien: ${N} jugadores, puntajes y reglas correctos.`);
process.exit(fallos.length ? 1 : 0);
