# Documentación legal

Mantenida por el agente `legal-compliance` (`.claude/agents/legal-compliance.md`). Son **borradores de trabajo, no asesoramiento jurídico**: antes de publicar, que los revise un abogado.

| Documento | Estado |
|---|---|
| [inventario-datos.md](inventario-datos.md) | Borrador, coincide con la app a fecha de creación |
| [politica-privacidad.md](politica-privacidad.md) | Borrador con marcadores `[...]` por rellenar |
| [terminos-de-uso.md](terminos-de-uso.md) | Borrador |
| [checklist-tiendas.md](checklist-tiendas.md) | En curso |

## Cómo usar el agente

Pídele revisar antes de cada versión o cambio relevante, por ejemplo:

- "Pasa el agente legal por los cambios de esta rama."
- "Actualiza la política de privacidad: he añadido analítica."
- "Prepara las respuestas de Data safety y de la etiqueta de privacidad de Apple."

## Equipo de agentes

Definidos en `.claude/agents/`. Cada uno trabaja en su especialidad:

| Agente | Especialidad |
|---|---|
| `legal-compliance` | Privacidad, políticas de tienda, aviso clínico, propiedad intelectual |
| `clinical-content` | Dosis, fórmulas y seguridad clínica (la validación final es de un veterinario) |
| `mobile-build` | Capacitor, Android/iOS, firma, versiones, CI |
| `ux-design` | Interfaz móvil, accesibilidad, modo oscuro |
| `qa-testing` | Pruebas en navegador, cálculos, regresiones |
| `idiomas` | Catalán, castellano e inglés |
| `store-listing` | Fichas, capturas y formularios de App Store y Google Play |
