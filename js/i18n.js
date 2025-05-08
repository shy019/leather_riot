const translations = {
  es: {
    inicio: "Inicio",
    productos: "Catálogo",
    contacto: "Contacto",
    nosotros: "Nosotros",
    subtitulo: "Chaquetas de cuero hechas a mano en Bogotá",
    titulo_descripcion: "Descubre tu estilo en cuero",
    descripcion: "Diseños auténticos, materiales premium y confección artesanal. Vive el estilo rebelde con Leather Riot.",
    ver_mas: "Ver más",
    saltar_contenido: "Saltar al contenido",
    derechos: "Todos los derechos reservados.",
    titulo: "Nuestra Colección",
    talla: "Talla",
    color: "Color",
    todos: "Todos",
    filtrar: "Filtrar por género",
    comprar: "Comprar",
    hombre: "Hombre",
    mujer: "Mujer",
    contacto_titulo: "Contáctanos",
    contacto_enviar: "Enviar",
    footer_mensaje: "© 2025 Leather Riot. Todos los derechos reservados.",
    dudas: "¿Tienes dudas?",
    producto_1_nombre: "Chaqueta Black Panther",
    producto_1_descripcion: "Cuero genuino, estilo moderno",
    producto_2_nombre: "Chaqueta Elegancia Mujer",
    producto_2_descripcion: "Estilo y confort",
    producto_3_nombre: "Chaqueta Ultra Gama Mujer",
    producto_3_descripcion: "Estilo y firmeza"
  },
  en: {
    inicio: "Home",
    productos: "Catalog",
    contacto: "Contact",
    nosotros: "About Us",
    subtitulo: "Handmade leather jackets in Bogotá",
    titulo_descripcion: "Discover your leather style",
    descripcion: "Authentic designs, premium materials, and handcrafted tailoring. Live the rebellious style with Leather Riot.",
    ver_mas: "Learn more",
    saltar_contenido: "Skip to content",
    derechos: "All rights reserved.",
    titulo: "Our Collection",
    talla: "Size",
    color: "Color",
    todos: "All",
    hombre: "Men",
    mujer: "Women",
    filtrar: "Filter by",
    comprar: "Buy",
    contacto_titulo: "Contact Us",
    contacto_enviar: "Send",
    dudas: "Do you have questions?",
    footer_mensaje: "© 2025 Leather Riot. All rights reserved.",
    producto_1_nombre: "Black Panther Jacket",
    producto_1_descripcion: "Genuine leather, modern style",
    producto_2_nombre: "Women's Elegance Jacket",
    producto_2_descripcion: "Style and comfort",
    producto_3_nombre: "Women's Ultra Premium Jacket",
    producto_3_descripcion: "Style and strength"
  }
};

function showLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "flex";
}
function hideLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "none";
}

function setLanguage(lang) {
  showLoader();
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;

  // Traduce los textos
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    // Si el elemento tiene un atributo data-i18n, lo traduce
    el.textContent = translations[lang][key] || key;
  });

  // Cambia la imagen de la bandera
  const flagImg = document.getElementById("lang-flag-icon");
  if (flagImg && flagImg.tagName === "IMG") {
    flagImg.src = lang === "es"
      ? "img/flags/us.svg"
      : "img/flags/es.svg";
  }

  // Notifica a Vue
  document.dispatchEvent(new CustomEvent("language-changed", { detail: lang }));

  setTimeout(hideLoader, 300);
}

function switchLanguage() {
  const next = (localStorage.getItem("lang") === "es") ? "en" : "es";
  setLanguage(next);
}

document.addEventListener("DOMContentLoaded", () => {
  setLanguage(localStorage.getItem("lang") || "es");
});