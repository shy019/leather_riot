/**
 * Preservation Property Tests
 * 
 * These tests verify that existing functionality is present and correct
 * in the source files BEFORE any bugfix is applied.
 * 
 * They must PASS on the current unfixed code — they capture the BASELINE
 * behavior we need to preserve during the bugfix process.
 * 
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const rootDir = path.resolve(__dirname, '..');
const htmlContent = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
const jsContent = fs.readFileSync(path.join(rootDir, 'js', 'app.js'), 'utf-8');

let passed = 0;
let failed = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed++;
    failures.push({ name, message: err.message });
    console.log(`  ✗ ${name}`);
    console.log(`    → ${err.message}`);
  }
}

console.log('\n🔒 Preservation Property Tests\n');
console.log('─'.repeat(60));

// ─── 3.1 Carousel images preserved ─────────────────────────────────────────
console.log('\n📌 Carousel (Req 3.1)');

test('imagenesCarrusel contains mujer-carrusel.webp', () => {
  assert.ok(
    jsContent.includes("'img/mujer-carrusel.webp'") || jsContent.includes('"img/mujer-carrusel.webp"'),
    'imagenesCarrusel should contain img/mujer-carrusel.webp'
  );
});

test('imagenesCarrusel contains hombre-carrusel.webp', () => {
  assert.ok(
    jsContent.includes("'img/hombre-carrusel.webp'") || jsContent.includes('"img/hombre-carrusel.webp"'),
    'imagenesCarrusel should contain img/hombre-carrusel.webp'
  );
});

test('imagenesCarrusel array has exactly two images', () => {
  const match = jsContent.match(/imagenesCarrusel:\s*\[([^\]]+)\]/);
  assert.ok(match, 'imagenesCarrusel array should exist');
  const items = match[1].split(',').map(s => s.trim()).filter(Boolean);
  assert.strictEqual(items.length, 2, `Expected 2 items, got ${items.length}`);
});

// ─── 3.1 Carousel setInterval logic preserved ──────────────────────────────
test('setInterval increments imagenActual modulo length every 5000ms', () => {
  assert.ok(
    jsContent.includes('setInterval'),
    'setInterval should exist for carousel auto-rotation'
  );
  assert.ok(
    jsContent.includes('5000'),
    'Interval should be set to 5000ms'
  );
  assert.ok(
    jsContent.includes('imagenActual') && jsContent.includes('imagenesCarrusel.length'),
    'Carousel logic should use imagenActual and imagenesCarrusel.length for modulo cycling'
  );
});

// ─── 3.2 Modal abrirModal logic preserved ───────────────────────────────────
console.log('\n📌 Product Modal (Req 3.2)');

test('abrirModal method exists', () => {
  assert.ok(
    jsContent.includes('abrirModal('),
    'abrirModal method should exist'
  );
});

test('abrirModal sets productoModal', () => {
  assert.ok(
    jsContent.includes('this.productoModal = producto') || jsContent.includes('this.productoModal=producto'),
    'abrirModal should set productoModal to the product argument'
  );
});

test('abrirModal sets selectedColor from first color', () => {
  assert.ok(
    jsContent.includes('producto.colores[0].name'),
    'abrirModal should set selectedColor to first color name'
  );
});

test('abrirModal resets imagenIndex to 0', () => {
  assert.ok(
    jsContent.includes('this.imagenIndex = 0'),
    'abrirModal should reset imagenIndex to 0'
  );
});

test('abrirModal opens modal', () => {
  assert.ok(
    jsContent.includes('this.modalAbierto = true'),
    'abrirModal should set modalAbierto to true'
  );
});

// ─── 3.3 WhatsApp purchase flow preserved ───────────────────────────────────
console.log('\n📌 WhatsApp Purchase Flow (Req 3.3)');

test('pagar() method exists', () => {
  assert.ok(
    jsContent.includes('pagar('),
    'pagar method should exist'
  );
});

test('pagar() builds WhatsApp URL to 573057730226', () => {
  assert.ok(
    jsContent.includes('wa.me/573057730226'),
    'pagar should open WhatsApp to number 573057730226'
  );
});

test('pagar() includes product name, color, and size in message', () => {
  assert.ok(
    jsContent.includes('productoModal.nombre'),
    'pagar message should include product name'
  );
  assert.ok(
    jsContent.includes('selectedColor'),
    'pagar message should include selected color'
  );
  assert.ok(
    jsContent.includes('selectedSize'),
    'pagar message should include selected size'
  );
});

// ─── 3.4 Filter by gender preserved ────────────────────────────────────────
console.log('\n📌 Product Filtering (Req 3.4)');

test('productosFiltrados computed property exists', () => {
  assert.ok(
    jsContent.includes('productosFiltrados'),
    'productosFiltrados computed should exist'
  );
});

test('productosFiltrados filters by filtroGenero', () => {
  assert.ok(
    jsContent.includes('filtroGenero'),
    'productosFiltrados should reference filtroGenero'
  );
  assert.ok(
    jsContent.includes("filtroGenero === 'todos'") || jsContent.includes('filtroGenero === "todos"'),
    'productosFiltrados should check for "todos" to show all products'
  );
  assert.ok(
    jsContent.includes('p.genero === this.filtroGenero') || jsContent.includes('p => p.genero === this.filtroGenero'),
    'productosFiltrados should filter products by genero matching filtroGenero'
  );
});

// ─── 3.5 Carousel prev/next cycle logic preserved ──────────────────────────
console.log('\n📌 Modal Image Navigation (Req 3.5)');

test('prevImage() exists and cycles backward', () => {
  assert.ok(
    jsContent.includes('prevImage()') || jsContent.includes('prevImage('),
    'prevImage method should exist'
  );
  // Check for modulo backward cycling logic
  assert.ok(
    jsContent.includes('imgs.length - 1') && jsContent.includes('% imgs.length'),
    'prevImage should use modulo cycling logic: (index + length - 1) % length'
  );
});

test('nextImage() exists and cycles forward', () => {
  assert.ok(
    jsContent.includes('nextImage()') || jsContent.includes('nextImage('),
    'nextImage method should exist'
  );
  assert.ok(
    jsContent.includes('imagenIndex + 1') && jsContent.includes('% imgs.length'),
    'nextImage should use modulo cycling: (index + 1) % length'
  );
});

test('prev/next operate on productoModal.imagenes[selectedColor]', () => {
  assert.ok(
    jsContent.includes('this.productoModal.imagenes[this.selectedColor]'),
    'Navigation should use productoModal.imagenes[selectedColor]'
  );
});

// ─── 3.6 Mobile menu toggle preserved ──────────────────────────────────────
console.log('\n📌 Mobile Menu (Req 3.6)');

test('menuAbierto data property exists', () => {
  assert.ok(
    jsContent.includes('menuAbierto'),
    'menuAbierto state variable should exist in app data'
  );
});

test('menuAbierto toggle exists in HTML template', () => {
  assert.ok(
    htmlContent.includes('menuAbierto = !menuAbierto'),
    'HTML should contain toggle: menuAbierto = !menuAbierto'
  );
});

test('Mobile menu panel conditional rendering exists', () => {
  assert.ok(
    htmlContent.includes('v-if="menuAbierto"'),
    'Mobile menu panel should be conditionally rendered with v-if="menuAbierto"'
  );
});

// ─── 3.7 WhatsApp floating button preserved ────────────────────────────────
console.log('\n📌 WhatsApp Floating Button (Req 3.7)');

test('WhatsApp floating button links to correct URL in HTML', () => {
  assert.ok(
    htmlContent.includes('href="https://wa.me/573057730226"'),
    'Floating WhatsApp button should link to https://wa.me/573057730226'
  );
});

test('WhatsApp floating button has fa-whatsapp icon', () => {
  // Find the whatsapp link context — look at the full anchor tag area
  const waIndex = htmlContent.indexOf('href="https://wa.me/573057730226"');
  assert.ok(waIndex !== -1, 'WhatsApp link should exist');
  const surroundingHtml = htmlContent.substring(waIndex, waIndex + 400);
  assert.ok(
    surroundingHtml.includes('fa-whatsapp'),
    'WhatsApp button should contain fa-whatsapp icon'
  );
});

// ─── 3.8 "Dudas?" message on scroll preserved ─────────────────────────────
console.log('\n📌 Contact Scroll Message (Req 3.8)');

test('showContactUsMessage state exists', () => {
  assert.ok(
    jsContent.includes('showContactUsMessage'),
    'showContactUsMessage data property should exist'
  );
});

test('onScroll method exists and sets showContactUsMessage', () => {
  assert.ok(
    jsContent.includes('onScroll()') || jsContent.includes('onScroll('),
    'onScroll method should exist'
  );
  assert.ok(
    jsContent.includes('this.showContactUsMessage'),
    'onScroll should set showContactUsMessage'
  );
});

test('onScroll uses contacto section position', () => {
  assert.ok(
    jsContent.includes("getElementById('contacto')") || jsContent.includes('getElementById("contacto")'),
    'onScroll should reference the contacto section'
  );
});

test('scroll listener is attached in mounted', () => {
  assert.ok(
    jsContent.includes("addEventListener('scroll'") || jsContent.includes('addEventListener("scroll"'),
    'Scroll event listener should be attached'
  );
});

// ─── 3.9 Products have precio, precioOriginal, discount ────────────────────
console.log('\n📌 Price Display (Req 3.9)');

test('Products have precio field', () => {
  assert.ok(
    jsContent.includes('precio:') || jsContent.includes('precio :'),
    'Products should have precio field'
  );
});

test('Products have precioOriginal calculated field', () => {
  assert.ok(
    jsContent.includes('precioOriginal'),
    'Products should have precioOriginal field'
  );
});

test('Products have discount field', () => {
  assert.ok(
    jsContent.includes('discount:') || jsContent.includes('discount :'),
    'Products should have discount field'
  );
});

test('HTML displays precio with toLocaleString', () => {
  assert.ok(
    htmlContent.includes('producto.precio.toLocaleString()'),
    'HTML should display formatted precio'
  );
});

test('HTML displays precioOriginal with line-through', () => {
  assert.ok(
    htmlContent.includes('producto.precioOriginal.toLocaleString()'),
    'HTML should display formatted precioOriginal'
  );
  assert.ok(
    htmlContent.includes('line-through'),
    'precioOriginal should have line-through styling'
  );
});

test('HTML displays discount percentage', () => {
  assert.ok(
    htmlContent.includes('producto.discount'),
    'HTML should display discount percentage'
  );
});

// ─── 3.10 Sticky header preserved ──────────────────────────────────────────
console.log('\n📌 Sticky Header (Req 3.10)');

test('Header has sticky top-0 z-50 classes', () => {
  assert.ok(
    htmlContent.includes('sticky top-0 z-50') || htmlContent.includes('sticky') && htmlContent.includes('top-0') && htmlContent.includes('z-50'),
    'Header should have sticky top-0 z-50 classes'
  );
});

test('Header element exists with correct tag', () => {
  assert.ok(
    htmlContent.includes('<header'),
    'A <header> element should exist'
  );
});

// ─── Summary ────────────────────────────────────────────────────────────────
console.log('\n' + '─'.repeat(60));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed, ${passed + failed} total\n`);

if (failures.length > 0) {
  console.log('❌ Failures:');
  failures.forEach(f => console.log(`  • ${f.name}: ${f.message}`));
  console.log('');
  process.exit(1);
}

console.log('✅ All preservation tests passed — baseline behavior confirmed.\n');
process.exit(0);
