# Roadmap de creación y publicación

Mantenido por el agente `roadmap-creacion`. Estado: ✅ hecho · 🔄 en curso · ⏳ pendiente · 🚧 bloqueado.

## Hito 1 — Base técnica
- ✅ Web empaquetada con Capacitor (Android e iOS generados)
- ✅ Sin conexiones externas (fuente alojada)
- ✅ Diagnóstico diferencial oculto en la v1
- ✅ Compilación del APK en GitHub Actions

## Hito 2 — Probar en el móvil · titular
- ⏳ Instalar el APK en un móvil Android y anotar qué falla

## Hito 3 — Pulir la app · agentes
- ✅ Menú inferior en móvil, botón atrás, compartir y copia de seguridad
- ⏳ `ux-design`: revisión en móvil, claro y oscuro
- ✅ Pruebas automáticas de humo (`npm test`)
- ⏳ `qa-testing`: pruebas de cálculo y de los tres idiomas
- ⏳ `idiomas`: textos sin traducir
- ✅ Pantalla de acceso como vista previa (no funcional, `#login`)
- 🔄 Icono y pantalla de arranque: provisionales, 🚧 falta el logo definitivo
- 🔄 Aviso clínico del primer arranque: hecho, texto provisional pendiente de revisión legal

## Hito 4 — Contenido clínico
- ⏳ `clinical-content`: revisión de dosis y fuentes
- 🚧 Validación por un veterinario (titular)

## Hito 5 — Legal · titular + `legal-compliance`
- 🚧 Datos del titular: nombre, NIF, dirección, correo
- ⏳ Rellenar política de privacidad y condiciones
- ⏳ Publicar la política en una URL pública
- ⏳ Búsqueda de disponibilidad del nombre y marca
- ⏳ Revisión por un abogado

## Hito 6 — Cuenta y preparación de la tienda · titular
- ⏳ Decidir el identificador definitivo (appId) y cambiarlo antes de firmar
- ⏳ Cuenta de Google Play Console y verificación de identidad
- ⏳ Firma de la app y guardado seguro de la clave
- ⏳ `store-listing`: ficha, capturas y formularios (Data safety)

## Hito 7 — Pruebas cerradas en Google Play
- ⏳ Reunir testers y cumplir los requisitos vigentes de Google (verificar número y duración)

## Hito 8 — Publicación en Android
- ⏳ Envío a revisión y publicación

## Hito 9 — iOS (después)
- ⏳ Mac, cuenta de Apple Developer, ajustes para la guía 4.2, envío a revisión

## Riesgos de calendario
- Pruebas cerradas de Google: tardan semanas.
- Revisión de Apple: puede rechazar apps que parecen solo una web.
- Sin validación veterinaria de las dosis no se debe publicar.
