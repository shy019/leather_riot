/**
 * Bug Condition Exploration Test
 * 
 * This test checks all 21 bug conditions identified in the site audit.
 * It asserts the EXPECTED (fixed) behavior. Since the code is currently UNFIXED,
 * the test should FAIL — which confirms the bugs exist.
 * 
 * Validates: Requirements 2.1–2.21
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');
const appJs = fs.readFileSync(path.join(ROOT, 'js/app.js'), 'utf-8');
const css = fs.readFileSync(path.join(ROOT, 'css/styles.min.css'), 'utf-8');

let passed = 0;
let failed = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (e) {
    failed++;
    failures.push({ name, message: e.message });
    console.log(`  ✗ ${name}`);
    console.log(`    → ${e.message}`);
  }
}

console.log('\n=== Bug Condition Exploration Tests ===\n');

// Bug 1.1 - Non-existent preload asset
test('1.1 index.html does NOT reference non-existent preload img/hombre-1.webp', () => {
  assert.ok(
    !html.includes('href="img/hombre-1.webp"'),
    'Found reference to non-existent asset img/hombre-1.webp in preload link'
  );
});

// Bug 1.2 - Non-existent OG image
test('1.2 index.html does NOT reference non-existent og:image img/og-image.jpg', () => {
  assert.ok(
    !html.includes('content="img/og-image.jpg"'),
    'Found reference to non-existent OG image img/og-image.jpg'
  );
});

// Bug 1.3 - Placeholder Google Analytics
test('1.3 index.html does NOT contain placeholder analytics G-XXXXXXX', () => {
  assert.ok(
    !html.includes('G-XXXXXXX'),
    'Found placeholder Google Analytics ID G-XXXXXXX'
  );
});

// Bug 1.4 - Invalid Google Font request (Helvetica Neue not on Google Fonts)
test('1.4 index.html does NOT request Helvetica+Neue from Google Fonts', () => {
  assert.ok(
    !html.includes('fonts.googleapis.com/css2?family=Helvetica'),
    'Found invalid Google Fonts request for Helvetica Neue'
  );
});

// Bug 1.5 - Orphan </section> tag after modal
test('1.5 index.html does NOT have orphan </section> after modal transition', () => {
  // The orphan </section> appears on the line immediately after </transition> (end of modal)
  // and before <section id="personalizacion">. It closes nothing — the catalog <section> was
  // already closed before the modal. Check that </transition> is NOT followed by </section>.
  const pattern = /<\/transition>\s*<\/section>\s*<section id="personalizacion"/;
  assert.ok(
    !pattern.test(html),
    'Found orphan </section> tag between </transition> (modal end) and <section id="personalizacion">'
  );
});

// Bug 1.6 - Modal image missing zoomable class
test('1.6 Modal product image has class "zoomable"', () => {
  // Look for the modal image that displays the product
  const modalImgPattern = /productoModal\.imagenes\[selectedColor\]\[imagenIndex\]/;
  const modalImgMatch = html.match(modalImgPattern);
  assert.ok(modalImgMatch, 'Could not find modal product image');
  
  // Get the img tag containing this src binding
  const imgTagStart = html.lastIndexOf('<img', html.indexOf('productoModal.imagenes[selectedColor][imagenIndex]'));
  const imgTagEnd = html.indexOf('/>', imgTagStart) + 2;
  const imgTag = html.substring(imgTagStart, imgTagEnd);
  
  assert.ok(
    imgTag.includes('zoomable'),
    'Modal product image does not have class "zoomable"'
  );
});

// Bug 1.7 - Memory leak: setInterval without stored reference
test('1.7 app.js stores setInterval reference for cleanup', () => {
  // Check that the interval is stored (e.g., this.carouselInterval = setInterval(...))
  const hasStoredInterval = /this\.\w+\s*=\s*setInterval/.test(appJs);
  assert.ok(
    hasStoredInterval,
    'setInterval is not stored in a variable for later cleanup'
  );
});

// Bug 1.7b - clearInterval in beforeUnmount
test('1.7b app.js clears interval in beforeUnmount', () => {
  const hasBeforeUnmount = appJs.includes('beforeUnmount');
  assert.ok(hasBeforeUnmount, 'No beforeUnmount lifecycle hook found');
  
  const beforeUnmountStart = appJs.indexOf('beforeUnmount');
  const beforeUnmountBlock = appJs.substring(beforeUnmountStart, beforeUnmountStart + 300);
  assert.ok(
    beforeUnmountBlock.includes('clearInterval'),
    'beforeUnmount does not call clearInterval'
  );
});

// Bug 1.8 - Contact form only shows alert
test('1.8 enviarMensaje() does more than just alert()', () => {
  const enviarStart = appJs.indexOf('enviarMensaje()');
  assert.ok(enviarStart !== -1, 'enviarMensaje method not found');
  
  // Get the method body (roughly next 200 chars)
  const enviarBlock = appJs.substring(enviarStart, enviarStart + 300);
  
  // It should NOT just show an alert - should have a real action like window.open, fetch, etc.
  const hasRealAction = enviarBlock.includes('window.open') || 
                        enviarBlock.includes('fetch') || 
                        enviarBlock.includes('wa.me') ||
                        enviarBlock.includes('mailto');
  assert.ok(
    hasRealAction,
    'enviarMensaje() only shows an alert without sending data anywhere'
  );
});

// Bug 1.9 - Tailwind dev CDN in production
test('1.9 index.html does NOT load Tailwind dev CDN', () => {
  assert.ok(
    !html.includes('cdn.tailwindcss.com'),
    'Found development Tailwind CDN (cdn.tailwindcss.com) - not suitable for production'
  );
});

// Bug 1.10 - Unpinned Vue version
test('1.10 index.html loads pinned Vue production build', () => {
  // Should have a pinned version like vue@3.4.38/dist/vue.global.prod.js
  const hasPinnedVue = /unpkg\.com\/vue@3\.\d+\.\d+\/dist\/vue\.global\.prod\.js/.test(html) ||
                       /cdn\.jsdelivr\.net\/npm\/vue@3\.\d+\.\d+\/dist\/vue\.global\.prod\.js/.test(html);
  assert.ok(
    hasPinnedVue,
    'Vue is not loaded as a pinned production build'
  );
});

// Bug 1.11 - Full Font Awesome loaded
test('1.11 Font Awesome is loaded as subset or individual icons (not full library)', () => {
  // The full library URL pattern
  const hasFullFontAwesome = html.includes('font-awesome/6.4.0/css/all.min.css') ||
                             html.includes('font-awesome/6.5.0/css/all.min.css') ||
                             /font-awesome\/[\d.]+\/css\/all\.min\.css/.test(html);
  assert.ok(
    !hasFullFontAwesome,
    'Full Font Awesome library loaded instead of a subset'
  );
});

// Bug 1.12 - Logo with loading="lazy" despite preload
test('1.12 Logo img does NOT have loading="lazy"', () => {
  // Find the logo img tag
  const logoPattern = /src="img\/logo_lateral_bg\.png"[^>]*/;
  const logoMatch = html.match(logoPattern);
  assert.ok(logoMatch, 'Logo image not found');
  
  assert.ok(
    !logoMatch[0].includes('loading="lazy"'),
    'Logo image has loading="lazy" despite having a preload hint'
  );
});

