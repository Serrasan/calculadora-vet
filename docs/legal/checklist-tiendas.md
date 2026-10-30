# Checklist de publicación

Estado: `[ ]` pendiente · `[x]` hecho · `[!]` bloqueante. **Antes de afirmar cualquier requisito, el agente legal debe verificarlo en la fuente oficial vigente** (las políticas cambian). Última verificación: _sin verificar_.

## Previo (ambas tiendas)

- [ ] [!] Titular: autónomo (decidido). Faltan nombre, NIF, dirección fiscal y correo de contacto. Valorar que los datos públicos de la tienda no expongan el domicilio particular **[REVISAR CON ABOGADO]**.
- [x] Fuente IBM Plex Sans autoalojada y sin conexiones externas en la app.
- [x] Diagnóstico diferencial oculto en la v1.
- [ ] [!] Publicar la política de privacidad en una URL pública estable (p. ej. GitHub Pages).
- [ ] Sección "Información y datos" en la app: hecha; falta la lista de fuentes por fármaco (veterinario).
- [x] Pantalla de aviso clínico en el primer arranque (texto provisional **[REVISAR CON ABOGADO]**).
- [ ] Revisar que el formulario no copia texto con copyright de terceros.
- [x] Licencia de la tipografía (IBM Plex Sans, SIL OFL) incluida en `assets/fonts/NOTICE.txt`; añadirla también a la pantalla de licencias de la app.
- [ ] Búsqueda de disponibilidad de la marca "Calculadora Vet" (OEPM, EUIPO, tiendas).
- [ ] Revisión final por un abogado de política y condiciones.

> Orden de plataformas: Android primero, iOS después. Monetización: por decidir (la v1 se prepara como gratuita).

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

## Si se activan cuentas (login real)

- [ ] Elegir proveedor de identidad y firmar contrato de encargado de tratamiento.
- [ ] Borrar la cuenta desde la app (obligatorio en Apple y en Google Play).
- [ ] «Iniciar sesión con Apple» si hay otros accesos sociales.
- [ ] Rehacer política de privacidad, Data safety y etiqueta de privacidad de Apple.
- [ ] Revisión por abogado del cambio de rol sobre los datos.

## Si se añade monetización

- [ ] Compras dentro de la app obligatorias en ambas tiendas para contenido digital.
- [ ] Información de comerciante (DSA), IVA/OSS, derecho de desistimiento, términos de suscripción.
- [ ] Actualizar política, términos y formularios de tienda.
