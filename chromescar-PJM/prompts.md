## 2026-04-27

1. Rediseña el menú principal con tipografía pixel-art (Press Start 2P), colores neón y un aspecto más profesional, acorde al universo Chromescar.
2. Agrega una intro cinemática de 4 diapositivas que explique el contexto: Operación Rapture, los Yermos, la Iron Remnant y el año 2124. El usuario debe poder saltarla.
3. Sustituye los gráficos de marcador por pixel art coherente: fondos parallax, Nora Vidal, los Yermos, sistema de armas, HUD y recogibles. Estilo Ninja Gaiden NES (16-bit).
4. Corrige los siguientes errores: las balas dejan de dispararse tras unos segundos (problema de pooling), los enemigos se apilan en el mismo punto (rango de detección), el nivel no se completa al llegar al final y el `update()` peta cuando el jugador muere.
5. Para el indicador de meta del nivel 1, sustituye el pilar neón abstracto por un edificio pixel-art con puerta y flecha de entrada.
6. Hay un error `drawImage` por culpa del glifo Unicode "▼" en la flecha del edificio. Reemplázalo por un triángulo dibujado con `Graphics.fillTriangle`.
7. Quita todas las etiquetas culturales en texto del nivel 1 y añade en su lugar elementos pixel-art de Madrid: una Puerta de Alcalá transitable (con paso central) y un cartel del Tío Pepe.
8. La `HUDScene` peta entre transiciones de nivel con `drawImage` sobre textura nula. El listener `registry.events.on("changedata")` sigue activo sobre objetos `Text` destruidos. Corrígelo desenganchando el listener en SHUTDOWN/DESTROY, blindando `#refresh` con guardas y try/catch, y manteniendo el HUD activo entre niveles (no detenerlo en transiciones).
9. Quita todos los mensajes de todos los niveles. El segundo nivel te recuerdo que es rural, no puede haber edificios, y el tercero es el interior de una nave. Los niveles deben ser un poco más largos y cada nivel debe tener un indicador de final. El del primero puede ser que Nora entre en un edificio, y el del segundo que llegue a la puerta de la nave. El final del tercero debe ser contra una pared de la nave que empieza a disparar aleatoriamente contra Nora y la pared tiene un nivel de vida antes.

## 2026-04-26

1. Ejecuta el flujo `speckit.git.initialize` para el repositorio actual antes de la configuración de la constitución. Indica si el repositorio ya estaba inicializado, qué cambió y qué bloqueos existen.
2. Quiero crear un juego con HTML, JavaScript y CSS. El juego va a estar ambientado en una Madrid postapocalíptica en el siglo XXII. En el siglo XXI, la Tierra fue atacada en varias ocasiones por una raza extraterrestre. No se conocen sus intenciones, pero sí se sabe que quieren exterminar a los humanos. Tras múltiples ataques durante décadas, la humanidad ha sido diezmada; ahora solo quedan 500 millones de personas en todo el mundo. Hay bases dispersas por todo el planeta con unidades militares y de resistencia. Nuestro héroe es una chica huérfana, criada desde niña en espacios militares. Con tan solo 24 años, ha participado en más de 120 batallas. Su mano derecha es cibernética, un reemplazo tras perderla en combate. Lleva un implante neural de nueva generación y un exoesqueleto. Su nueva misión consiste en capturar una nave enemiga intacta. Para ello debe infiltrarse y tomar una de ellas cuando se produzca una batalla... y ese día ha llegado.
   Con este contexto necesito posibles nombres para el juego y una redacción mejorada de la historia planteada. Se aceptan cambios.
3. Vale, el nombre tiene que ser más hispano. Necesitamos definir el aspecto y el nombre del enemigo. Los enemigos, al morir, se desintegran. Aún no se sabe si son el enemigo en sí o una especie de robots orgánicos. No quedan restos, no se ha podido estudiar su estructura, pero sí se sabe que son vulnerables a nuestras armas, aunque tienen una gran capacidad de aguante y son muchos, muchísimos.
4. Vamos a cambiarlo por Chromescar y la operación debe tener otro nombre.
5. Sigue las instrucciones en `.github/prompts/speckit.constitution.prompt.md` con estos argumentos: Este proyecto es un juego de plataformas pixel art estilo retro que debe estar desarrollado usando HTML, JavaScript y CSS. Debe ser compatible en los navegadores Edge, Firefox, Chrome y Safari.
6. Agrega al constitution.md que el juego es tipo plataformas 2D y se hará en Phaser.
7. Sigue las instrucciones en `.github/prompts/speckit.specify.prompt.md` con estos argumentos: Eres un desarrollador de juegos experto, y vas a diseñar y construir un juego usando Phaser compatible con los navegadores Chrome, Edge, Firefox y Safari. El juego es 2D, con estilo Pixel Art y mecánicas de juego basadas en juegos tipo Contra. La historia del videojuego se detalla en el documento `iron_remnant_design_doc_v0.1.md`.
8. Clarify specification requirements.
9. Hay un contador de tiempo y, en cuanto llegue a 00:00, es porque la integridad de la nave se ha comprometido y no se puede continuar. Hay 3 niveles de dificultad; en cada uno de ellos el tiempo para alcanzar el objetivo es cada vez menor: Fácil, mucho tiempo; Intermedio, tiempo más amplio; Difícil, tiempo justo para llegar al objetivo.
10. A.
11. C.
12. B.
13. B.
14. Sigue las instrucciones en `.github/prompts/speckit.specify.prompt.md` con estos argumentos: Agreguemos elementos a la especificación:
   Las municiones son infinitas.
   Nora tiene 5 vidas.
   Serán tres niveles: Oleada urbana, zona boscosa y nave espacial.
   El nivel final tiene un boss que son las defensas de la nave contra Nora.
   El contador de tiempo es por cada nivel y reinicia en el nivel siguiente.
   Si Nora muere en el segundo o tercer nivel, empieza desde ese nivel, no desde el siguiente.
   El progreso debe guardarse en una cookie persistente por si acaso el usuario cierra el navegador, pueda recuperar la partida.
   Al inicial el juego, se muestra un conjunto de imágenes mientras se explica el contexto del juego, el usuario puede pulsar un botón para saltarlo e iniciar justo donde quedó la última vez.
   Si el usuario pulsa F1 verá los controles del juego: Arriba para saltar, abajo para cuerpo a tierra, derecha para ir adelante, izquierda para ir hacia atrás, A para disparar, S para cambiar de arma, P para pausar, entre otros.
