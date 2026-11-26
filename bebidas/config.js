/*
 * CONFIGURACIÓN DE LA MARCA DE BEBIDAS
 * Cambia este archivo para poner el nombre, WhatsApp, sabores y packs del cliente.
 * Todos los datos son de EJEMPLO (marca ficticia).
 */
window.BRAND = {
  name: "Kausay",
  // Número con código de país (51 = Perú), sin espacios ni "+". EJEMPLO, reemplazar.
  whatsapp: "51999999999",

  // Sabores. can = color de la lata, bg = fondo de la escena, word = palabra gigante de fondo
  flavors: [
    { id: "morada", name: "Chicha Morada", word: "MORADA", can: "#5b1670", bg: "#d4127a", notes: "Maíz morado, piña, canela y clavo, con gas.", kcal: 70 },
    { id: "maracuya", name: "Maracuyá", word: "MARACUYÁ", can: "#f2a900", bg: "#ff8a00", notes: "Maracuyá de la selva central, ácido y tropical.", kcal: 65 },
    { id: "camu", name: "Camu Camu", word: "CAMU", can: "#d81f3c", bg: "#ff3d5a", notes: "La fruta con más vitamina C del mundo. De Loreto.", kcal: 60 },
    { id: "muna", name: "Muña y Limón", word: "MUÑA", can: "#2f8a52", bg: "#22b573", notes: "Muña de las alturas y limón de Chulucanas. Refresca y asienta.", kcal: 45 }
  ],

  // Packs (precios EJEMPLO en soles)
  packs: [
    { size: 6, price: 30 },
    { size: 12, price: 54 },
    { size: 24, price: 99 }
  ],

  delivery: "Delivery gratis en Lima y Huancayo desde 12 latas (ejemplo)."
};
