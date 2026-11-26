/*
 * CONFIGURACIÓN DE LA MARCA DE CONSERVAS
 * Cambia este archivo para poner el nombre, WhatsApp, productos y cajas del cliente.
 * Todos los datos son de EJEMPLO (marca ficticia).
 */
window.BRAND = {
  name: "Wayta",
  // Número con código de país (51 = Perú), sin espacios ni "+". EJEMPLO, reemplazar.
  whatsapp: "51999999999",

  // Productos (precios EJEMPLO en soles). fill = color del contenido, label = color de la etiqueta
  products: [
    { id: "aguaymanto", name: "Aguaymanto", kind: "Mermelada", type: "dulce", price: 22, fill: "#f39a1e", label: "#f6e7c8", ink: "#b5530b", desc: "Aguaymanto de Concepción con un toque de canela. Ideal con queso fresco." },
    { id: "aji", name: "Ají amarillo", kind: "Crema", type: "picante", price: 18, fill: "#f2c21b", label: "#2f5e2a", ink: "#f6e7c8", desc: "Ají amarillo asado, cremoso y con picor medio. Para papas, pollo y todo." },
    { id: "rocoto", name: "Rocoto", kind: "Conserva", type: "picante", price: 20, fill: "#c8261f", label: "#f6e7c8", ink: "#c8261f", desc: "Rocoto de Oxapampa en rodajas, en vinagre de chicha. Picor alto." },
    { id: "sauco", name: "Sauco", kind: "Mermelada", type: "dulce", price: 24, fill: "#4a1d4f", label: "#e2d3f0", ink: "#4a1d4f", desc: "Baya andina silvestre, profunda y poco dulce. La favorita para postres." },
    { id: "huacatay", name: "Huacatay", kind: "Salsa", type: "picante", price: 19, fill: "#4f7d2b", label: "#f2c21b", ink: "#2c4a14", desc: "La hierba de la ocopa, molida con maní y queso. Sabor de la sierra." },
    { id: "lucuma", name: "Lúcuma", kind: "Manjar", type: "dulce", price: 26, fill: "#c98a3e", label: "#1f3a5f", ink: "#f6e7c8", desc: "Manjar de lúcuma de seda, para panqueques, helados o a cucharadas." },
    { id: "tumbo", name: "Tumbo", kind: "Mermelada", type: "dulce", price: 22, fill: "#e7b84a", label: "#c8261f", ink: "#f6e7c8", desc: "Ácida y fragante, del tumbo serrano. Va increíble con yogurt." }
  ],

  // Cajas de regalo: cuántos frascos y descuento
  boxes: [
    { size: 3, off: 0.05, label: "Caja de 3" },
    { size: 6, off: 0.12, label: "Caja de 6" },
    { size: 9, off: 0.18, label: "Caja de 9" }
  ],

  stores: [
    { city: "Huancayo", place: "Tienda Wayta · Jr. Ancash 230 (ejemplo)" },
    { city: "Lima", place: "Bioferias de Miraflores y Surco (sábados)" },
    { city: "Todo Perú", place: "Envío por agencia en 48 a 72 h" }
  ]
};
