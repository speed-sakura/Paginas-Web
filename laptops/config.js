/*
 * CONFIGURACIÓN DE LA TIENDA DE LAPTOPS
 * Para entregar esta web a un cliente nuevo, cambia solo este archivo:
 * nombre, número de WhatsApp, catálogo y extras. Todos los datos son de EJEMPLO.
 */
window.STORE = {
  name: "Kallpa Laptops",
  // Número con código de país (51 = Perú), sin espacios ni "+". EJEMPLO, reemplazar.
  whatsapp: "51999999999",
  installments: 12, // cuotas sin intereses que se muestran en cada producto

  // Categorías del catálogo (id: texto que se ve)
  categories: {
    gamer: "Gamer",
    trabajo: "Trabajo",
    estudios: "Estudios",
    creadores: "Diseño y video",
    livianas: "Ultralivianas"
  },

  /*
   * Catálogo. Cada laptop se dibuja con CSS, sin fotos.
   * colors: [nombre, color del cuerpo]
   * screen: tres colores para el fondo de pantalla
   * specs: chips cortos que se ven en la tarjeta
   * detail: lista completa que se ve al abrir la laptop
   */
  products: [
    {
      id: "mba13", brand: "Apple", name: "MacBook Air 13\" M4", mem: "16 GB · 256 GB",
      price: 4599, oldPrice: 4999, badge: "Más vendida", cats: ["trabajo", "estudios", "livianas"],
      colors: [["Plata", "#d9dbe0"], ["Medianoche", "#2f3440"], ["Azul cielo", "#b9cde0"]],
      screen: ["#7aa8ff", "#c48bff", "#ffb3d1"], specs: ["Chip M4", "18 h batería", "1.24 kg"],
      detail: ["Chip Apple M4 de 10 núcleos", "16 GB de memoria unificada", "SSD de 256 GB", "Pantalla Liquid Retina 13.6\"", "Hasta 18 horas de batería", "Teclado en español"]
    },
    {
      id: "rog16", brand: "ASUS", name: "ROG Strix G16", mem: "32 GB · 1 TB",
      price: 7299, oldPrice: 7999, badge: "Oferta", cats: ["gamer", "creadores"],
      colors: [["Eclipse gris", "#3a3d45"]],
      screen: ["#ff3d7f", "#7b2bff", "#1fd1ff"], specs: ["RTX 4070", "i9-14900HX", "240 Hz"],
      detail: ["Intel Core i9-14900HX", "NVIDIA GeForce RTX 4070 8 GB", "32 GB DDR5", "SSD de 1 TB", "Pantalla 16\" QHD+ 240 Hz", "Teclado RGB por tecla"]
    },
    {
      id: "legion5", brand: "Lenovo", name: "Legion 5 Gen 9", mem: "16 GB · 1 TB",
      price: 5499, cats: ["gamer", "estudios"],
      colors: [["Gris luna", "#4a4f5a"]],
      screen: ["#ffb02e", "#ff4f5e", "#6b3bff"], specs: ["RTX 4060", "Ryzen 7", "165 Hz"],
      detail: ["AMD Ryzen 7 8845HS", "NVIDIA GeForce RTX 4060 8 GB", "16 GB DDR5", "SSD de 1 TB", "Pantalla 16\" WQXGA 165 Hz", "Refrigeración Legion Coldfront"]
    },
    {
      id: "zen14", brand: "ASUS", name: "Zenbook 14 OLED", mem: "16 GB · 1 TB",
      price: 3999, oldPrice: 4399, badge: "Nuevo", cats: ["trabajo", "creadores", "livianas"],
      colors: [["Azul ponder", "#3e4f73"], ["Blanco espuma", "#e7e5e0"]],
      screen: ["#3ee0c3", "#4f8bff", "#b36bff"], specs: ["OLED 3K", "Core Ultra 7", "1.2 kg"],
      detail: ["Intel Core Ultra 7 155H", "16 GB LPDDR5X", "SSD de 1 TB", "Pantalla OLED 14\" 3K 120 Hz", "Hasta 15 horas de batería", "Cuerpo de aluminio"]
    },
    {
      id: "nitrov", brand: "Acer", name: "Nitro V 15", mem: "16 GB · 512 GB",
      price: 3599, oldPrice: 3999, badge: "Oferta", cats: ["gamer", "estudios"],
      colors: [["Negro obsidiana", "#26282d"]],
      screen: ["#2bff9a", "#14b8ff", "#2b3bff"], specs: ["RTX 4050", "Core i5", "144 Hz"],
      detail: ["Intel Core i5-13420H", "NVIDIA GeForce RTX 4050 6 GB", "16 GB DDR5", "SSD de 512 GB", "Pantalla 15.6\" FHD 144 Hz", "Ideal para empezar a jugar"]
    },
    {
      id: "mbp14", brand: "Apple", name: "MacBook Pro 14\" M4 Pro", mem: "24 GB · 512 GB",
      price: 9499, cats: ["creadores", "trabajo"],
      colors: [["Negro espacial", "#2a2b2f"], ["Plata", "#d6d8dc"]],
      screen: ["#ff7a45", "#ff3d9a", "#7a5cff"], specs: ["M4 Pro", "XDR", "24 h batería"],
      detail: ["Chip Apple M4 Pro de 12 núcleos", "24 GB de memoria unificada", "SSD de 512 GB", "Pantalla Liquid Retina XDR 14.2\"", "Hasta 24 horas de batería", "Thunderbolt 5 y HDMI"]
    },
    {
      id: "pav15", brand: "HP", name: "Pavilion 15", mem: "16 GB · 512 GB",
      price: 2699, cats: ["trabajo", "estudios"],
      colors: [["Plata natural", "#c9ccd2"], ["Azul niebla", "#8fa3c0"]],
      screen: ["#5fd4ff", "#7aa8ff", "#a0f0d0"], specs: ["Core i5", "16 GB", "FHD IPS"],
      detail: ["Intel Core i5-1335U", "16 GB DDR4", "SSD de 512 GB", "Pantalla 15.6\" FHD IPS", "Teclado numérico", "Cámara HD con privacidad"]
    },
    {
      id: "slim3", brand: "Lenovo", name: "IdeaPad Slim 3", mem: "8 GB · 512 GB",
      price: 1899, oldPrice: 2199, badge: "Precio estudiante", cats: ["estudios"],
      colors: [["Gris ártico", "#b8bcc4"], ["Azul abismo", "#3b4a66"]],
      screen: ["#ffd36b", "#ff8fc7", "#8b7bff"], specs: ["Ryzen 5", "8 GB", "1.6 kg"],
      detail: ["AMD Ryzen 5 7520U", "8 GB LPDDR5", "SSD de 512 GB", "Pantalla 15.6\" FHD", "Carga rápida: 2 h de uso en 15 min", "Perfecta para clases y oficina"]
    }
  ],

  // Extras que el cliente puede sumar al abrir una laptop (precio en soles)
  extras: [
    { id: "gar", name: "Garantía extendida +1 año", price: 199 },
    { id: "m365", name: "Microsoft 365 Personal · 1 año", price: 249 },
    { id: "kit", name: "Kit mochila + mouse inalámbrico", price: 129 },
    { id: "mig", name: "Pasamos tus archivos de tu laptop anterior", price: 59 }
  ]
};
