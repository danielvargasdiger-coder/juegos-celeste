// Avatares de los jugadores: animalitos tiernos cuyo pelaje toma el color elegido (--piel). Se guarda como { i, c } (índices).
const L = '#fff8f0', D = '#4a3038', R = '#f49ab0';                      // claro, rasgos oscuros, rubor
const S = 'stroke="#6b4552" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"';
const P = `fill="var(--piel)" ${S}`;
const sombra = 'fill="#000" opacity=".13"';
const ojos = (y = 52, dx = 12, r = 4.6) => [-1, 1].map(s =>
  `<circle cx="${50 + s * dx}" cy="${y}" r="${r}" fill="${D}"/><circle cx="${50 + s * dx + 1.6}" cy="${y - 1.7}" r="${r / 3}" fill="#fff"/>`).join('');
const mejillas = (y = 62, dx = 22) => `<ellipse cx="${50 - dx}" cy="${y}" rx="6" ry="3.6" fill="${R}" opacity=".6"/><ellipse cx="${50 + dx}" cy="${y}" rx="6" ry="3.6" fill="${R}" opacity=".6"/>`;
const boca = (y = 67) => `<path d="M44 ${y} q3 3.4 6 0 q3 3.4 6 0" fill="none" ${S}/>`;
const nariz = (y = 61) => `<ellipse cx="50" cy="${y}" rx="4.6" ry="3.4" fill="${D}"/>`;
const bigotes = y => `<path d="M30 ${y} h-12 M30 ${y + 5} l-11 3 M70 ${y} h12 M70 ${y + 5} l11 3" ${S} fill="none" opacity=".6"/>`;

