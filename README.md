# Calculadora Vet

Calculadora clínica veterinaria para perro y gato. Es una página web de un solo archivo (`index.html`), sin dependencias ni instalación: se abre en cualquier navegador.

## Módulos

- **Diagnóstico diferencial:** a partir de la descripción del caso, las alteraciones analíticas y las pruebas de imagen, genera una lista de diferenciales por orden de probabilidad. Con «Dictar caso completo» se rellena todo con un solo audio (sexo, edad, peso, caso, analítica e imagen); también se puede dictar cada cuadro por separado. Solo funciona dentro de Claude; en esta copia permite copiar el caso preparado para pegarlo en un chat con Claude.
- **Altas:** buscador de fármacos de uso en casa (comprimidos, cápsulas, jarabes, gotas e insulinas) que genera la pauta para el propietario: cantidad por toma, frecuencia, días y total de unidades.
- **Formulario:** 58 fármacos con dosis por kg, volumen o comprimidos según la presentación, y precauciones por especie.
- **Infusiones continuas:** bomba de jeringa, bolsa de fluidos o sin diluir.
- **Urgencias y RCP:** hoja de parada con volúmenes, desfibrilación y tubo endotraqueal.
- **Fluidoterapia:** mantenimiento, déficit, goteo, potasio (escala de Scott) y dextrosa.
- **Transfusión:** volumen según hematocrito, velocidad y controles.
- **Nutrición:** RER, MER, peso ideal y realimentación.
- **Toxicología:** chocolate, xilitol, ibuprofeno, paracetamol, uvas, raticidas y permetrina.
- **Referencias:** constantes, estadiaje IRIS, superficie corporal y conversiones.
- **Hoja de tratamiento:** recopila los tratamientos y se copia como texto.

## Uso

Abre `index.html` en el navegador. Para tenerla online, activa GitHub Pages en *Settings → Pages* con la rama `main`.

## Aviso

Herramienta de apoyo a la prescripción. Los rangos son orientativos; comprueba siempre la concentración del producto, la ficha técnica (CIMAVet) y el estado clínico del paciente antes de administrar.
