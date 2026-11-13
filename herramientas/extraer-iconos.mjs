// Uso: node herramientas/extraer-iconos.mjs ../entregables/bingo-proyeccion.html iconos.js
import fs from 'node:fs';
const [, , origen, destino] = process.argv;
const h = fs.readFileSync(origen, 'utf8');
const ids = ['corazon', 'estrella', 'luna', 'nube'];
const simbolos = ids.map(id => {
  const m = h.match(new RegExp(`<symbol id="i-${id}"[\\s\\S]*?</symbol>`));
  if (!m) throw new Error('no encontré i-' + id);
  return m[0];
}).join('');
const svg = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${simbolos}</defs></svg>`;
fs.writeFileSync(destino, `// Generado por herramientas/extraer-iconos.mjs a partir del bingo. No editar a mano.\ndocument.body.insertAdjacentHTML('afterbegin', ${JSON.stringify(svg)});\n`);
console.log('iconos:', ids.join(', '));