15. Sigue las instrucciones en `.github/prompts/speckit.clarify.prompt.md` con estos argumentos: Clarifiquemos los detalles.
16. B
17. A
18. B
19. A
20. A: Nora reaparece y durante 5 segundas es invulnerable y el srpites no es del todo solido, parpadea.
21. Antes de continuar: la dificultad se elige únicamente al iniciar el juego.
22. Ejecuta `speckit.git.feature` para la ejecución actual de `/speckit.specify`. Intención de la funcionalidad: todos los niveles deben tener elementos que evoquen a España. Devuelve `BRANCH_NAME` y `FEATURE_NUM`, si están disponibles, junto con cualquier bloqueo.
23. Sigue las instrucciones en `.github/prompts/speckit.specify.prompt.md` con estos argumentos: todos los niveles deben tener elementos que evoquen a España.
24. Agrega una regla en `Constitution.md`: se debe trabajar con TBD (Trunk-Based Development) y luego integrar todas las ramas en `main`. Todo el desarrollo se hará sobre `main`.
25. Integra todas las ramas en `main` y no crees ramas; todo el desarrollo debe hacerse sobre `main`.
26. Agrega todos los archivos del proyecto, con excepción de la carpeta `chromescar-PJM` y sus archivos, al `.gitignore`.
27. Sigue las instrucciones en `.github/prompts/speckit.clarify.prompt.md` con estos argumentos: Revisemos nuevamente las specs.
28. A
29. A
30. C
31. B
32. A: Para el primer nivel, los edificios del fondo deben ser reconocibles facilmente, por ejemplo, la Puerta de Alcala. Senalizaciones de transito con vias de Madrid, nombres de calle de Madrid y el anuncio del Tio Pepe a punto de caerse. Pueden incluir un Palacio Real derruido, un Retiro, entre otros. Para el segundo nivel, se pueden agregar elementos del paisaje propios de Espana, por ejemplo, el anuncio del Toro de Osborne reventado y remendado, entre otros. En la nave, no tiene sentido hacer alusion a Espana.
33. Sigue las instrucciones en `.github/prompts/speckit.tasks.prompt.md`.
34. G1: El elemento narrativo de integridad de la nave va en relación a que cada misión debe conseguir acabarse en un tiempo determinado. Una vez que el contador llegue a 0 la nave ya no podrá recuperarse y se dará por fallida toda la misión, teniendo que reiniciar desde el principio del nivel actual. Por ejemplo: si estás en el nivel 2 y se acaba el tiempo, se reinicia desde el comienzo del nivel 2. Cuando el tiempo se acaba, se muestra una cinemática con la nave explotando y el Game Over tras eso.
35. G2: Se acepta la recomendación. G3: Se acepta la recomendación. U1: Se acepta la recomendación. I1: Se acepta la recomendación.
36. Agrega al constitution.md que todos los ficheros de la implementación (juego) deben estar bajo la carpeta chromescar-PJM y que el juego debe iniciar desde index.html.
37. Pasa todos los cambios pendientes a la rama solved-videogame sobre la que estaremos trabajando a partir de ahora.
38. Ejecuta `speckit.git.feature` para la ejecución actual de `/speckit.specify`. Intención de la funcionalidad: el juego debe cumplir con la GDPR y el EU AI Act. Devuelve `BRANCH_NAME` y `FEATURE_NUM`, si están disponibles, junto con cualquier bloqueo.
39. Sigue las instrucciones en `.github/prompts/speckit.specify.prompt.md` con estos argumentos: el juego debe cumplir con la GDPR y el EU AI Act.
40. Sigue las instrucciones en `.github/prompts/speckit.plan.prompt.md`.
41. Sigue las instrucciones en `.github/prompts/speckit.tasks.prompt.md`.
42. Sigue las instrucciones en `.github/prompts/speckit.analyze.prompt.md`.
43. Para C1, A1, U1, I1 y U2: ejecutar las recomendaciones.
44. Sigue las instrucciones en `.github/prompts/speckit.implement.prompt.md` con estos argumentos: Implementa spec 001. Recuerda que toda la implementación debe ir dentro de la carpeta `chromescar-PJM`.
45. Si, ejecuta una pasada de cierre.
46. Sigue las instrucciones en `.github/prompts/speckit.implement.prompt.md` con estos argumentos: Implementa la spec 002.
47. Si, cierra las Task T011-T015.
48. Sigue las instrucciones en `.github/prompts/speckit.implement.prompt.md` con estos argumentos: Ahora implementa la spec 003.