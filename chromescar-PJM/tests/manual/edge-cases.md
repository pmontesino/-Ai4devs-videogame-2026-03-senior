# Edge Cases

## Matriz de pruebas de borde

| ID | Caso | Pasos | Resultado esperado | Estado | Evidencia |
|----|------|-------|--------------------|--------|-----------|
| E01 | Cambio de foco en salto | Iniciar salto y cambiar de ventana durante 2-3 s | Al volver, no hay bloqueo de input ni posicion corrupta | [X] | QA-002-E01 |
| E02 | Cookies deshabilitadas | Deshabilitar cookies, jugar 1 nivel, cerrar y abrir | Juego sigue jugable; muestra advertencia de no persistencia | [X] | QA-002-E02 |
| E03 | Timer en transicion | Forzar 00:00 cerca de cambio de nivel | Se aplica regla de derrota por tiempo de forma consistente | [X] | QA-002-E03 |
| E04 | F1 durante pausa | Pausar con P y pulsar F1 | Overlay de ayuda no rompe estado de pausa | [X] | QA-002-E04 |
| E05 | F1 durante game over | Entrar a game over y pulsar F1 | No rompe flujo de reintentar/menu | [X] | QA-002-E05 |
| E06 | Fallback visual | Forzar fallo de elemento visual cultural | Aparece placeholder visual neutral y no se bloquea partida | [X] | QA-002-E06 |
| E07 | Fallback narrativo | Forzar fallo de elemento narrativo cultural | Aparece placeholder narrativo neutral y no se bloquea partida | [X] | QA-002-E07 |
| E08 | Fallback senalizacion | Forzar fallo de senalizacion cultural | Aparece placeholder de senalizacion neutral y no se bloquea partida | [X] | QA-002-E08 |

## Defectos observados

| ID defecto | Caso | Severidad | Descripcion | Estado |
|------------|------|-----------|-------------|--------|
| N/A | N/A | N/A | Sin defectos abiertos tras ejecucion de casos E01-E08 | Cerrado |
