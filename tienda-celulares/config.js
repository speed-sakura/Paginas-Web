/*
 * CONFIGURACIÓN DE LA TIENDA
 * Para entregar esta web a un cliente nuevo, cambia solo este archivo:
 * nombre, número de WhatsApp y catálogo. Todos los datos de abajo son de ejemplo.
 */
window.STORE = {
  name: "Kuntur Mobile",
  // Número con código de país (51 = Perú), sin espacios ni "+". EJEMPLO, reemplazar.
  whatsapp: "51999999999",
  installments: 12, // cuotas sin intereses que se muestran en cada producto

  /*
   * Catálogo. Cada producto se dibuja con CSS, sin fotos.
   * Para usar fotos reales, agrega image: "img/archivo.png" (fondo transparente).
   * cam: forma del módulo de cámaras: "tri" | "vertical" | "square" | "circle"
   * colors: [nombre, color de la carcasa]
   * screen: dos colores para el fondo de pantalla
   */
  products: [
    {
      id: "ip16pm", brand: "apple", name: "iPhone 16 Pro Max", storage: "256 GB",
      price: 5999, oldPrice: 6499, badge: "Más vendido", cam: "tri",
      colors: [["Titanio desierto", "#c4a58a"], ["Titanio natural", "#b9b4aa"], ["Titanio negro", "#3b3b3d"]],
      screen: ["#ff8a3d", "#5b2bff"], specs: ["A18 Pro", "48 MP", "6.9\""]
    },
    {
      id: "s25u", brand: "samsung", name: "Galaxy S25 Ultra", storage: "512 GB",
      price: 4899, oldPrice: 5599, badge: "Oferta", cam: "vertical",
      colors: [["Titanio plata azul", "#8a9bb0"], ["Titanio negro", "#2e3034"], ["Titanio gris", "#9a9a98"]],
      screen: ["#4fd1ff", "#2b2bff"], specs: ["200 MP", "S Pen", "6.9\""]
    },
    {
      id: "ip16", brand: "apple", name: "iPhone 16", storage: "128 GB",
      price: 3699, cam: "tri",
      colors: [["Ultramarino", "#7d8fe0"], ["Verde azulado", "#8fc3b6"], ["Rosa", "#eab5c6"], ["Negro", "#2c2c2e"]],
      screen: ["#7b6cff", "#ff5fa2"], specs: ["A18", "48 MP", "6.1\""]
    },
    {
      id: "rn14p", brand: "xiaomi", name: "Redmi Note 14 Pro+", storage: "256 GB",
      price: 1599, oldPrice: 1899, badge: "Oferta", cam: "square",
      colors: [["Morado lavanda", "#a693d6"], ["Negro medianoche", "#1f2024"], ["Azul hielo", "#a9c9e3"]],
      screen: ["#b06bff", "#00e0b0"], specs: ["200 MP", "120W", "6.67\""]
    },
    {
      id: "x15u", brand: "xiaomi", name: "Xiaomi 15 Ultra", storage: "512 GB",
      price: 4599, badge: "Nuevo", cam: "circle",
      colors: [["Plata cromo", "#d8d6d0"], ["Negro", "#202022"]],
      screen: ["#ffd166", "#ef476f"], specs: ["Leica", "1\"", "6.73\""]
    },
    {
      id: "a56", brand: "samsung", name: "Galaxy A56 5G", storage: "256 GB",
      price: 1499, cam: "vertical",
      colors: [["Grafito", "#3c3d41"], ["Rosa", "#e7c3cf"], ["Oliva", "#a7ad8c"]],
      screen: ["#00c2ff", "#7affc1"], specs: ["50 MP", "5,000 mAh", "6.7\""]
    },
    {
      id: "edge60", brand: "motorola", name: "Motorola Edge 60 Pro", storage: "256 GB",
      price: 1899, oldPrice: 2199, badge: "Oferta", cam: "square",
      colors: [["Azul Pantone", "#2f5d8a"], ["Verde bosque", "#3d5a4a"], ["Uva", "#5b3d6b"]],
      screen: ["#3ae0ff", "#ff6b3d"], specs: ["pOLED", "90W", "6.7\""]
    },
    {
      id: "g85", brand: "motorola", name: "Moto G85 5G", storage: "256 GB",
      price: 999, cam: "vertical",
      colors: [["Azul cobalto", "#2a4fa0"], ["Gris urbano", "#5b5f66"]],
      screen: ["#57ffd2", "#3a6bff"], specs: ["50 MP", "OLED", "6.67\""]
    },
    {
      id: "h400", brand: "honor", name: "Honor 400 Pro", storage: "512 GB",
      price: 2799, badge: "Nuevo", cam: "circle",
      colors: [["Lunar gris", "#c9ccd2"], ["Negro", "#1c1c1f"]],
      screen: ["#ff6bd6", "#6b8bff"], specs: ["200 MP", "100W", "6.7\""]
    }
  ],

  reviews: [
    ["Rosa M.", "Huancayo", "Pedí el Redmi a las 10 de la mañana y a las 4 de la tarde ya lo tenía en casa. Todo sellado y con boleta."],
    ["Luis A.", "San Juan de Lurigancho", "Me recibieron mi iPhone viejo en el Plan Canje y pagué la diferencia en cuotas. Súper fácil."],
    ["Katherine P.", "Arequipa", "Me atendieron por WhatsApp un domingo en la noche. Llegó por Shalom en 2 días."],
    ["Jorge Q.", "El Tambo", "La tienda de Calle Real es otro nivel. Pude probar los equipos antes de comprar."],
    ["Daniela R.", "Miraflores", "Precio mejor que en las tiendas por departamento y te regalan case y protector."],
    ["Miguel T.", "Jauja", "Tuve una falla y me prestaron otro celular mientras lo reparaban. Recomendados."]
  ]
};
