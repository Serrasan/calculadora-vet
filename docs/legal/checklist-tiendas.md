# Checklist de publicación

Estado: `[ ]` pendiente · `[x]` hecho · `[!]` bloqueante. **Antes de afirmar cualquier requisito, el agente legal debe verificarlo en la fuente oficial vigente** (las políticas cambian). Última verificación: _sin verificar_.

## Previo (ambas tiendas)

- [ ] [!] Decidir el titular (autónomo o sociedad) y datos de contacto.
- [ ] [!] Autoalojar la fuente Nunito y eliminar toda conexión externa del `index.html`.
- [ ] [!] Decidir qué pasa con el diagnóstico diferencial en la v1 (ocultar o backend de IA).
- [ ] [!] Publicar la política de privacidad en una URL pública estable (p. ej. GitHub Pages).
- [ ] Sección "Fuentes y aviso" dentro de la app con la procedencia de las dosis.
- [ ] Pantalla de aceptación de aviso clínico en el primer arranque.
- [ ] Revisar que el formulario no copia texto con copyright de terceros.
- [ ] Búsqueda de disponibilidad de la marca "Calculadora Vet" (OEPM, EUIPO, tiendas).
- [ ] Revisión final por un abogado de política y condiciones.

## Apple App Store

- [ ] Cuenta Apple Developer (individual u organización; la organización requiere D-U-N-S).
- [ ] [!] Evitar rechazo por Guideline 4.2 (web empaquetada): funcionamiento offline, icono y splash nativos, y valor más allá de un sitio web.
- [ ] Guideline 1.4.1 (apps médicas/dosificación): descargo visible, fuentes citadas, público profesional.
- [ ] Etiqueta de privacidad ("Data Not Collected" si se mantiene sin servidor).
- [ ] Privacy Manifest (`PrivacyInfo.xcprivacy`) si lo exigen los SDK/plugins.
- [ ] Clasificación por edad y declaración de cifrado/exportación.
- [ ] URL de política de privacidad y de soporte.
- [ ] Capturas, descripción y texto de revisión que indique que es para profesionales.

## Google Play

- [ ] Cuenta de desarrollador y verificación de identidad.
- [ ] Requisitos de pruebas cerradas para cuentas nuevas (verificar número de testers y días vigentes).
- [ ] Formulario Data safety coherente con `inventario-datos.md`.
- [ ] Declaración de apps de salud/medicina si aplica.
- [ ] Nivel de API objetivo vigente (verificar).
- [ ] Clasificación de contenido y público objetivo (no dirigido a menores).
- [ ] Enlace a política de privacidad en la ficha y dentro de la app.
- [ ] Firma de la app (guardar el keystore fuera del repo y con copia segura).

## Si se añade monetización

- [ ] Compras dentro de la app obligatorias en ambas tiendas para contenido digital.
- [ ] Información de comerciante (DSA), IVA/OSS, derecho de desistimiento, términos de suscripción.
- [ ] Actualizar política, términos y formularios de tienda.
