/*
 * CONFIGURACIÓN DE LA TIENDA DE ROPA
 * Cambia este archivo para poner el nombre, WhatsApp, fecha del drop y productos del cliente.
 * Todos los datos son de EJEMPLO (marca ficticia).
 */
window.SHOP = {
  name: "Calle 64",
  // Número con código de país (51 = Perú), sin espacios ni "+". EJEMPLO, reemplazar.
  whatsapp: "51999999999",
  city: "Huancayo",
  dropName: "Drop 07 · Andes",
  dropDate: "2026-12-12T19:00:00-05:00", // fecha y hora del próximo lanzamiento (hora de Perú)
  embroidery: 25, // precio del bordado con nombre, en soles

  // Colores disponibles: body = color principal, stripe = franja
  colors: {
    rojo: { body: "#c8161d", stripe: "#f4f1ea", name: "Rojo volcán" },
    negro: { body: "#1a1a1c", stripe: "#c8161d", name: "Negro asfalto" },
    hueso: { body: "#ece7dc", stripe: "#1a1a1c", name: "Hueso" },
    verde: { body: "#2f4a35", stripe: "#e9d8a6", name: "Verde puna" }
  },

  // Productos (precios EJEMPLO en soles). type: jacket | hoodie | jogger | cap
  products: [
    { id: "casaca", name: "Casaca Track Andes", type: "jacket", price: 229, colors: ["rojo", "negro", "hueso"], sizes: ["S", "M", "L", "XL"] },
    { id: "polera", name: "Polera Oversize 64", type: "hoodie", price: 159, colors: ["negro", "hueso", "verde"], sizes: ["S", "M", "L", "XL"] },
    { id: "jogger", name: "Jogger Franja", type: "jogger", price: 139, colors: ["negro", "rojo", "verde"], sizes: ["28", "30", "32", "34"] },
    { id: "gorra", name: "Gorra Wanka", type: "cap", price: 69, colors: ["rojo", "negro", "hueso"], sizes: ["Única"] }
  ],

  lookbook: [
    { color: "rojo", type: "jacket", caption: "Plaza Huamanmarca, 6:40 pm" },
    { color: "negro", type: "hoodie", caption: "Calle Real, de noche" },
    { color: "hueso", type: "jacket", caption: "Torre Torre, al amanecer" },
    { color: "verde", type: "jogger", caption: "Feria dominical" },
    { color: "negro", type: "jacket", caption: "Parque de la Identidad" }
  ]
};
