/*
 * CONFIGURACIÓN DEL BAR
 * Cambia este archivo para poner el nombre, WhatsApp, carta y agenda del cliente.
 * Todos los datos son de EJEMPLO (bar ficticio).
 */
window.BAR = {
  name: "Cinabrio",
  // Número con código de país (51 = Perú), sin espacios ni "+". EJEMPLO, reemplazar.
  whatsapp: "51999999999",
  address: "Av. Grau 340, Barranco, Lima",
  hours: "Mié a sáb · 7 pm a 2 am",

  // Carta (precios EJEMPLO en soles)
  menu: {
    "Pisco de autor": [
      { name: "Sour de Cinabrio", price: 36, desc: "Pisco quebranta, limón, jarabe de airampo y espuma de clara." },
      { name: "Chilcano de muña", price: 32, desc: "Pisco acholado, ginger ale artesanal, muña fresca." },
      { name: "Capitán Barranco", price: 38, desc: "Pisco italia, vermut rojo, amargo de cacao. Servido con humo." },
      { name: "Aguaymanto Collins", price: 34, desc: "Pisco, aguaymanto macerado, soda y cáscara de naranja." }
    ],
    "Clásicos": [
      { name: "Negroni de la casa", price: 40, desc: "Gin, bitter, vermut. Reposado 30 días en barrica." },
      { name: "Martini seco", price: 42, desc: "Gin londinense, vermut seco, aceituna o twist." },
      { name: "Old Fashioned", price: 44, desc: "Bourbon, azúcar de caña, amargo de angostura." },
      { name: "Espresso Martini", price: 38, desc: "Vodka, café de Chanchamayo, licor de café." }
    ],
    "Sin alcohol": [
      { name: "Rubí", price: 22, desc: "Chicha morada clarificada, maracuyá y tónica." },
      { name: "Huerta", price: 20, desc: "Pepino, hierbabuena, limón y soda." },
      { name: "Café tonic", price: 18, desc: "Espresso doble sobre tónica y naranja." }
    ]
  },

  // Agenda semanal (EJEMPLO)
  agenda: [
    { day: "Mié", title: "Noche de jazz", detail: "Trío en vivo · 9 pm" },
    { day: "Jue", title: "Cata de pisco", detail: "6 piscos, 2 horas · S/ 120 por persona" },
    { day: "Vie", title: "Vinilos", detail: "DJ residente · soul y funk" },
    { day: "Sáb", title: "Medianoche roja", detail: "Show de coctelería y DJ invitado" }
  ],

  zones: ["Barra", "Salón", "Terraza", "Reservado (8 a 14 personas)"]
};
