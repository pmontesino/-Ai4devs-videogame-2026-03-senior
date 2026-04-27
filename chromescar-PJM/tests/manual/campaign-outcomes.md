# Matriz de Outcomes de Campana

| ID | Caso | Pasos | Resultado esperado | Resultado observado | Estado |
|----|------|-------|--------------------|---------------------|--------|
| O01 | Victoria final | Completar nivel 1, 2 y derrotar boss en nivel 3 | Exito y retorno a menu | Flujo completado; retorno a menu correcto | [X] |
| O02 | Derrota por vidas | Perder todas las vidas en nivel activo | Game over + reintentar nivel actual | Game over funcional y reintento en nivel actual | [X] |
| O03 | Derrota por tiempo | Dejar timer llegar a 00:00 en nivel activo | Cinematica explosion + game over + reintentar nivel actual | Regla de tiempo y reintento validada | [X] |
| O04 | Avance parcial | Completar nivel 1 y nivel 2 sin llegar a boss final | Paso nivel 1->2 y 2->3 | Transiciones 1->2 y 2->3 correctas | [X] |
| O05 | Excepcion narrativa nivel 3 | Entrar al nivel 3 y revisar ambientacion contextual | Coherencia de nave sin referencia espanola directa obligatoria | Coherencia de nave validada sin alusiones directas obligatorias | [X] |

## Evidencia recomendada

- Capturas de HUD con nivel y timer visibles.
- Captura de pantalla de Game Over por derrota de vidas.
- Captura de cinematica/texto de explosion por tiempo agotado.
- Captura de pantalla de exito final y retorno al menu.
