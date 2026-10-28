# Avisos por Telegram

Cada vez que GitHub compila la app de Android, el bot manda el APK de prueba a las personas que indiques. Quien lo recibe solo tiene que abrirlo en el móvil Android e instalarlo.

Si no están configuradas las dos claves de abajo, el paso se salta y no pasa nada.

## Preparación (una vez)

1. **Crear el bot.** En Telegram abre `@BotFather`, escribe `/newbot` y sigue los pasos. Te da un **token** (una clave larga). Es privada: no la pegues en chats ni en el repositorio.
2. **Cada persona abre el bot** y pulsa *Iniciar* (o escribe `/start`). Sin eso, Telegram no deja que el bot le escriba.
3. **Sacar el identificador de cada persona.** Después de que escriba al bot, abre en el navegador `https://api.telegram.org/bot<TU_TOKEN>/getUpdates` (cambiando `<TU_TOKEN>`) y busca `"chat":{"id":123456789`. Ese número es su identificador.
4. **Guardar las claves en GitHub.** En el repositorio: *Settings → Secrets and variables → Actions → New repository secret*:
   - `TELEGRAM_BOT_TOKEN`: el token del paso 1.
   - `TELEGRAM_CHAT_IDS`: los identificadores separados por comas, por ejemplo `123456789,987654321`.

## Cosas a tener en cuenta

- El APK que se envía es de **depuración**: sirve para probar, no para publicar. Mándalo solo a gente de confianza.
- El identificador de Telegram de una persona es un dato personal suyo. Debe haber aceptado recibir los avisos (abrir el bot y pulsar *Iniciar* ya lo es), y no se sube al repositorio: solo vive en los secretos de GitHub.
- Para dejar de avisar a alguien, quita su identificador de `TELEGRAM_CHAT_IDS`.
- Si regeneras el token en `@BotFather` (`/revoke`), actualiza el secreto.