// Bug 1.13 - Product images without explicit dimensions
test('1.13 Product grid images have width and height attributes', () => {
  // Find the product grid image (v-for product)
  const productImgPattern = /:src="producto\.imagen"[^>]*/;
  const productImgMatch = html.match(productImgPattern);
  assert.ok(productImgMatch, 'Product grid image not found');
  
  // Get the full img tag
  const imgStart = html.lastIndexOf('<img', html.indexOf(':src="producto.imagen"'));
  const imgEnd = html.indexOf('/>', imgStart) + 2;
  const imgTag = html.substring(imgStart, imgEnd);
  
  assert.ok(
    imgTag.includes('width=') && imgTag.includes('height='),
    'Product grid images are missing width and height attributes'
  );
});

// Bug 1.14 - Viewport blocks zoom
test('1.14 Viewport meta does NOT contain maximum-scale or user-scalable=no', () => {
  const viewportMatch = html.match(/name="viewport"[^>]*content="([^"]*)"/);
  assert.ok(viewportMatch, 'Viewport meta tag not found');
  
  const viewportContent = viewportMatch[1];
  assert.ok(
    !viewportContent.includes('maximum-scale'),
    'Viewport meta contains maximum-scale restriction'
  );
  assert.ok(
    !viewportContent.includes('user-scalable=no'),
    'Viewport meta contains user-scalable=no restriction'
  );
});

// Bug 1.15 - Anti-zoom touch listeners
test('1.15 app.js does NOT contain anti-zoom touchstart/touchend listeners', () => {
  assert.ok(
    !appJs.includes('preventZoom'),
    'Found anti-zoom preventZoom touchstart listener'
  );
  
  // Check for double-tap prevention pattern
  const hasDoubleTapPrevention = /lastTouch.*=.*0/.test(appJs) && appJs.includes('touches.length > 1');
  assert.ok(
    !hasDoubleTapPrevention,
    'Found double-tap zoom prevention code'
  );
});

