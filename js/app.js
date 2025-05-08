const { createApp } = Vue;

createApp({
  data() {
    return {
      menuAbierto: false,
      showContactUsMessage: false,
      imagenActual: 0,
      imagenIndex: 0,
      imagenesCarrusel: ['img/hombre-2.webp','img/mujer-2.jpg'],
      filtroGenero: 'todos',
      productos: [
        {
          id:1,
          nombre:'Chaqueta Black Panther',
          descripcion:'Cuero genuino, estilo moderno',
          precio:440000,
          imagen:'img/hombre-1.webp',
          genero:'hombre',
          colores:[ {name:'Negro',code:'#000'}, {name:'Marron',code:'#8B4513'} ],
          tallas:['S','M','L'],
          stock:{ Negro:{S:10,M:0,L:5}, Marron:{S:2,M:3,L:0} },
          imagenes:{ Negro:['img/hombre-1.webp','img/hombre-2.webp'], Marron:['img/hombre-2.webp','img/hombre-1.webp'] }
        },
        {
          id:2,
          nombre:'Chaqueta Elegancia Mujer',
          descripcion:'Estilo y confort',
          precio:430000,
          imagen:'img/mujer-1.webp',
          genero:'mujer',
          colores:[ {name:'Rojo',code:'#B22222'}, {name:'Beige',code:'#F5F5DC'} ],
          tallas:['XS','S','M'],
          stock:{ Rojo:{XS:1,S:2,M:0}, Beige:{XS:0,S:5,M:2} },
          imagenes:{ Rojo:['img/mujer-1.webp','img/mujer-2.jpg'], Beige:['img/mujer-2.jpg','img/mujer-1.webp'] }
        },
        {
          id:3,
          nombre:'Chaqueta Ultra gama Mujer',
          descripcion:'Estilo y firmeza',
          precio:450000,
          imagen:'img/mujer-3.jpg',
          genero:'mujer',
          colores:[ {name:'Verde',code:'#1B2624'} ],
          tallas:['S'],
          stock:{ Verde:{XS:0,S:2,M:0} },
          imagenes:{ Verde:['img/mujer-3.jpg'] }
        },
        {
          id:4,
          nombre:'Chaqueta Oil Hombre',
          descripcion:'Enmarcado, tallado',
          precio:460000,
          imagen:'img/hombre-3.jpg',
          genero:'hombre',
          colores:[ {name:'Azul',code:'#35393E'} ],
          tallas:['M'],
          stock:{ Azul:{XS:0,S:0,M:2} },
          imagenes:{ Azul:['img/hombre-3.jpg'] }
        }
      ],
      modalAbierto: false,
      productoModal: {},
      selectedColor: null,
      selectedSize: null,
      formulario: { nombre: '', email: '', mensaje: '' },
      formularioInicial: { nombre: '', email: '', mensaje: '' }
    }
  },
  computed: {
    
    productosFiltrados() {
      return this.filtroGenero==='todos' ? this.productos : this.productos.filter(p=>p.genero===this.filtroGenero);
    }
  },
  methods:{
    scrollToCatalog() {
      document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
    },
    onScroll(){
      const scrollPos=window.scrollY+window.innerHeight;
      const footerTop=document.getElementById('contacto').getBoundingClientRect().top+window.scrollY;
      this.showContactUsMessage=scrollPos>=footerTop;
    },
    prevImage(){ const imgs=this.productoModal.imagenes[this.selectedColor]; this.imagenIndex=(this.imagenIndex+imgs.length-1)%imgs.length; },
    nextImage(){ const imgs=this.productoModal.imagenes[this.selectedColor]; this.imagenIndex=(this.imagenIndex+1)%imgs.length; },
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
    selectColor(c){ this.selectedColor=c; this.selectedSize=null; },
    selectSize(s){ if(this.hasStock(this.selectedColor,s)) this.selectedSize=s; },
    hasStock(c,s){ return this.productoModal.stock[c]?.[s]>0; },
    pagar() {
      if (!this.selectedColor || !this.selectedSize) {
        alert('Selecciona un color y una talla antes de comprar.');
        return;
      }
      const msg = `Hola, me interesa la ${this.productoModal.nombre} en color ${this.selectedColor}, talla ${this.selectedSize}`;
      window.open(`https://wa.me/573506120616?text=${encodeURIComponent(msg)}`, '_blank');
      this.cerrarModal();
    },
    enviarMensaje() {
      alert(`Gracias, ${this.formulario.nombre}!`);
      this.formulario = { ...this.formularioInicial };
    },
  },
  mounted(){window.addEventListener('scroll',this.onScroll); setInterval(()=>{this.imagenActual=(this.imagenActual+1)%this.imagenesCarrusel.length;},5000);},
  beforeUnmount(){window.removeEventListener('scroll',this.onScroll);}
}).mount('#app');