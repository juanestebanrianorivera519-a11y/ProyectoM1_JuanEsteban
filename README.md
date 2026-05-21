# 🎨 Palette Studio — Generador de Paletas de Colores

Aplicación web estática e interactiva para generar paletas de colores aleatorias. Permite elegir entre 6, 8 o 9 colores, visualizar cada uno con su código HEX y HSL, y copiar los valores al portapapeles con un clic.

---

## Índice

- [Demo](#demo)
- [Instrucciones de uso](#instrucciones-de-uso)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Decisiones técnicas](#decisiones-técnicas)
- [Ejecutar localmente](#ejecutar-localmente)
- [Desplegar la aplicación](#desplegar-la-aplicación)

---

## Demo

🔗 [Ver aplicación en vivo](https://juanestebanrianorivera519-a11y.github.io/ProyectoM1_JuanEsteban)

---

## Instrucciones de uso

1. **Elegir la cantidad de colores** — Usá el selector desplegable para escoger entre `6`, `8` o `9` colores.
2. **Generar la paleta** — Presioná el botón **Generar Paleta**. Las tarjetas aparecen animadas con los colores nuevos.
3. **Copiar un color** — Hacé clic en el botón **Copiar HEX** dentro de cualquier tarjeta. Un toast en la parte inferior confirma que el código fue copiado al portapapeles.
4. **Volver a generar** — Podés presionar el botón tantas veces como quieras; cada vez se genera una paleta completamente nueva.

### Atajos de teclado

| Acción | Tecla |
|---|---|
| Navegar entre controles | `Tab` |
| Activar botón / select enfocado | `Enter` o `Space` |

---

## Estructura del proyecto

```
ProyectoM1_JuanEsteban/
├── index.html     # Estructura semántica de la app
├── styles.css     # Estilos y diseño visual
├── app.js         # Lógica de generación y comportamiento
└── README.md      # Este archivo
```

No hay dependencias externas, bundlers, ni frameworks. Todo corre directamente en el navegador.

---

## Decisiones técnicas

### HTML semántico
Se usaron etiquetas con significado propio en lugar de `<div>` genéricos:

- `<header>` para el título y descripción de la app.
- `<main>` como contenedor del contenido principal.
- `<section>` para agrupar los controles, con `aria-label` descriptivo.
- `<article>` para cada tarjeta de color, ya que cada una es un contenido independiente y reutilizable.
- `role="list"` en el contenedor de paleta y `role="listitem"` en cada tarjeta, porque el grid de colores es semánticamente una lista.
- `role="status"` + `aria-live="polite"` en el toast para que los lectores de pantalla anuncien el feedback sin interrumpir al usuario.

### Generación de colores en dos pasos (HSL → HEX)

Los colores se generan primero en **HSL** porque ese espacio es intuitivo para controlar la variedad visual:
- `H` (hue): ángulo aleatorio entre 0 y 360 — cubre todo el espectro.
- `S` (saturation): entre 40% y 90% — evita colores lavados o saturados al extremo.
- `L` (lightness): entre 30% y 70% — evita negros y blancos puros que no serían útiles en una paleta.

Luego se convierte a **HEX** con la fórmula matemática estándar, para ofrecer el formato más usado en diseño y desarrollo.

### Contraste de texto adaptativo

En lugar de un color de texto fijo, se evalúa la luminosidad `L` del color de fondo:

```
L > 55  →  texto oscuro (#1a1a1a)
L ≤ 55  →  texto claro  (#f5f5f5)
```

Esto garantiza contraste suficiente en toda la gama de colores posibles, cumpliendo con las pautas WCAG AA de accesibilidad.

### Manipulación del DOM con DocumentFragment

Al generar la paleta, las tarjetas no se insertan una por una en el DOM (lo que dispararía un repintado por cada inserción). En su lugar, se construyen dentro de un `DocumentFragment` — un contenedor en memoria — y se insertan todas juntas en una sola operación. Esto mejora el rendimiento, especialmente con 8 o 9 tarjetas.

### Toast sin `display: none`

El microfeedback se maneja con `opacity` y `transform` en lugar de `display: none / block`, por dos razones:

1. **CSS no puede animar `display`** — si usáramos `display: none`, la aparición sería instantánea y sin transición.
2. **`pointer-events: none`** hace que el toast invisible no intercepte clics del usuario, logrando el mismo efecto de "no existe" sin bloquear las animaciones.

### Accesibilidad

- `<label for="select-cantidad">` asociado explícitamente al `<select>` — los lectores de pantalla anuncian la etiqueta al enfocar el control.
- `:focus-visible` en lugar de `:focus` para los outlines — el foco visible aparece solo al navegar con teclado, sin molestar a usuarios de mouse.
- `aria-label="Copiar color #XXXXXX"` en cada botón — describe la acción específica, no solo "Copiar".
- `aria-live="polite"` en el toast — el lector de pantalla anuncia el mensaje de confirmación cuando el usuario termina su acción actual.

---

## Ejecutar localmente

La app es un sitio estático puro — no requiere Node.js, ni instalar dependencias, ni un servidor especial para la mayoría de los casos.

### Opción A — Abrir directamente en el navegador

```bash
# En Windows: doble clic sobre index.html
# En macOS:
open index.html
# En Linux:
xdg-open index.html
```

> **Limitación:** La API `navigator.clipboard` requiere un contexto seguro (`https://` o `localhost`). Si la copiada falla al abrir con `file://`, usá la Opción B.

### Opción B — Servidor local con Live Server (recomendado)

Si tenés [Visual Studio Code](https://code.visualstudio.com/):

1. Instalá la extensión **Live Server** (ritwickdey.liveserver).
2. Abrí la carpeta del proyecto en VS Code.
3. Hacé clic derecho sobre `index.html` → **Open with Live Server**.
4. La app se abre en `http://127.0.0.1:5500` con recarga automática al guardar.

### Opción C — Servidor local con Python

```bash
# Python 3
python -m http.server 8080
# Luego abrí http://localhost:8080 en el navegador
```

---

## Desplegar la aplicación

### GitHub Pages

El proyecto está desplegado en GitHub Pages. Para replicar el despliegue:

1. Subí los archivos al repositorio:

```bash
git init
git add .
git commit -m "feat: initial commit"
git branch -M main
git remote add origin https://github.com/juanestebanrianorivera519-a11y/ProyectoM1_JuanEsteban.git
git push -u origin main
```

2. En GitHub, andá a **Settings → Pages**.
3. En *Fuente*, elegí **Implementar desde una rama** → `principal` → `/ (raíz)`.
4. Guardá. En unos minutos la app estará disponible en:

```
https://juanestebanrianorivera519-a11y.github.io/ProyectoM1_JuanEsteban
```

---

## Compatibilidad

| Navegador | Versión mínima |
|---|---|
| Chrome / Edge | 89+ |
| Firefox | 85+ |
| Safari | 13.1+ |

> La API `navigator.clipboard` requiere HTTPS en producción. GitHub Pages lo provee por defecto.

---

## Autor

**Juan Esteban Riaño Rivera**  
[github.com/juanestebanrianorivera519-a11y](https://github.com/juanestebanrianorivera519-a11y)

---

## Licencia

MIT — libre para usar, modificar y distribuir.