export const ANIMALES = [
  ['Perro', `<ellipse cx="22" cy="50" rx="11" ry="22" transform="rotate(18 22 50)" ${P}/><ellipse cx="22" cy="50" rx="11" ry="22" transform="rotate(18 22 50)" ${sombra}/>
    <ellipse cx="78" cy="50" rx="11" ry="22" transform="rotate(-18 78 50)" ${P}/><ellipse cx="78" cy="50" rx="11" ry="22" transform="rotate(-18 78 50)" ${sombra}/>
    <circle cx="50" cy="55" r="30" ${P}/><ellipse cx="50" cy="66" rx="14" ry="10" fill="${L}"/>${ojos(50)}${mejillas(62, 21)}${nariz(61)}${boca(67)}`],
  ['Gato', `<path d="M23 44 L26 13 L47 30 Z M77 44 L74 13 L53 30 Z" ${P}/><path d="M28 34 L29 21 L39 30 Z M72 34 L71 21 L61 30 Z" fill="${R}" opacity=".7"/>
    <ellipse cx="50" cy="56" rx="33" ry="28" ${P}/>${ojos(52, 13)}${mejillas(63, 23)}<path d="M46.5 60 h7 l-3.5 4 z" fill="${R}" ${S} stroke-width="1.6"/>${boca(66)}${bigotes(60)}`],
  ['Osito', `<circle cx="25" cy="29" r="12" ${P}/><circle cx="75" cy="29" r="12" ${P}/><circle cx="25" cy="29" r="5.5" fill="${L}"/><circle cx="75" cy="29" r="5.5" fill="${L}"/>
    <circle cx="50" cy="55" r="31" ${P}/><ellipse cx="50" cy="66" rx="13" ry="10" fill="${L}"/>${ojos(51)}${mejillas(62, 22)}${nariz(61)}${boca(67)}`],
  ['Panda', `<circle cx="25" cy="29" r="12" fill="${D}"/><circle cx="75" cy="29" r="12" fill="${D}"/>
    <circle cx="50" cy="55" r="31" ${P}/><ellipse cx="37" cy="52" rx="8" ry="10.5" transform="rotate(25 37 52)" fill="${D}"/><ellipse cx="63" cy="52" rx="8" ry="10.5" transform="rotate(-25 63 52)" fill="${D}"/>
    <circle cx="38" cy="51" r="3.4" fill="#fff"/><circle cx="62" cy="51" r="3.4" fill="#fff"/>${mejillas(64, 22)}${nariz(62)}${boca(68)}`],
  ['Conejo', `<ellipse cx="37" cy="22" rx="8.5" ry="21" transform="rotate(-8 37 22)" ${P}/><ellipse cx="63" cy="22" rx="8.5" ry="21" transform="rotate(8 63 22)" ${P}/>
    <ellipse cx="37" cy="23" rx="4" ry="14" transform="rotate(-8 37 23)" fill="${R}" opacity=".7"/><ellipse cx="63" cy="23" rx="4" ry="14" transform="rotate(8 63 23)" fill="${R}" opacity=".7"/>
    <circle cx="50" cy="60" r="28" ${P}/>${ojos(57, 11)}${mejillas(67, 19)}<ellipse cx="50" cy="65" rx="3.4" ry="2.6" fill="${R}"/>${boca(69)}`],
  ['Llama', `<ellipse cx="33" cy="22" rx="5.5" ry="13" transform="rotate(-20 33 22)" ${P}/><ellipse cx="67" cy="22" rx="5.5" ry="13" transform="rotate(20 67 22)" ${P}/>
    <ellipse cx="50" cy="58" rx="24" ry="31" ${P}/><g fill="${L}" ${S}><circle cx="41" cy="30" r="7"/><circle cx="50" cy="26" r="8"/><circle cx="59" cy="30" r="7"/></g>
    <ellipse cx="50" cy="76" rx="15" ry="11" fill="${L}"/>${ojos(53, 10)}${mejillas(64, 17)}<path d="M46 73 q4 3 8 0" fill="none" ${S}/><path d="M47 70 h6" ${S}/>`],
  ['Zorro', `<path d="M20 46 L24 12 L44 30 Z M80 46 L76 12 L56 30 Z" ${P}/><path d="M26 36 L27 21 L37 30 Z M74 36 L73 21 L63 30 Z" fill="${D}" opacity=".55"/>
    <path d="M16 46 Q50 18 84 46 Q80 72 50 86 Q20 72 16 46 Z" ${P}/><path d="M20 54 Q36 62 50 64 Q64 62 80 54 Q74 74 50 86 Q26 74 20 54 Z" fill="${L}"/>
    ${ojos(49, 13)}${mejillas(60, 25)}<ellipse cx="50" cy="73" rx="4.6" ry="3.4" fill="${D}"/>`],
  ['Koala', `<circle cx="21" cy="40" r="16" ${P}/><circle cx="79" cy="40" r="16" ${P}/><circle cx="21" cy="40" r="9" fill="${L}"/><circle cx="79" cy="40" r="9" fill="${L}"/>
    <circle cx="50" cy="56" r="29" ${P}/>${ojos(50, 13, 4.2)}${mejillas(64, 21)}<ellipse cx="50" cy="61" rx="7" ry="9.5" fill="${D}"/>`],
  ['Cerdito', `<path d="M24 38 L22 18 L40 28 Z M76 38 L78 18 L60 28 Z" ${P}/>
    <circle cx="50" cy="55" r="31" ${P}/>${ojos(48, 13)}${mejillas(60, 23)}<ellipse cx="50" cy="63" rx="12" ry="8.5" ${P}/><ellipse cx="50" cy="63" rx="12" ry="8.5" fill="${R}" opacity=".45"/>
    <ellipse cx="46" cy="63" rx="2" ry="3" fill="${D}"/><ellipse cx="54" cy="63" rx="2" ry="3" fill="${D}"/>`],
  ['Ratón', `<circle cx="24" cy="32" r="17" ${P}/><circle cx="76" cy="32" r="17" ${P}/><circle cx="24" cy="32" r="10" fill="${R}" opacity=".6"/><circle cx="76" cy="32" r="10" fill="${R}" opacity=".6"/>
    <ellipse cx="50" cy="60" rx="27" ry="25" ${P}/>${ojos(56, 10)}${mejillas(65, 18)}<circle cx="50" cy="65" r="3" fill="${R}"/>${bigotes(64)}`],
  ['León', `<g ${P}>${Array.from({ length: 12 }, (_, k) => { const a = k * Math.PI / 6; return `<circle cx="${(50 + 33 * Math.cos(a)).toFixed(1)}" cy="${(54 + 33 * Math.sin(a)).toFixed(1)}" r="12"/>`; }).join('')}</g>
    <circle cx="50" cy="54" r="38" ${sombra}/><circle cx="31" cy="31" r="6" ${P}/><circle cx="69" cy="31" r="6" ${P}/><circle cx="50" cy="55" r="26" ${P}/>
    <ellipse cx="50" cy="64" rx="12" ry="8.5" fill="${L}"/>${ojos(50, 10)}${mejillas(61, 18)}${nariz(60)}${boca(66)}`],
  ['Mono', `<circle cx="19" cy="54" r="11" ${P}/><circle cx="81" cy="54" r="11" ${P}/><circle cx="19" cy="54" r="5.5" fill="${L}"/><circle cx="81" cy="54" r="5.5" fill="${L}"/>
    <circle cx="50" cy="54" r="31" ${P}/><g fill="${L}"><ellipse cx="41" cy="50" rx="11" ry="12"/><ellipse cx="59" cy="50" rx="11" ry="12"/><ellipse cx="50" cy="66" rx="18" ry="13"/></g>
    ${ojos(50, 9)}${mejillas(64, 15)}<circle cx="47.5" cy="61" r="1.6" fill="${D}"/><circle cx="52.5" cy="61" r="1.6" fill="${D}"/>${boca(68)}`],
  ['Rana', `<circle cx="31" cy="34" r="13" ${P}/><circle cx="69" cy="34" r="13" ${P}/><circle cx="31" cy="34" r="8" fill="#fff"/><circle cx="69" cy="34" r="8" fill="#fff"/>
    <ellipse cx="50" cy="60" rx="37" ry="25" ${P}/><circle cx="32" cy="35" r="4.4" fill="${D}"/><circle cx="68" cy="35" r="4.4" fill="${D}"/>
    ${mejillas(64, 24)}<path d="M34 64 Q50 78 66 64" fill="none" ${S}/>`],
  ['Pollito', `<path d="M47 22 q-2 -9 4 -12 M53 23 q4 -8 10 -7" fill="none" ${S}/><circle cx="50" cy="56" r="32" ${P}/>
    <path d="M18 62 q-8 -10 2 -18 M82 62 q8 -10 -2 -18" ${P}/>${ojos(50, 12)}${mejillas(61, 21)}<path d="M43 58 L57 58 L50 67 Z" fill="#f5a64b" ${S} stroke-width="1.8"/>`],
  ['Búho', `<path d="M22 36 L20 12 L40 26 Z M78 36 L80 12 L60 26 Z" ${P}/><ellipse cx="50" cy="56" rx="33" ry="31" ${P}/>
    <circle cx="36" cy="48" r="12" fill="${L}" ${S}/><circle cx="64" cy="48" r="12" fill="${L}" ${S}/><circle cx="36" cy="48" r="5.5" fill="${D}"/><circle cx="64" cy="48" r="5.5" fill="${D}"/>
    <circle cx="38" cy="46" r="1.8" fill="#fff"/><circle cx="66" cy="46" r="1.8" fill="#fff"/><path d="M45 57 L55 57 L50 66 Z" fill="#f5a64b" ${S} stroke-width="1.8"/>
    <path d="M38 74 q4 4 8 0 q4 4 8 0 q4 4 8 0" fill="none" ${S} opacity=".5"/>`],
  ['Elefante', `<ellipse cx="20" cy="52" rx="16" ry="21" ${P}/><ellipse cx="80" cy="52" rx="16" ry="21" ${P}/><ellipse cx="21" cy="52" rx="9" ry="13" fill="${R}" opacity=".55"/><ellipse cx="79" cy="52" rx="9" ry="13" fill="${R}" opacity=".55"/>
    <circle cx="50" cy="50" r="27" ${P}/><path d="M43 58 Q42 80 53 86 Q61 88 61 81 Q54 80 55 58 Z" ${P}/>${ojos(46, 11)}${mejillas(58, 19)}`],
  ['Pingüino', `<circle cx="50" cy="55" r="32" ${P}/><path d="M50 36 C38 26 22 36 26 54 C28 70 40 80 50 80 C60 80 72 70 74 54 C78 36 62 26 50 36 Z" fill="${L}"/>
    ${ojos(50, 11)}${mejillas(61, 19)}<path d="M44 58 Q50 54 56 58 Q50 66 44 58 Z" fill="#f5a64b" ${S} stroke-width="1.8"/>`],
  ['Oveja', `<g ${P}>${Array.from({ length: 10 }, (_, k) => { const a = k * Math.PI / 5; return `<circle cx="${(50 + 30 * Math.cos(a)).toFixed(1)}" cy="${(52 + 28 * Math.sin(a)).toFixed(1)}" r="12"/>`; }).join('')}</g>
    <ellipse cx="22" cy="58" rx="10" ry="5" transform="rotate(-25 22 58)" fill="${L}" ${S}/><ellipse cx="78" cy="58" rx="10" ry="5" transform="rotate(25 78 58)" fill="${L}" ${S}/>
    <ellipse cx="50" cy="60" rx="20" ry="23" fill="${L}" ${S}/><g ${P}><circle cx="42" cy="37" r="8"/><circle cx="50" cy="34" r="9"/><circle cx="58" cy="37" r="8"/></g>
    ${ojos(57, 8, 4)}${mejillas(67, 13)}<path d="M47 69 q3 3 6 0" fill="none" ${S}/>`],
  ['Tigre', `<circle cx="26" cy="30" r="11" ${P}/><circle cx="74" cy="30" r="11" ${P}/><circle cx="26" cy="30" r="5" fill="${L}"/><circle cx="74" cy="30" r="5" fill="${L}"/>
    <ellipse cx="50" cy="56" rx="33" ry="29" ${P}/><g fill="${D}" opacity=".55"><path d="M44 28 l2 9 l2 -9z M50 27 l1.5 11 l1.5 -11z M56 28 l-2 9 l-2 -9z"/>
    <path d="M17 52 l12 2 l-12 3z M17 61 l11 0 l-10 4z M83 52 l-12 2 l12 3z M83 61 l-11 0 l10 4z"/></g>
    <ellipse cx="50" cy="66" rx="15" ry="10" fill="${L}"/>${ojos(51, 13)}${mejillas(62, 22)}${nariz(61)}${boca(67)}`],
  ['Unicornio', `<path d="M50 6 L44 32 L56 32 Z" fill="#f3d77e" ${S}/><ellipse cx="34" cy="28" rx="6" ry="11" transform="rotate(-25 34 28)" ${P}/><ellipse cx="66" cy="28" rx="6" ry="11" transform="rotate(25 66 28)" ${P}/>
    <ellipse cx="50" cy="58" rx="27" ry="30" ${P}/><g ${S}><circle cx="73" cy="40" r="8" fill="#f5b8c9"/><circle cx="77" cy="54" r="7" fill="#cdb7ea"/><circle cx="75" cy="67" r="6" fill="#a9cbe8"/></g>
    <ellipse cx="50" cy="74" rx="15" ry="11" fill="${L}"/>${ojos(53, 10)}${mejillas(63, 17)}<circle cx="45" cy="73" r="1.6" fill="${D}"/><circle cx="55" cy="73" r="1.6" fill="${D}"/><path d="M45 79 q5 3 10 0" fill="none" ${S}/>`],
].map(([nombre, svg]) => ({ nombre, svg }));

