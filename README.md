# Calculadora Vet

Calculadora clínica veterinaria para perro y gato. Es una página web sin dependencias ni instalación: el resultado final es un único archivo (`index.html`) que se abre en cualquier navegador.

## Módulos

- **Diagnóstico diferencial (oculto en la versión de tienda, `FEATURES.ddx`):** a partir de la descripción del caso, las alteraciones analíticas y las pruebas de imagen, genera una lista de diferenciales por orden de probabilidad. Solo funciona dentro de Claude; en esta copia permite copiar el caso preparado para pegarlo en un chat con Claude.
- **Altas:** buscador de fármacos de uso en casa (comprimidos, cápsulas, jarabes, gotas e insulinas) que genera la pauta para el propietario: cantidad por toma, frecuencia, días y total de unidades.
- **Formulario:** 58 fármacos con dosis por kg, volumen o comprimidos según la presentación, y precauciones por especie.
- **Infusiones continuas:** bomba de jeringa, bolsa de fluidos o sin diluir.
- **Urgencias y RCP:** hoja de parada con volúmenes, desfibrilación y tubo endotraqueal.
- **Fluidoterapia:** mantenimiento, déficit, goteo, potasio (escala de Scott) y dextrosa.
- **Transfusión:** volumen según hematocrito, velocidad y controles.
- **Nutrición:** RER, MER, peso ideal y realimentación.
- **Toxicología:** chocolate, xilitol, ibuprofeno, paracetamol, uvas, raticidas y permetrina.
- **Referencias:** constantes, estadiaje IRIS, superficie corporal y conversiones.
- **Hoja de tratamiento:** recopila los tratamientos; se copia o se comparte como texto.
- **Información y datos:** aviso clínico, fuentes y copia de seguridad (exportar, importar y borrar datos).

## Idiomas

Botones CA, ES y EN en la cabecera: traducen toda la app, incluidas las pautas de alta y la hoja de tratamiento. La elección se recuerda en el navegador.

## Uso

Abre `index.html` en el navegador (se genera con `npm run build`; ver «Estructura del código»). Para tenerla online, activa GitHub Pages en *Settings → Pages* con la rama `main`.

## Diseño

Sistema de diseño propio, definido con variables CSS en `src/styles/00-tokens.css`: tipografía IBM Plex Sans (alojada en `assets/fonts/`, licencia SIL OFL), superficies planas, una franja oscura para el paciente y su peso, color con significado (verde azulado para acciones, rojo para urgencias, ámbar para precauciones) y modo claro y oscuro. Todos los pares de color cumplen contraste AA. En móvil, barra de pestañas inferior y hoja «Más»; en escritorio, navegación lateral.

## Estructura del código

```
src/
  index.html        plantilla con la estructura de la página
  order.json        orden en el que se ensamblan los archivos
  styles/           CSS por capas: tokens, base, cabecera, estructura, componentes, pantallas, móvil, impresión
  js/               datos, idioma, utilidades y un archivo por módulo (formulario, infusiones, urgencias…)
scripts/            build-web.mjs (ensambla y comprueba), resumen_pdf.py
tests/              pruebas de humo en un navegador real
index.html          GENERADO desde src/: no se edita a mano
```

Flujo de trabajo: edita en `src/`, ejecuta `npm run build` y `npm test`. `npm run check` y la integración continua fallan si `index.html` no corresponde a `src/`. El build también detiene el proceso si el JavaScript tiene un error de sintaxis.

## Pruebas

`npm run build && npm test` abre la app en un navegador real y comprueba pantallas, idiomas, modo móvil sin desbordes, la copia de seguridad y que no haya errores ni conexiones externas. También se ejecutan en GitHub Actions antes de compilar la app de Android.

## Apps de iOS y Android

Ver [docs/PUBLICAR.md](docs/PUBLICAR.md). La parte legal está en [docs/legal/](docs/legal/) y la mantiene el agente `legal-compliance` (`.claude/agents/`).

## Aviso

Herramienta de apoyo a la prescripción. Los rangos son orientativos; comprueba siempre la concentración del producto, la ficha técnica (CIMAVet) y el estado clínico del paciente antes de administrar.
