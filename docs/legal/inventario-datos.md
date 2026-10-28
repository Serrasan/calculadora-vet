# Inventario de datos

Estado: versión de la app web empaquetada (sin servidor propio). Actualizar con cada cambio que toque datos.

## Datos que maneja la app

| Dato | Quién lo introduce | Dónde se guarda | Sale del dispositivo | Observaciones |
|---|---|---|---|---|
| Nombre del paciente, nº de historia clínica, raza, edad, peso, especie | Veterinario | `localStorage` (`xavi-vet`) | No | Puede identificar indirectamente al propietario |
| Nombre del veterinario responsable | Veterinario | `localStorage` (`xavi-vet`) | No | Dato personal del propio usuario |
| Hoja de tratamiento, pautas de alta, notas | Veterinario | `localStorage` (`xavi-vet`) | Solo si el usuario copia/comparte el texto | El texto copiado puede contener los datos anteriores |
| Idioma y tema (claro/oscuro) | Usuario | `localStorage` (`cv-lang`, `cv-theme`) | No | Preferencias |

La app no tiene cuentas, ni registro, ni servidor propio, ni analítica, ni publicidad.

## Terceros que reciben datos

| Tercero | Qué recibe | Motivo | Estado |
|---|---|---|---|
| Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`) | IP y cabeceras del dispositivo | Cargar la tipografía Nunito | **BLOQUEANTE**: autoalojar la fuente en `assets/` y quitar los `<link>` de `index.html` |
| Apple / Google (tiendas) | Datos de descarga y facturación | Distribución | Fuera de la app; regido por sus políticas |

## Módulo de diagnóstico diferencial

Usa `window.claude`, que solo existe en el entorno del prototipo. **En la app de tienda este módulo no funciona.** Hay dos opciones:

1. Ocultarlo en la versión de tienda (recomendado para la v1).
2. Implementarlo con una API de IA a través de un backend propio. Eso cambia todo: política de privacidad, Data safety, contrato de encargado de tratamiento, transferencias internacionales, aviso de IA. Hay que rehacer este inventario antes.

## Permisos de plataforma previstos

Ninguno (sin cámara, ubicación, micrófono, contactos, notificaciones ni almacenamiento externo). Cualquier plugin de Capacitor que pida permisos debe pasar por el agente legal.

## Pendientes de decisión

- [ ] Titular (persona física o sociedad) y datos de contacto.
- [ ] Autoalojar la fuente y eliminar conexiones externas.
- [ ] Decidir si el diagnóstico diferencial entra en la v1.
- [ ] Decidir si se añade copia de seguridad o sincronización (cambiaría el rol de datos).