export const COLORES = ['#d9b48f', '#f1e2c6', '#bdb6c9', '#f5b8c9', '#f7c59f', '#f3d77e', '#a9d9c3', '#a9cbe8', '#cdb7ea', '#ffffff'];

const valido = a => a && Number.isInteger(a.i) && Number.isInteger(a.c) && ANIMALES[a.i] && COLORES[a.c];
const dibujo = a => `<svg viewBox="0 0 100 100" aria-hidden="true">${ANIMALES[a.i].svg}</svg>`;

export const avatar = a => valido(a)
  ? `<span class="av" style="--piel:${COLORES[a.c]}" title="${ANIMALES[a.i].nombre}">${dibujo(a)}</span>`
  : '<span class="av"></span>';

// Pinta el selector en `caja` y devuelve una función que entrega el avatar elegido.
export function selectorAvatar(caja) {
  const elegido = { i: Math.floor(Math.random() * ANIMALES.length), c: Math.floor(Math.random() * COLORES.length) };
  caja.innerHTML = `
    <div class="av-ver"></div>
    <div class="av-iconos" role="group" aria-label="Animal">${ANIMALES.map((a, i) =>
      `<button type="button" data-i="${i}" aria-label="${a.nombre}">${dibujo({ i })}</button>`).join('')}</div>
    <div class="av-colores" role="group" aria-label="Color">${COLORES.map((c, i) =>
      `<button type="button" data-c="${i}" aria-label="Color ${i + 1}" style="background:${c}"></button>`).join('')}</div>`;
  const marcar = () => {
    caja.querySelector('.av-ver').innerHTML = avatar(elegido);
    caja.style.setProperty('--piel', COLORES[elegido.c]);
    caja.querySelectorAll('[data-i]').forEach(b => b.setAttribute('aria-pressed', +b.dataset.i === elegido.i));
    caja.querySelectorAll('[data-c]').forEach(b => b.setAttribute('aria-pressed', +b.dataset.c === elegido.c));
  };
  caja.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.i) elegido.i = +b.dataset.i;
    if (b.dataset.c) elegido.c = +b.dataset.c;
    marcar();
  });
  marcar();
  return () => ({ ...elegido });
}
