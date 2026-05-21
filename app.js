// ── 1. REFERENCIAS AL DOM ──────────────────────────────────────────
const btnGenerar    = document.getElementById('btn-generar');
const selectCantidad = document.getElementById('select-cantidad');
const selectFormato = document.getElementById('select-formato');
const paletaContenedor = document.getElementById('paleta');
const toast         = document.getElementById('toast');

// ── 2. GENERACIÓN DE COLORES ───────────────────────────────────────

/**
 * Genera valores HSL aleatorios.
 */
function generarHSL() {
  const h = Math.floor(Math.random() * 361);       // 0 a 360
  const s = Math.floor(Math.random() * 51) + 40;   // 40 a 90
  const l = Math.floor(Math.random() * 41) + 30;   // 30 a 70
  return { h, s, l };
}

/**
 * Convierte HSL → HEX.
 */
function hslAHex({ h, s, l }) {
  s /= 100;
  l /= 100;

  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = x => Math.round(x * 255).toString(16).padStart(2, '0');

  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`.toUpperCase();
}

/**
 * Función que une las dos anteriores y devuelve un objeto color completo.
 * Así el resto del código solo llama a esta función y recibe todo listo.
 */
function crearColor() {
  const hsl = generarHSL();
  const hex = hslAHex(hsl);
  return {
    hex,                                              // "#A3F2C1"
    hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`      // "hsl(145, 60%, 55%)"
  };
}

// ── 3.— COLOR DE TEXTO ─────────────────────────────

/**
 * Recibe la luminosidad L del HSL (0–100) 
 * encima de ese fondo debe ser oscuro o claro.
 * Umbral 55: por encima el fondo es claro → usamos texto oscuro.
 */
function colorTexto(lightness) {
  return lightness > 55 ? '#1a1a1a' : '#f5f5f5';
}

// ── 4. CREAR TARJETA HTML ──────────────────────────────────────────

function crearTarjeta(color, formato) {

  const lMatch = color.hsl.match(/(\d+)%\)$/);

  const lightness = lMatch
    ? parseInt(lMatch[1])
    : 50;

  const textoColor = colorTexto(lightness);

  const tarjeta = document.createElement('article');

  tarjeta.className = 'tarjeta-color';

  tarjeta.style.backgroundColor =
    formato === 'hex'
      ? color.hex
      : color.hsl;

  tarjeta.style.color = textoColor;

  //  AQUÍ DECIDIMOS QUÉ MOSTRAR
  const valorMostrar =
    formato === 'hex'
      ? color.hex
      : color.hsl;

  tarjeta.innerHTML = `

  <div class="info-color">

    <!-- HEX SIEMPRE VISIBLE -->
    <p class="color-hex">
      ${color.hex}
    </p>

    <!-- HSL SOLO SI EL USUARIO LO ELIGE -->
    ${
      formato === 'hsl'
        ? `<p class="color-hsl">${color.hsl}</p>`
        : ''
    }

  </div>

  <button
    class="btn-copiar"
    style="color:${textoColor}; border-color:${textoColor};"
  >
    Copiar
  </button>

`;

  tarjeta.querySelector('.btn-copiar')
    .addEventListener('click', () => {

      copiarAlPortapapeles(valorMostrar);

    });

  return tarjeta;
}

// ── 5. MICROFEEDBACK ───────────────────────────────

let toastTimeout; 

/**
 * Copia el texto al portapapeles del usuario.
 * Use la API moderna navigator.clipboard (async).
 */
async function copiarAlPortapapeles(texto) {
  try {
    await navigator.clipboard.writeText(texto);
    mostrarToast(`¡Copiado! ${texto}`);
  } catch {
    mostrarToast('No se pudo copiar. Intentá manualmente.', true);
  }
}

/**
 * @param {string}  mensaje  - Texto a mostrar
 * @param {boolean} esError  - Si es true, aplica estilo de error
 */
function mostrarToast(mensaje, esError = false) {
  // Cancelar cualquier toast anterior que siga visible
  clearTimeout(toastTimeout);

  toast.textContent = mensaje;
  toast.className = esError ? 'toast toast--error visible' : 'toast visible';

  toastTimeout = setTimeout(() => {
    toast.className = 'toast'; // ocultar quitando la clase "visible"
  }, 2500);
}

// ── 6. RENDERIZAR LA PALETA ────────────────────────────────────────

/**
 * Use un DocumentFragment para hacer una sola operación sobre el DOM
 */
function generarPaleta() {

  const cantidad = parseInt(selectCantidad.value, 10);

  //  LEER EL FORMATO SELECCIONADO
  const formato = selectFormato.value;

  // limpiar paleta anterior
  paletaContenedor.innerHTML = '';

  const fragmento = document.createDocumentFragment();

  for (let i = 0; i < cantidad; i++) {

    const color = crearColor();

    //  PASAR EL FORMATO
    const tarjeta = crearTarjeta(color, formato);

    fragmento.appendChild(tarjeta);
  }

  paletaContenedor.appendChild(fragmento);

  mostrarToast(`Paleta de ${cantidad} colores generada`);
}

// ── 7. EVENTOS E INICIALIZACIÓN ────────────────────────────────────

/**
 * Registramos los listeners aquí, separados de la lógica.
 * Así queda claro qué dispara qué.
 */
function iniciarApp() {
  btnGenerar.addEventListener('click', generarPaleta);
  generarPaleta();
}
// Punto de entrada: esperamos a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', iniciarApp);