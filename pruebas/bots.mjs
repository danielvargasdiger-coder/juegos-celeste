// Simula jugadores contra el Firebase real. Requiere pantalla.html abierta con la sesión de Daniel, en la sala y recién reiniciada.
// Uso: node pruebas/bots.mjs [cantidad=60]
// OJO: Firebase permite ~100 cuentas anónimas nuevas por hora por IP. No correrlo dos veces seguidas ni el día del evento.
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getDatabase, ref, set, onValue, get, serverTimestamp } from 'firebase/database';
import { config } from '../trivia/config.js';
import { puntos } from '../trivia/logica.js';

const N = +(process.argv[2] || 60);
const espera = ms => new Promise(r => setTimeout(r, ms));
const fallos = [];
async function debeFallar(nombre, promesa) {
  try { await promesa; fallos.push(`NO se bloqueó: ${nombre}`); }
  catch { console.log(`  bloqueado como se esperaba: ${nombre}`); }
}

async function bot(i) {
  await espera(Math.random() * 8000);                                   // llegan escalonados, algunos con la pregunta abierta
  const app = initializeApp(config, 'bot' + i);
  const db = getDatabase(app);
  const { user } = await signInAnonymously(getAuth(app));
  const uid = user.uid, registro = {};
  await set(ref(db, 'jugadores/' + uid), { nombre: i % 10 === 0 ? 'María' : `Bot ${i}`, unido: serverTimestamp() });

  if (i === 0) {
    await debeFallar('escribir mis propios puntos', set(ref(db, `jugadores/${uid}/puntos`), 99999));
    await debeFallar('volver a crear mi jugador', set(ref(db, 'jugadores/' + uid), { nombre: 'Otro', unido: serverTimestamp() }));
    await debeFallar('cambiar el estado del juego', set(ref(db, 'juego/estado'), 'final'));
    await debeFallar('crear otro jugador', set(ref(db, 'jugadores/uid-ajeno'), { nombre: 'X', unido: serverTimestamp() }));
    await debeFallar('leer las respuestas de todos', get(ref(db, 'respuestas')));
  }

  return new Promise(fin => {
    let vista = null, probadoCierre = false;
    onValue(ref(db, 'juego'), async s => {
      const j = s.val();
      if (!j) return;
      if (j.estado === 'final') return fin({ uid, db, registro });
      if (j.estado === 'respuesta' && i === 1 && j.clave === '1' && !probadoCierre) {
        probadoCierre = true;
        await debeFallar('responder con la pregunta cerrada', set(ref(db, `respuestas/1/${uid}`), { opcion: 0, t: serverTimestamp() }));
      }
      if (j.estado !== 'pregunta' || j.clave === vista) return;
      vista = j.clave;
      if (i === 1 && j.clave === '1') return;                            // el bot 1 deja pasar la pregunta 2 para probar la regla de cierre
      if (Math.random() < 0.1) return;                                    // 10 % no responde
      await espera(300 + Math.random() * 16000);
      const opcion = Math.floor(Math.random() * 4);
      try {
        await set(ref(db, `respuestas/${j.clave}/${uid}`), { opcion, t: serverTimestamp() });
        const t = (await get(ref(db, `respuestas/${j.clave}/${uid}`))).val().t;
        registro[j.clave] = { opcion, t, inicio: j.inicio, duracion: j.duracion, doble: !!j.doble };
        if (i === 0) await debeFallar('responder dos veces', set(ref(db, `respuestas/${j.clave}/${uid}`), { opcion: (opcion + 1) % 4, t: serverTimestamp() }));
      } catch { /* llegó tarde: la regla la rechazó, cuenta como sin respuesta */ }
    });
  });
}

async function verificar({ uid, db, registro }) {
  const [yo, res] = await Promise.all([get(ref(db, 'jugadores/' + uid)), get(ref(db, 'resultados'))]);
  const r = res.val() || {};
  let esperado = 0;
  for (const [c, x] of Object.entries(registro)) esperado += puntos(x.t - x.inicio, x.duracion, x.opcion === r[c].correcta, x.doble);
  const real = yo.val().puntos || 0;
  if (real !== esperado) fallos.push(`puntaje de ${yo.val().nombre}: ${real} en Firebase, ${esperado} esperado`);
}

console.log(`Conectando ${N} jugadores. Dale «Empezar» en el televisor cuando aparezcan y juega hasta el podio.`);
const bots = await Promise.all(Array.from({ length: N }, (_, i) => bot(i)));
for (const b of bots) await verificar(b);
console.log(fallos.length ? 'FALLOS:\n' + fallos.join('\n') : `Todo bien: ${N} jugadores, puntajes y reglas correctos.`);
process.exit(fallos.length ? 1 : 0);
