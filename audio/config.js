/*
 * CONFIGURACIÓN DE LA TIENDA DE AUDIO
 * Cambia este archivo para poner el nombre, WhatsApp y productos del cliente.
 * Todos los datos son de EJEMPLO (tienda y marca ficticias).
 */
window.STORE = {
  name: "Resonar",
  // Número con código de país (51 = Perú), sin espacios ni "+". EJEMPLO, reemplazar.
  whatsapp: "51999999999",
  cities: "Lima · Huancayo · Arequipa",

  // Productos (precios EJEMPLO en soles). shape: cyl | mini | tower | bar
  products: [
    { id: "uno", name: "Resonar Uno", shape: "cyl", price: 1290, old: 1490, tag: "Más vendido", desc: "360°, 38 h de batería, resistente al agua.", colors: ["#8cff5a", "#6ee7ff", "#c48bff"] },
    { id: "mini", name: "Resonar Mini", shape: "mini", price: 590, tag: "Para viajar", desc: "Cabe en la mano. 20 h y gancho para mochila.", colors: ["#ffb14a", "#8cff5a", "#ff6a8b"] },
    { id: "torre", name: "Resonar Torre", shape: "tower", price: 2890, tag: "Fiestas", desc: "300 W, luces que siguen el ritmo, entrada de micro.", colors: ["#6ee7ff", "#8cff5a"] },
    { id: "barra", name: "Resonar Barra", shape: "bar", price: 1690, tag: "Cine en casa", desc: "Barra de sonido 5.1 con subwoofer inalámbrico.", colors: ["#c48bff", "#6ee7ff"] }
  ],

  features: [
    { big: 38, unit: "h", title: "De batería real", text: "Medidas a volumen alto, no en silencio.", tone: "green" },
    { big: 2, unit: "años", title: "De garantía en Perú", text: "Servicio técnico propio en Lima y Huancayo.", tone: "violet" },
    { big: 24, unit: "h", title: "Envío express", text: "Gratis en Lima Metropolitana y Huancayo.", tone: "cyan" },
    { big: 12, unit: "cuotas", title: "Sin intereses", text: "Con tarjetas participantes (ejemplo).", tone: "green" }
  ],

  specs: [
    { k: "Respuesta de frecuencia", v: "40 Hz – 22 kHz" },
    { k: "Potencia", v: "60 W RMS" },
    { k: "Batería", v: "38 horas" },
    { k: "Conectividad", v: "Bluetooth 5.3 · USB-C · Aux" },
    { k: "Resistencia", v: "Agua y polvo IP67" }
  ],

  reviews: [
    { name: "Daniela R.", city: "Miraflores", text: "Lo usé en la playa todo el fin de semana y aún le quedaba batería. El bajo es otro nivel." },
    { name: "Jorge T.", city: "Huancayo", text: "Me llegó al día siguiente. Lo conecté a la tele y ya no necesito barra de sonido." },
    { name: "Lucía P.", city: "Arequipa", text: "La Torre es la estrella de cada reunión. Las luces se mueven con la música." }
  ]
};
