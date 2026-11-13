// Pétalos cayendo, iguales a los de la invitación.
export function petalos(caja, n = 16) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cols = ['#f2b6c8', '#eea3b9', '#f7cdb9', '#e8c6ee', '#f9d9e2'];
  for (let i = 0; i < n; i++) {
    const p = document.createElement('span'), s = 8 + Math.random() * 9;
    p.className = 'petal';
    p.style.cssText = `left:${Math.random() * 100}%;width:${s}px;height:${s * 1.15}px;background:${cols[i % cols.length]};animation-duration:${11 + Math.random() * 10}s;animation-delay:${-Math.random() * 18}s`;
    caja.appendChild(p);
  }
}
