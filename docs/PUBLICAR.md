# Del prototipo a las tiendas

La web (`index.html`) se empaqueta con [Capacitor](https://capacitorjs.com) en apps nativas para iOS y Android. El código sigue siendo uno solo.

## Primera vez

```bash
npm install
npm run build              # copia index.html a www/
npx cap add android        # genera android/ (requiere Android Studio para compilar)
npx cap add ios            # genera ios/ (requiere macOS con Xcode)
```

Antes, cambia `appId` en `capacitor.config.json` por tu identificador definitivo (p. ej. `es.tudominio.calculadoravet`). **No se puede cambiar después de publicar.**

## Día a día

```bash
npm run android            # build + sync + abre Android Studio
npm run ios                # build + sync + abre Xcode (solo macOS)
```

## Qué falta antes de enviar a revisión

1. Cerrar los bloqueantes de [legal/checklist-tiendas.md](legal/checklist-tiendas.md).
2. Icono y pantalla de arranque (`@capacitor/assets`).
3. Funcionamiento 100 % offline (quitar Google Fonts) y service worker opcional.
4. Cuentas de desarrollador: Apple (99 USD/año) y Google (25 USD, pago único). Verificar precios vigentes.
5. Firma y subida: Android App Bundle (.aab) desde Android Studio, iOS desde Xcode → App Store Connect.

## Notas

- Apple puede rechazar (Guideline 4.2) apps que son solo una web. Conviene aportar valor nativo: modo offline, compartir hoja de tratamiento con la hoja nativa, guardado seguro.
- Los datos viven en `localStorage` del WebView. Si el usuario desinstala, se pierden: valorar exportar/importar copia local antes de lanzar.
- No hay CI para compilar iOS desde Linux; se necesita un Mac o un servicio como Xcode Cloud / Codemagic.
