# Inventario de datos

Estado: versión de la app web empaquetada (sin servidor propio). Actualizar con cada cambio que toque datos.

## Datos que maneja la app

| Dato | Quién lo introduce | Dónde se guarda | Sale del dispositivo | Observaciones |
|---|---|---|---|---|
| Nombre del paciente, nº de historia clínica, raza, edad, peso, especie | Veterinario | `localStorage` (`xavi-vet`) | No | Puede identificar indirectamente al propietario |
| Nombre del veterinario responsable | Veterinario | `localStorage` (`xavi-vet`) | No | Dato personal del propio usuario |
| Hoja de tratamiento, pautas de alta, notas | Veterinario | `localStorage` (`xavi-vet`) | Solo si el usuario copia/comparte el texto | El texto copiado puede contener los datos anteriores |
| Copia de seguridad (archivo `.json`) | Veterinario, al pulsar «Exportar copia» | Donde el usuario lo guarde o comparta | Sí, por decisión del usuario | Contiene los mismos datos que `xavi-vet`. Al importar se valida y se sanea |
| Aceptación del aviso clínico (`cv-ack`) | Veterinario | `localStorage` | No | Solo recuerda que se aceptó |
| Idioma y tema (claro/oscuro) | Usuario | `localStorage` (`cv-lang`, `cv-theme`) | No | Preferencias |

La app no tiene cuentas, ni registro, ni servidor propio, ni analítica, ni publicidad.

## Terceros que reciben datos

| Tercero | Qué recibe | Motivo | Estado |
|---|---|---|---|
| _Ninguno_ | — | — | Nunito (licencia SIL OFL) está alojada en `assets/fonts/`; `index.html` ya no hace peticiones externas (verificado con Playwright) |
| Apple / Google (tiendas) | Datos de descarga y facturación | Distribución | Fuera de la app; regido por sus políticas |

## Módulo de diagnóstico diferencial

Usa `window.claude`, que solo existe en el entorno del prototipo. **Decidido: oculto en la v1** (`FEATURES.ddx=false` en `index.html`, también bloquea el acceso por `#ddx`). Para reactivarlo:

1. (hecho) Ocultarlo en la versión de tienda.
2. Implementarlo con una API de IA a través de un backend propio. Eso cambia todo: política de privacidad, Data safety, contrato de encargado de tratamiento, transferencias internacionales, aviso de IA. Hay que rehacer este inventario antes.

## Cuentas y login

La pantalla `#login` es **solo una vista previa**: no envía ni guarda lo que se escribe, y no aparece en los menús. Si se activan cuentas reales hay que, antes de publicar:

- Elegir proveedor (p. ej. Firebase, Supabase) y firmar contrato de encargado de tratamiento (art. 28 RGPD); revisar transferencias fuera de la UE.
- Reescribir política de privacidad, Data safety (Google) y etiqueta de privacidad (Apple): correo, nombre, nº de colegiado e historial pasan a ser datos recogidos.
- Apple exige poder borrar la cuenta desde la propia app, y ofrecer «Iniciar sesión con Apple» si se añaden accesos con Google u otras redes.
- Si se sincronizan hojas y pautas con datos de pacientes, el rol cambia: la app pasa a tratar datos de clientes de la clínica. **[REVISAR CON ABOGADO]**
- Contraseñas: nunca propias; usar el proveedor de identidad.

## Permisos de plataforma previstos

Ninguno (sin cámara, ubicación, micrófono, contactos, notificaciones ni almacenamiento externo). Cualquier plugin de Capacitor que pida permisos debe pasar por el agente legal.

## Pendientes de decisión

- [x] Titular: autónomo / persona física. Faltan nombre, NIF, dirección y correo de contacto.
- [x] Autoalojar la fuente y eliminar conexiones externas.
- [x] Diagnóstico diferencial fuera de la v1.
- [ ] Decidir si se añade copia de seguridad o sincronización (cambiaría el rol de datos).
