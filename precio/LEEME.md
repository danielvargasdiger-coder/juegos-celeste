# El precio justo de la paternidad

Juego del baby shower de Celeste. En el televisor sale un producto de bebé y cada invitado escribe en su celular cuánto cree que cuesta. Gana la ronda quien quede más cerca **sin pasarse**.

## Enlaces

- Televisor (Daniel, con Google): https://danielvargasdiger-coder.github.io/juegos-celeste/precio/pantalla.html
- Celulares (se abre con el QR del televisor): https://danielvargasdiger-coder.github.io/juegos-celeste/precio/

## Cómo se juega

1. Abre la pantalla en el computador del televisor, entra con Google y pon «Pantalla completa».
2. Los invitados escanean el QR, eligen un apodo y su animalito (y le cambian el color si quieren).
3. Para sacar a alguien de la sala (por ejemplo, un apodo de mal gusto), toca su nombre en el televisor. Puede volver a entrar con otro apodo.
4. **Barra espaciadora** (o el botón) para avanzar: Empezar → Cerrar respuestas → revelación → Ver tabla → Siguiente producto.
5. Cada ronda dura 40 s y se cierra sola cuando se acaba el tiempo o cuando todos respondieron.
6. La revelación tiene 3 s de suspenso y luego muestra el precio, la gráfica de respuestas (verde: no se pasaron, rojo: se pasaron), los 3 más cercanos, la respuesta más alejada, cuántos se pasaron y un dato curioso.
7. Después de la ronda 10 sale el podio con el top 3.

## Puntaje

- Si te pasas del precio: 0.
- Si no te pasas: 1000 × tu precio ÷ precio real.
- Bono de +500 si quedas a 2 % o menos por debajo.
- La última ronda (el coche UPPAbaby) vale doble.
- Empate en la ronda: gana quien respondió primero. Empate en la tabla: gana quien sumó menos tiempo.

## Productos

Están en `productos-4b9e1d.js`. El nombre del archivo es difícil de adivinar para que nadie busque los precios, aunque el repositorio es público. El orden de la lista es el orden de las rondas.

Los precios son los de Falabella del 13-nov-2026 y quedan fijos aunque la tienda los cambie. En cada producto están la fuente, el vendedor y la fecha. Las fotos están en `img/` y salen de la página de cada producto.

## Antes del evento

- Pega en Firebase las reglas de `reglas.json` (Realtime Database → Reglas → Publicar).
- Cierra la pantalla de la trivia antes de abrir la del precio. Abre una sola pantalla de anfitrión.
- Al terminar la trivia, los celulares se desconectan solos. Así nunca se pasa del límite gratis de 100 conexiones.
- Ensayo: «Reiniciar y borrar datos» → 3 o 4 celulares → jugar 2 rondas → recargar un celular en plena ronda (debe volver a donde iba) → «Reiniciar y borrar datos» otra vez.

## Privacidad

Solo se guarda el apodo, el animalito y los precios que cada uno escribe. No se guardan nombres reales, correos ni teléfonos. **Reiniciar y borrar datos** lo elimina todo.

## Pruebas

```bash
npm test                         # puntaje y lógica
node pruebas/bots-precio.mjs 80  # 80 jugadores reales contra Firebase (subir antes el cupo de registros; nunca el día del evento)
```
