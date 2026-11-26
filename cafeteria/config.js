/*
 * CONFIGURACIÓN DE LA CAFETERÍA
 * Para entregar esta web a un cliente nuevo, cambia este archivo:
 * nombre, WhatsApp, carta y precios. Todos los datos de abajo son de EJEMPLO.
 */
window.CAFE = {
  name: "Raíz Café",
  // Número con código de país (51 = Perú), sin espacios ni "+". EJEMPLO, reemplazar.
  whatsapp: "51999999999",

  /*
   * Carta. icon: "cup" | "glass" | "croissant" | "cake" | "plate" | "bag"
   */
  menu: {
    calientes: [
      { id: "esp", name: "Espresso", desc: "Doble, de Villa Rica. Notas a chocolate y panela.", price: 7, icon: "cup" },
      { id: "ame", name: "Americano", desc: "Espresso alargado con agua caliente.", price: 8, icon: "cup" },
      { id: "cap", name: "Capuccino", desc: "Espresso, leche texturizada y espuma alta.", price: 11, icon: "cup", tag: "Favorito" },
      { id: "fla", name: "Flat white", desc: "Doble ristretto y microespuma sedosa.", price: 12, icon: "cup" },
      { id: "v60", name: "Filtrado V60", desc: "Método de goteo. Pregunta por el lote de la semana.", price: 13, icon: "cup", tag: "De especialidad" },
      { id: "mat", name: "Mate de coca con muña", desc: "Para el frío de Huancayo.", price: 6, icon: "cup" }
    ],
    frios: [
      { id: "cbr", name: "Cold brew", desc: "Macerado 18 horas en frío. Dulce natural.", price: 12, icon: "glass", tag: "Nuevo" },
      { id: "ice", name: "Iced latte", desc: "Espresso doble sobre leche fría y hielo.", price: 12, icon: "glass" },
      { id: "frp", name: "Frappé de lúcuma", desc: "Café, lúcuma de la casa y crema batida.", price: 15, icon: "glass", tag: "Favorito" },
      { id: "lim", name: "Espresso tónica", desc: "Agua tónica, hielo, espresso y cáscara de limón.", price: 13, icon: "glass" }
    ],
    comer: [
      { id: "cro", name: "Croissant de mantequilla", desc: "Horneado cada mañana.", price: 8, icon: "croissant" },
      { id: "emp", name: "Empanada de carne", desc: "Masa hojaldrada, relleno jugoso.", price: 9, icon: "croissant" },
      { id: "chi", name: "Chicharrón con camote", desc: "Pan francés, salsa criolla.", price: 16, icon: "plate", tag: "Favorito" },
      { id: "tos", name: "Tostada de palta", desc: "Pan de masa madre, huevo pochado.", price: 18, icon: "plate" },
      { id: "tor", name: "Torta de chocolate", desc: "Con fudge y cacao de Satipo.", price: 12, icon: "cake" },
      { id: "kgs", name: "Café en grano 250 g", desc: "Villa Rica, tueste medio. Molemos gratis.", price: 38, icon: "bag" }
    ]
  },

  // Arma tu bebida: precios en soles. layers = proporciones de la taza (de abajo hacia arriba).
  builder: {
    bases: [
      { id: "latte", name: "Latte", price: 11, layers: { choco: 0, coffee: 22, milk: 58, foam: 10 } },
      { id: "capu", name: "Capuccino", price: 11, layers: { choco: 0, coffee: 25, milk: 35, foam: 30 } },
      { id: "moca", name: "Mocaccino", price: 13, layers: { choco: 16, coffee: 22, milk: 40, foam: 12 } },
      { id: "amer", name: "Americano", price: 8, layers: { choco: 0, coffee: 82, milk: 0, foam: 4 } }
    ],
    sizes: [
      { id: "s", name: "8 oz", add: 0, scale: .8 },
      { id: "m", name: "12 oz", add: 2, scale: .9 },
      { id: "l", name: "16 oz", add: 4, scale: 1 }
    ],
    milks: [
      { id: "ent", name: "Entera", add: 0 },
      { id: "des", name: "Deslactosada", add: 0 },
      { id: "ave", name: "Avena", add: 2 },
      { id: "alm", name: "Almendras", add: 3 }
    ],
    extras: [
      { id: "shot", name: "Shot extra", add: 2 },
      { id: "vain", name: "Vainilla", add: 1.5 },
      { id: "cara", name: "Caramelo", add: 1.5 },
      { id: "hielo", name: "Con hielo", add: 0 }
    ]
  },

  reviews: [
    ["Andrea V.", "El mejor capuccino de Huancayo, y el croissant sale calientito."],
    ["Renzo C.", "Pedí por WhatsApp y lo recogí sin hacer cola. Diez de diez."],
    ["Milagros T.", "Ambiente precioso para trabajar. Buen wifi y enchufes en cada mesa."],
    ["Diego P.", "Compré el café en grano de Villa Rica y ya no puedo tomar otro."],
    ["Fiorella Q.", "El frappé de lúcuma es otra cosa. Vuelvo cada semana."]
  ]
};
