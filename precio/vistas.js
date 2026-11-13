// HTML de cada escena del televisor. Funciones puras: reciben el estado y devuelven texto (sin Firebase).
import { avatar } from '../avatar.js';
import { ordenar } from '../trivia/logica.js';
import { pesos } from './logica.js';

export const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const quien = (uid, jugadores, nombres) => jugadores[uid] ? `${avatar(jugadores[uid].avatar)}<span>${esc(nombres[uid])}</span>` : '<span>—</span>';

export const sala = ({ url, jugadores, nombres }) => `
  <div class="sala">
    <div class="qr"><div id="qr"></div><div class="url">${esc(url.replace(/^https?:\/\//, ''))}</div></div>
    <div>
      <p class="kicker">Escanea el código con tu celular</p>
      <p class="grande">Elige un apodo y tu animalito. Adivina el precio sin pasarte.</p>
      <div class="lista">${Object.keys(nombres).map(uid => `<button type="button" class="chip" data-uid="${uid}">${quien(uid, jugadores, nombres)}</button>`).join('') || '<span class="chip">Aún no entra nadie</span>'}</div>
    </div>
  </div>`;

const foto = j => `<div class="foto"><img src="img/${esc(j.foto)}" alt=""></div>`;

export const ronda = ({ juego: j, n, nr, seg }) => `
  <div class="producto">
    ${foto(j)}
    <div class="ficha">
      <p class="kicker">Ronda ${j.ronda + 1} de ${j.total}${j.doble ? ' · <span class="doble">Vale doble</span>' : ''}</p>
      <h2 class="nombre">${esc(j.nombre)}</h2>
      <p class="pres">${esc(j.presentacion)}</p>
      <p class="pregunta">¿Cuánto cuesta?</p>
      <div class="reloj"><b id="seg">${seg}</b><span>${nr} de ${n} respondieron</span></div>
    </div>
  </div>`;

// Recta de precios en escala logarítmica: verde = no se pasó, rojo = se pasó; la línea dorada es el precio real.
function recta(precios, real) {
  if (!precios.length) return '';
  const lo = Math.log(Math.min(real, ...precios) / 1.4), hi = Math.log(Math.max(real, ...precios) * 1.4);
  const x = v => ((Math.log(v) - lo) / (hi - lo) * 100).toFixed(2);
  const puntos = precios.map((p, k) => `<i class="${p > real ? 'mal' : 'bien'}" style="left:${x(p)}%;top:${15 + (k * 37) % 70}%"></i>`).join('');
  return `<div class="recta">${puntos}<b style="left:${x(real)}%"></b></div>
    <div class="leyenda"><span class="bien">No se pasaron</span><span class="mal">Se pasaron</span></div>`;
}

export function revela({ juego: j, resultado: r, jugadores, nombres, suspenso }) {
  if (!r) return `<div class="producto">${foto(j)}<div class="ficha"><p class="grande">Calculando…</p></div></div>`;
  if (suspenso) return `<div class="producto">${foto(j)}<div class="ficha"><p class="kicker">${esc(j.nombre)}</p>
    <p class="grande">El precio justo es…</p><p class="cuenta">${suspenso}</p></div></div>`;
  const cercanos = r.cercanos || [];
  const podio = cercanos.map((c, k) => `<li><span class="p">${k + 1}</span>${quien(c.uid, jugadores, nombres)}<span class="v">${pesos(c.precio)}</span><span class="pts">+${c.puntos}</span></li>`).join('')
    || '<li><span>Nadie quedó por debajo</span></li>';
  const lejos = r.alejada ? `<div class="caja"><p class="kicker">La más alejada</p><div class="quien">${quien(r.alejada.uid, jugadores, nombres)}</div><p class="v">${pesos(r.alejada.precio)}</p></div>` : '';
  return `
  <div class="revela">
    ${foto(j)}
    <div class="ficha">
      <p class="kicker">${esc(j.nombre)}</p>
      <p class="precio">${pesos(r.real)}</p>
      ${recta(r.precios || [], r.real)}
    </div>
    <div class="caja podio-r"><p class="kicker">Más cerca sin pasarse</p><ol class="cerca">${podio}</ol></div>
    <div class="lado">${lejos}<div class="caja"><p class="kicker">Se pasaron</p><p class="v">${r.pasados || 0} de ${r.respondieron || 0}</p></div></div>
    <p class="dato">${esc(j.dato || '')}</p>
  </div>`;
}

export function tabla({ juego: j, jugadores, nombres }) {
  const o = ordenar(jugadores).slice(0, 10);
  return `<p class="kicker">Así van · ronda ${j.ronda + 1} de ${j.total}</p>
    <ol class="rank">${o.map((uid, k) => `<li><span class="p">${k + 1}</span>${quien(uid, jugadores, nombres)}<span class="pts">${jugadores[uid].puntos || 0}</span></li>`).join('')}</ol>`;
}

export function final({ jugadores, nombres }) {
  const o = ordenar(jugadores);
  const podio = [1, 0, 2].filter(k => o[k]).map(k =>
    `<div class="o${k + 1}">${avatar(jugadores[o[k]].avatar)}<span class="script">${k + 1}</span><span>${esc(nombres[o[k]])}</span><span>${jugadores[o[k]].puntos || 0}</span></div>`).join('');
  const resto = o.slice(3, 10).map((uid, k) => `<span class="chip">${k + 4}. ${quien(uid, jugadores, nombres)}</span>`).join('');
  return `<p class="kicker">¡Ganadores del precio justo!</p><div class="podio">${podio}</div><div class="lista">${resto}</div>`;
}
