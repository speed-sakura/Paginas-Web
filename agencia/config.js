/*
 * CONFIGURACIÓN DE LA WEB DE LA AGENCIA
 * Cambia este archivo para poner tu marca, tu WhatsApp, tus cifras y tus precios.
 * Todos los datos de abajo son de EJEMPLO.
 */
window.AGENCY = {
  name: "Vértice",
  // Número con código de país (51 = Perú), sin espacios ni "+". EJEMPLO, reemplazar.
  whatsapp: "51999999999",

  // Cifras de la sección "Únete a los negocios..." (EJEMPLO: pon las tuyas reales)
  stats: [
    { value: 120, prefix: "+", suffix: "", label: "Webs entregadas" },
    { value: 2.4, prefix: "S/ ", suffix: " M", decimals: 1, label: "Vendido por nuestros clientes" },
    { value: 14, prefix: "+", suffix: "", label: "Ciudades del Perú" }
  ],

  // Carrusel 3D de la portada: tus trabajos (imagen = captura de la web)
  showcase: [
    { word: "KUNTUR", tag: "Tienda de celulares", img: "../img/tienda-celulares.jpg", url: "../tienda-celulares/" },
    { word: "KALLPA", tag: "Tienda de laptops", img: "../img/laptops.jpg", url: "../laptops/" },
    { word: "WAYRA", tag: "Restaurante", img: "../img/restaurante.jpg", url: "../restaurante/" },
    { word: "LÚCUMA", tag: "Pastelería", img: "../img/pasteleria.jpg", url: "../pasteleria/" },
    { word: "RAÍZ", tag: "Cafetería", img: "../img/cafeteria.jpg", url: "../cafeteria/" }
  ],

  // Planes del prisma 3D (precios EJEMPLO en soles)
  plans: [
    {
      name: "Página Empresarial",
      price: "Desde S/ 1,490",
      lead: "Tu negocio serio y confiable en Google desde la primera semana.",
      bullets: ["Hasta 6 secciones", "Botón y formulario a WhatsApp", "Mapa, horarios y reseñas"],
      card: "Ideal para clínicas, estudios, talleres y servicios.",
      img: "../img/restaurante.jpg"
    },
    {
      name: "Tienda con pedidos",
      price: "Desde S/ 2,890",
      lead: "Catálogo con carrito que te manda el pedido ordenado a tu WhatsApp.",
      bullets: ["Catálogo con filtros", "Carrito con total en soles", "Sin comisiones por venta"],
      card: "Ideal para tiendas de celulares, ropa y tecnología.",
      img: "../img/tienda-celulares.jpg"
    },
    {
      name: "Restaurante y Café",
      price: "Desde S/ 1,990",
      lead: "Carta digital que abre el apetito y reservas en un toque.",
      bullets: ["Carta con fotos y precios", "Reservas y delivery", "Código QR para mesas"],
      card: "Ideal para restaurantes, cafeterías y pastelerías.",
      img: "../img/cafeteria.jpg"
    },
    {
      name: "Premium a medida",
      price: "Desde S/ 5,900",
      lead: "Animaciones 3D, efectos de vidrio y una experiencia que nadie más tiene.",
      bullets: ["Diseño 100% a medida", "Animaciones y efectos 3D", "Asesoría de marca incluida"],
      card: "Para marcas que quieren verse como las grandes.",
      img: "../img/laptops.jpg"
    }
  ]
};
