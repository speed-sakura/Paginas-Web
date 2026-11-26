/*
 * CONFIGURACIÓN DEL RESTAURANTE
 * Para entregar esta web a un cliente nuevo, cambia este archivo:
 * nombre, WhatsApp, carta, menú degustación y horarios de reserva.
 * Todos los datos de abajo son de EJEMPLO.
 */
window.RESTO = {
  name: "Wayra",
  // Número con código de país (51 = Perú), sin espacios ni "+". EJEMPLO, reemplazar.
  whatsapp: "51999999999",

  // tags: "chef" (recomendado del chef), "picante", "veg"
  menu: {
    entradas: [
      { name: "Ceviche Wayra", desc: "Pesca del día, leche de tigre de ají limo, camote glaseado y choclo de Urubamba.", price: 58, tags: ["chef", "picante"] },
      { name: "Tiradito nikkei", desc: "Corte fino de lenguado, salsa de maracuyá y ponzu, aceite de ajonjolí.", price: 52 },
      { name: "Causa de pulpo al olivo", desc: "Papa amarilla, pulpo a la parrilla, mayonesa de aceituna botija.", price: 46 },
      { name: "Anticuchos de corazón", desc: "A la brasa, con papas doradas y crema de rocoto.", price: 39, tags: ["picante"] },
      { name: "Tamalito verde", desc: "Choclo y culantro, salsa criolla. Receta de la abuela.", price: 28, tags: ["veg"] }
    ],
    fondos: [
      { name: "Lomo saltado al wok", desc: "Lomo fino, tomate, cebolla y papas nativas fritas, arroz con choclo.", price: 72, tags: ["chef"] },
      { name: "Arroz con pato norteño", desc: "Pato confitado 12 horas, arroz al culantro, sarsa de zarandaja.", price: 68 },
      { name: "Ají de gallina de la casa", desc: "Gallina de corral, crema de ají amarillo, pecanas, huevo de codorniz.", price: 49 },
      { name: "Seco de cordero", desc: "Cordero de la sierra, frejoles canarios y yuca frita.", price: 74 },
      { name: "Risotto de quinua y hongos", desc: "Quinua blanca, hongos de Cusco, queso andino.", price: 54, tags: ["veg"] }
    ],
    mar: [
      { name: "Pescado a lo macho", desc: "Filete dorado, salsa de mariscos y ají panca.", price: 76, tags: ["picante"] },
      { name: "Chupe de camarones", desc: "Camarones de río de Arequipa, huevo, queso fresco, orégano.", price: 82, tags: ["chef"] },
      { name: "Arroz con mariscos", desc: "Al estilo chalaco, con salsa criolla.", price: 64 },
      { name: "Pulpo a la brasa", desc: "Puré de papa amarilla al ají, chimichurri de huacatay.", price: 79 }
    ],
    postres: [
      { name: "Suspiro limeño", desc: "Manjar blanco, merengue al oporto, canela.", price: 24 },
      { name: "Picarones", desc: "Masa de zapallo y camote, miel de chancaca.", price: 22, tags: ["chef"] },
      { name: "Tres texturas de lúcuma", desc: "Helado, mousse y crocante.", price: 26 },
      { name: "Pisco sour clásico", desc: "Pisco quebranta, limón de Chulucanas, amargo de angostura.", price: 32 },
      { name: "Chicha morada de la casa", desc: "Jarra de 1 litro. Maíz morado, piña y canela.", price: 18 }
    ]
  },

  // Menú degustación: hue = color del plato dibujado
  tasting: {
    price: 289, pairing: 140,
    courses: [
      { name: "Bocado del Pacífico", desc: "Ostra, leche de tigre helada y algas.", hue: "#d9e6e2" },
      { name: "Papa nativa", desc: "Cinco papas, cinco colores, ají de huacatay.", hue: "#c78bb0" },
      { name: "Ceviche de conchas", desc: "Conchas de Sechura, ají limo, choclo tostado.", hue: "#f0d98a" },
      { name: "Fuego de la sierra", desc: "Paiche a la brasa, hojas de bijao.", hue: "#e07a4a" },
      { name: "Cordero 18 horas", desc: "Frejoles canarios, chicha de jora.", hue: "#7a3b2e" },
      { name: "Cacao de Piura", desc: "70% ganache, aguaymanto, sal de Maras.", hue: "#4a2a1e" },
      { name: "Sobremesa", desc: "Petit fours y café de Villa Rica.", hue: "#d4a55a" }
    ]
  },

  times: ["12:30", "13:00", "13:30", "14:00", "14:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"],
  zones: ["Salón", "Terraza", "Barra del chef"],
  occasions: ["Ninguna", "Cumpleaños", "Aniversario", "Negocios", "Pedida de mano"]
};
