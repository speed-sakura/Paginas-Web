/*
 * CONFIGURACIÓN DE LA PASTELERÍA
 * Para entregar esta web a un cliente nuevo, cambia este archivo:
 * nombre, WhatsApp, catálogo y precios del diseñador de tortas.
 * Todos los datos de abajo son de EJEMPLO.
 */
window.PASTE = {
  name: "Lúcuma Pastelería",
  // Número con código de país (51 = Perú), sin espacios ni "+". EJEMPLO, reemplazar.
  whatsapp: "51999999999",
  minDays: 2,          // días mínimos de anticipación para tortas personalizadas
  deliveryFee: 15,     // delivery en Lima

  /*
   * Catálogo. cover = color de la cobertura, sponge = color del bizcocho,
   * deco: "flores" | "frutas" | "chispas" | "oro" | "" ; sizes: [nombre, porciones, precio]
   */
  catalog: [
    { id: "lucuma", type: "tortas", name: "Torta de lúcuma", desc: "Nuestra firma. Bizcocho de vainilla, crema de lúcuma y manjar.", cover: "#e9c38f", sponge: "#f3dfb5", deco: "chispas", tag: "La más pedida",
      sizes: [["Mediana", 12, 79], ["Grande", 20, 125]] },
    { id: "selva", type: "tortas", name: "Selva negra", desc: "Chocolate húmedo, guindas y chantilly.", cover: "#4a2c2a", sponge: "#5b3328", deco: "frutas",
      sizes: [["Mediana", 12, 85], ["Grande", 20, 135]] },
    { id: "tresleches", type: "tortas", name: "Tres leches", desc: "Esponjosa, bañada y con merengue italiano tostado.", cover: "#fbf3e4", sponge: "#f6e6c2", deco: "",
      sizes: [["Mediana", 12, 69], ["Grande", 20, 109]] },
    { id: "fudge", type: "tortas", name: "Chocolate con fudge", desc: "Triple chocolate con fudge de la casa.", cover: "#3a2220", sponge: "#4a2a20", deco: "chispas", tag: "Favorita",
      sizes: [["Mediana", 12, 82], ["Grande", 20, 129]] },
    { id: "maracuya", type: "tortas", name: "Cheesecake de maracuyá", desc: "Base crocante, queso crema y gelée de maracuyá.", cover: "#f4c430", sponge: "#f7ecd0", deco: "",
      sizes: [["Mediana", 10, 89], ["Grande", 16, 139]] },
    { id: "redvelvet", type: "tortas", name: "Red velvet", desc: "Con frosting de queso crema y frutos rojos.", cover: "#fff6ef", sponge: "#b3283f", deco: "frutas",
      sizes: [["Mediana", 12, 92], ["Grande", 20, 145]] },
    { id: "alfajores", type: "postres", name: "Caja de alfajores", desc: "12 alfajores de maicena rellenos de manjar.", cover: "#f6e8d2", sponge: "#f6e8d2", deco: "", icon: "alfajor",
      sizes: [["x12", 0, 36], ["x24", 0, 68]] },
    { id: "cupcakes", type: "postres", name: "Cupcakes decorados", desc: "Con tu temática y colores.", cover: "#f4a7b9", sponge: "#f3dfb5", deco: "chispas", icon: "cupcake",
      sizes: [["x6", 0, 42], ["x12", 0, 78]] },
    { id: "pie", type: "postres", name: "Pie de limón", desc: "Masa sablé, crema de limón y merengue.", cover: "#f7f0c8", sponge: "#e9c38f", deco: "", icon: "pie",
      sizes: [["Mediano", 8, 49], ["Grande", 12, 72]] }
  ],

  /* Diseñador de tortas. add = precio adicional en soles */
  builder: {
    portions: [
      { n: 12, price: 95 }, { n: 20, price: 150 }, { n: 30, price: 220 }, { n: 50, price: 340 }
    ],
    tierAdd: 45, // por cada piso adicional
    sponges: [
      { name: "Vainilla", color: "#f3dfb5", add: 0 },
      { name: "Chocolate", color: "#5b3328", add: 0 },
      { name: "Red velvet", color: "#b3283f", add: 10 },
      { name: "Naranja", color: "#f2b25c", add: 0 },
      { name: "Lúcuma", color: "#e2b16e", add: 10 }
    ],
    fillings: [
      { name: "Manjar blanco", color: "#c98a4b", add: 0 },
      { name: "Fudge", color: "#3a2220", add: 0 },
      { name: "Crema de lúcuma", color: "#e9c38f", add: 12 },
      { name: "Fresa", color: "#e05a73", add: 8 },
      { name: "Maracuyá", color: "#f4c430", add: 8 }
    ],
    covers: [
      { name: "Rosado", color: "#f6b8c8" },
      { name: "Blanco", color: "#fffaf3" },
      { name: "Chocolate", color: "#4a2c2a" },
      { name: "Menta", color: "#bfe3d0" },
      { name: "Lila", color: "#cdb8e8" },
      { name: "Celeste", color: "#b7d7f0" }
    ],
    decos: [
      { id: "chispas", name: "Chispas", add: 0 },
      { id: "flores", name: "Flores de buttercream", add: 25 },
      { id: "frutas", name: "Frutos rojos", add: 22 },
      { id: "oro", name: "Detalles dorados", add: 35 }
    ]
  },

  reviews: [
    ["Gabriela S.", "Surco", "Diseñé la torta de mi hija en la web y llegó idéntica. ¡Hasta el color exacto!"],
    ["Óscar L.", "La Molina", "La torta de lúcuma es la mejor que he probado en Lima. Ya es tradición en mi familia."],
    ["Lucía F.", "Miraflores", "Pedí para un evento de la oficina con dos días de anticipación y llegó puntual."],
    ["Patricia M.", "San Borja", "Hicimos el baby shower con sus cupcakes temáticos. Todos preguntaron de dónde eran."],
    ["Valeria C.", "Surquillo", "Atención por WhatsApp rapidísima y te mandan foto antes de enviar la torta."]
  ]
};
