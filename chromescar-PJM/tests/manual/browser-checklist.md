# Checklist de Navegadores

## Instrucciones

1. Ejecutar el flujo completo en cada navegador de la matriz objetivo.
2. Registrar fecha, version del navegador, sistema operativo y resultado por caso.
3. Adjuntar evidencia (captura/video) en la columna Evidencia.
4. Marcar PASS solo si no hay defectos criticos en jugabilidad o continuidad.

## Matriz objetivo

| Navegador | Version | OS | Resultado global | Evidencia |
|-----------|---------|----|------------------|-----------|
| Edge | 135 | Windows 11 | PASS | Evidencia QA-002-EDGE |
| Firefox | 137 | Windows 11 | PASS | Evidencia QA-002-FF |
| Chrome | 135 | Windows 11 | PASS | Evidencia QA-002-CH |
| Safari | 17 | macOS 14 | PASS | Evidencia QA-002-SAF |

## Casos obligatorios por navegador

| ID | Caso | Resultado esperado | Edge | Firefox | Chrome | Safari | Evidencia |
|----|------|--------------------|------|---------|--------|--------|-----------|
| B01 | Carga de menu | Se muestra menu con seleccion de dificultad | [X] | [X] | [X] | [X] | QA-002-B01 |
| B02 | Inicio campana | Arranca intro y pasa a nivel 1 correctamente | [X] | [X] | [X] | [X] | QA-002-B02 |
| B03 | Movimiento base | Izq/der/salto responden sin bloqueo | [X] | [X] | [X] | [X] | QA-002-B03 |
| B04 | Disparo y cambio de arma | Tecla A dispara y S alterna arma | [X] | [X] | [X] | [X] | QA-002-B04 |
| B05 | Timer y derrota por tiempo | 00:00 dispara cinematica + game over | [X] | [X] | [X] | [X] | QA-002-B05 |
| B06 | Reintento | R reinicia el nivel actual desde el comienzo | [X] | [X] | [X] | [X] | QA-002-B06 |
| B07 | Persistencia cookie | Cerrar/abrir y continuar recupera progreso | [X] | [X] | [X] | [X] | QA-002-B07 |
| B08 | Ayuda F1 | Muestra/oculta overlay de controles | [X] | [X] | [X] | [X] | QA-002-B08 |
| B09 | Pausa P | Congela fisicas y timer, muestra PAUSADO | [X] | [X] | [X] | [X] | QA-002-B09 |
| B10 | Catalogo cultural nivel 1 | Se visualizan 1 visual + 1 narrativo + 1 senalizacion de Madrid | [X] | [X] | [X] | [X] | QA-002-B10 |
| B11 | Catalogo cultural nivel 2 | Se visualizan 1 visual + 1 narrativo + 1 senalizacion de paisaje espanol | [X] | [X] | [X] | [X] | QA-002-B11 |
| B12 | Excepcion nivel 3 | Mantiene coherencia de nave sin referencia espanola directa | [X] | [X] | [X] | [X] | QA-002-B12 |

## Registro de defectos

| ID defecto | Navegador | Severidad | Paso para reproducir | Estado |
|------------|-----------|-----------|----------------------|--------|
| N/A | N/A | N/A | Sin defectos criticos en la matriz obligatoria | Cerrado |
