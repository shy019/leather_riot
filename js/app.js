const { createApp } = Vue;

createApp({
  data() {
    return {
      menuAbierto: false,
      showContactUsMessage: false,
      imagenActual: 0,
      imagenZoomUrl: '',
      imagenZoomVisible: false,
      imagenIndex: 0,
      imagenesCarrusel: ['img/mujer-carrusel.webp', 'img/hombre-carrusel.webp'],
      filtroGenero: 'todos',
      productos: [],
      modalAbierto: false,
      productoModal: {},
      selectedColor: null,
      selectedSize: null,
      formulario: { nombre: '', email: '', mensaje: '' },
      formularioInicial: { nombre: '', email: '', mensaje: '' }
    }
  },
  created() {
    const productosBase = [
      {
        id: 1,
        nombre: 'Corona',
        descripcion: 'Diseño urbano con contraste negro y rojo. Moderna, llamativa y perfecta para destacar estilo.',
        precio: 360000,
        imagen: 'img/hombre/corona-negro-2.webp',
        genero: 'hombre',
        colores: [{ name: 'Negro', code: '#000' }],
        tallas: ['M', 'L', 'XL'],
        stock: { Negro: { M: 2, L: 2, XL: 2 } },
        imagenes: { Negro: ['img/hombre/corona-negro-2.webp', 'img/hombre/corona-negro-1.webp', 'img/hombre/corona-negro-3.webp'] }
      },
      {
        id: 2,
        nombre: 'Pamela',
        descripcion: 'Chaqueta ovejera con interior borrego, ideal para clima frío. Cálida, elegante y moderna.',
        precio: 420000,
        imagen: 'img/mujer/pamela-mujer-3.webp',
        genero: 'mujer',
        colores: [{ name: 'Negro', code: '#000' }],
        tallas: ['10', '12'],
        stock: { Negro: { 10: 2, 12: 2 } },
        imagenes: { Negro: ['img/mujer/pamela-mujer-3.webp', 'img/mujer/pamela-mujer-2.webp', 'img/mujer/pamela-mujer-1.webp'] }
      },
      {
        id: 3,
        nombre: 'Moroni',
        descripcion: 'Diseño clásico masculino en cuero negro. Versátil, sobria y perfecta para cualquier ocasión.',
        precio: 360000,
        imagen: 'img/hombre/moroni-negra-2.webp',
        genero: 'hombre',
        colores: [{ name: 'Negro', code: '#000' }],
        tallas: ['M', 'L', 'XL'],
        stock: { Negro: { M: 2, L: 2, XL: 2 } },
        imagenes: { Negro: ['img/hombre/moroni-negra-2.webp', 'img/hombre/moroni-negra-1.webp', 'img/hombre/moroni-negra-3.webp'] }
      },
      {
        id: 4,
        nombre: 'Doma',
        descripcion: 'Estilo sobrio en cuero negro. Corte recto, elegante y adaptable a cualquier look.',
        precio: 360000,
        imagen: 'img/hombre/5097-negra-3.webp',
        genero: 'hombre',
        colores: [{ name: 'Negro', code: '#000' }],
        tallas: ['M', 'L'],
        stock: { Negro: { M: 2, L: 2 } },
        imagenes: { Negro: ['img/hombre/5097-negra-3.webp', 'img/hombre/5097-negra-2.webp', 'img/hombre/5097-negra-1.webp'] }
      },
      {
        id: 5,
        nombre: 'Laure',
        descripcion: 'Entallada de cuero negro. Femenina, elegante y perfecta para uso diario.',
        precio: 350000,
        imagen: 'img/mujer/laura-negra-mujer-3.webp',
        genero: 'mujer',
        colores: [{ name: 'Negro', code: '#000' }],
        tallas: ['10', '12'],
        stock: { Negro: { 10: 2, 12: 2 } },
        imagenes: { Negro: ['img/mujer/laura-negra-mujer-3.webp', 'img/mujer/laura-negra-mujer-2.webp', 'img/mujer/laura-negra-mujer-1.webp'] }
      },
      {
        id: 6,
        nombre: 'Aviador',
        descripcion: 'Estilo aviador en cuero con cuello y forro de borrego. Con un toque clásico que impone estilo.',
        precio: 360000,
        imagen: 'img/hombre/aviador-1.webp',
        genero: 'hombre',
        colores: [{ name: 'Cafe', code: '#804000' }],
        tallas: ['M'],
        stock: { Cafe: { M: 0 } },
        agotado: true,
        imagenes: { Cafe: ['img/hombre/aviador-1.webp', 'img/hombre/aviador-2.webp', 'img/hombre/aviador-3.webp'] }
      }
    ];
    // Asignar productos e inyectar descuento aleatorio 15-30% múltiplos de 5
    this.productos = productosBase.map(p => {
      const descuento = p.genero === 'hombre' ? 20 : 25;
      const precioOriginal = Math.round(p.precio / (1 - descuento / 100));

      return {
        ...p,
        discount: descuento,
        precioOriginal
      };
    });
  },
  computed: {

    productosFiltrados() {
      return this.filtroGenero === 'todos' ? this.productos : this.productos.filter(p => p.genero === this.filtroGenero);
    }
  },
  methods: {
    ampliarImagen(url) {
      this.imagenZoomUrl = url;
      this.imagenZoomVisible = true;
      document.body.style.overflow = 'hidden';
    },
    cerrarImagen() {
      this.imagenZoomVisible = false;
      document.body.style.overflow = '';
    },
    scrollToCatalog() {
      document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
    },
    onScroll() {
      const scrollPos = window.scrollY + window.innerHeight;
      const footerTop = document.getElementById('contacto').getBoundingClientRect().top + window.scrollY;
      this.showContactUsMessage = scrollPos >= footerTop;
    },
    prevImage() { const imgs = this.productoModal.imagenes[this.selectedColor]; this.imagenIndex = (this.imagenIndex + imgs.length - 1) % imgs.length; },
    nextImage() { const imgs = this.productoModal.imagenes[this.selectedColor]; this.imagenIndex = (this.imagenIndex + 1) % imgs.length; },
    abrirModal(producto) {
      this.imagenIndex = 0;
      this.productoModal = producto;
      this.selectedColor = producto.colores[0].name;
      this.selectedSize = null;
      this.modalAbierto = true;

      this.$nextTick(() => {
        mediumZoom('.zoomable', {
          background: 'rgba(0,0,0,0.85)',
          scrollOffset: 40,
          margin: 24
        });
      });
    },
    cerrarModal() {
      this.modalAbierto = false;
      mediumZoom('.zoomable').detach();
    },
    selectColor(c) { this.selectedColor = c; this.selectedSize = null; },
    selectSize(s) { if (this.hasStock(this.selectedColor, s)) this.selectedSize = s; },
    hasStock(c, s) { return this.productoModal.stock[c]?.[s] > 0; },
    pagar() {
      if (!this.selectedColor || !this.selectedSize) {
        alert('Selecciona un color y una talla antes de comprar.');
        return;
      }
      const msg = `Hola, me interesa la chaqueta ${this.productoModal.nombre} en color ${this.selectedColor}, talla ${this.selectedSize}`;
      window.open(`https://wa.me/573057730226?text=${encodeURIComponent(msg)}`, '_blank');
      this.cerrarModal();
    },
    enviarMensaje() {
      const body = encodeURIComponent(`Nombre: ${this.formulario.nombre}\nEmail: ${this.formulario.email}\nMensaje: ${this.formulario.mensaje}`);
      window.open(`https://wa.me/573057730226?text=${body}`, '_blank');
      this.formulario = { ...this.formularioInicial };
    },
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll);
    this.carouselInterval = setInterval(() => {
      this.imagenActual = (this.imagenActual + 1) % this.imagenesCarrusel.length;
    }, 5000);

    // Ocultar loader si existe
    const loader = document.getElementById('loading');
    if (loader) {
      loader.classList.add('fade-out');
      setTimeout(() => loader.remove(), 300);
    }
  },
  beforeUnmount() {
    clearInterval(this.carouselInterval);
    window.removeEventListener('scroll', this.onScroll);
  }
}).mount('#app');