// Bug 1.16 - Social links without security attributes
test('1.16 External social links have rel="noopener noreferrer"', () => {
  // Find Facebook and Instagram links
  const fbLink = html.match(/<a[^>]*facebook[^>]*>/);
  const igLink = html.match(/<a[^>]*instagram[^>]*>/);
  
  if (fbLink) {
    assert.ok(
      fbLink[0].includes('rel="noopener noreferrer"'),
      'Facebook link missing rel="noopener noreferrer"'
    );
  }
  if (igLink) {
    assert.ok(
      igLink[0].includes('rel="noopener noreferrer"'),
      'Instagram link missing rel="noopener noreferrer"'
    );
  }
});

// Bug 1.17 - Dead social links (TikTok, YouTube pointing to #)
test('1.17 No dead social links pointing to href="#" (TikTok, YouTube)', () => {
  // Check for TikTok or YouTube links with href="#"
  const tiktokDeadLink = /<a[^>]*href="#"[^>]*>[\s\S]*?fa-tiktok[\s\S]*?<\/a>/.test(html) ||
                         /<a[^>]*href="#"[^>]*>[^<]*<i[^>]*fa-tiktok/.test(html);
  const youtubeDeadLink = /<a[^>]*href="#"[^>]*>[\s\S]*?fa-youtube[\s\S]*?<\/a>/.test(html) ||
                          /<a[^>]*href="#"[^>]*>[^<]*<i[^>]*fa-youtube/.test(html);
  
  assert.ok(
    !tiktokDeadLink,
    'Found dead TikTok link pointing to href="#"'
  );
  assert.ok(
    !youtubeDeadLink,
    'Found dead YouTube link pointing to href="#"'
  );
});

// Bug 1.18 - Modal carousel buttons without aria-label
test('1.18 Modal prev/next buttons have aria-label attributes', () => {
  // Find the prev and next buttons in the modal (they use @click="prevImage" and @click="nextImage")
  const prevButtonMatch = html.match(/<button[^>]*prevImage[^>]*>/);
  const nextButtonMatch = html.match(/<button[^>]*nextImage[^>]*>/);
  
  assert.ok(prevButtonMatch, 'Prev button not found');
  assert.ok(nextButtonMatch, 'Next button not found');
  
  assert.ok(
    prevButtonMatch[0].includes('aria-label'),
    'Prev button is missing aria-label attribute'
  );
  assert.ok(
    nextButtonMatch[0].includes('aria-label'),
    'Next button is missing aria-label attribute'
  );
});

// Bug 1.19 - No empty state for zero-result filters
test('1.19 Empty state message exists for zero-result filters', () => {
  // Check that there's a v-if for empty products
  const hasEmptyState = html.includes('productosFiltrados.length === 0') ||
                        html.includes('productosFiltrados.length == 0') ||
                        html.includes('!productosFiltrados.length');
  assert.ok(
    hasEmptyState,
    'No empty state message for when filter returns zero products'
  );
});

// Bug 1.20 - Dead code: getRandomDiscount still exists
test('1.20 getRandomDiscount method does NOT exist in app.js', () => {
  assert.ok(
    !appJs.includes('getRandomDiscount'),
    'Dead code: getRandomDiscount() method still exists in app.js'
  );
});

// Bug 1.21 - Duplicate CSS rules for .medium-zoom-image
test('1.21 No duplicate .medium-zoom-image rules in CSS', () => {
  // Count occurrences of .medium-zoom-image--opened
  const matches = css.match(/\.medium-zoom-image--opened/g);
  const count = matches ? matches.length : 0;
  
  assert.ok(
    count <= 1,
    `Found ${count} occurrences of .medium-zoom-image--opened rule (expected 1, has duplicates)`
  );
});

// Summary
console.log('\n=== Summary ===');
console.log(`  Passed: ${passed}`);
console.log(`  Failed: ${failed}`);
console.log(`  Total:  ${passed + failed}`);

if (failures.length > 0) {
  console.log('\n=== Failed Assertions (Counterexamples) ===');
  failures.forEach((f, i) => {
    console.log(`  ${i + 1}. ${f.name}`);
    console.log(`     ${f.message}`);
  });
}

// Exit with error code if any test failed
if (failed > 0) {
  console.log(`\n❌ ${failed} test(s) failed — bugs confirmed to exist in unfixed code.`);
  process.exit(1);
} else {
  console.log('\n✅ All tests passed — all bugs are fixed!');
  process.exit(0);
}
