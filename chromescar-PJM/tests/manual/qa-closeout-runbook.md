# Runbook de Cierre QA (Spec 001)

## Alcance

Este runbook permite cerrar T040, T041, T045 y T047 de forma trazable.

## Orden recomendado

1. Ejecutar T040 con `browser-checklist.md` en Edge, Firefox, Chrome y Safari.
2. Ejecutar T041 con `edge-cases.md` en el mismo entorno.
3. Ejecutar T045 con `playtest-protocol.md` y registrar en `playtest-raw-data.md`.
4. Ejecutar T047 con `campaign-outcomes.md` y adjuntar evidencias.

## Criterios de salida

- T040: matriz de navegadores completa, sin defectos criticos abiertos.
- T041: todos los casos E01-E05 en PASS o con incidencia documentada.
- T045: al menos 10 registros con datos suficientes.
- T047: outcomes O01-O04 ejecutados y evidenciados.

## Trazabilidad

- Registrar fecha y responsable por archivo.
- Registrar defectos con severidad y estado.
- Referenciar este runbook al cerrar tareas en `tasks.md`.
