/*
 * CONFIGURACIÓN DE LA TIENDA DE RELOJES
 * Cambia este archivo para poner el nombre, WhatsApp, modelos y correas del cliente.
 * Todos los datos son de EJEMPLO (tienda y modelos ficticios).
 */
window.STORE = {
  name: "Cumbre",
  // Número con código de país (51 = Perú), sin espacios ni "+". EJEMPLO, reemplazar.
  whatsapp: "51999999999",
  cities: "Lima · Huancayo · Cusco",

  // Escenas del scroll: número grande + pantalla del reloj (time | run | heart | dive)
  scenes: [
    { num: 49, unit: "mm", title: "Titanio que aguanta todo.", text: "Caja de titanio grado 5 y cristal de zafiro. Pesa menos que un llavero.", screen: "time", accent: "#ff6a1a" },
    { num: 3000, unit: "nits", title: "Se lee a pleno sol.", text: "En la Plaza de Armas al mediodía o en el nevado a las 5 am. Siempre se ve.", screen: "run", accent: "#ffb21a" },
    { num: 36, unit: "horas", title: "Batería para todo el trekking.", text: "Hasta 72 horas en modo ahorro. Carga del 0 al 80% en una hora.", screen: "heart", accent: "#ff3b3b" },
    { num: 100, unit: "metros", title: "Bajo el agua, también.", text: "Sumergible a 100 m. Registra profundidad, temperatura y tiempo de buceo.", screen: "dive", accent: "#2f8cff" }
  ],

  // Correas (cambian el color del reloj)
  straps: [
    { id: "sendero", name: "Sendero", color: "#ff6a1a", desc: "Tejido elástico, para correr." },
    { id: "montana", name: "Montaña", color: "#3c5a3e", desc: "Lona resistente con hebilla de titanio." },
    { id: "oceano", name: "Océano", color: "#1e2f4d", desc: "Caucho flexible, para el agua." },
    { id: "arena", name: "Arena", color: "#d9c7a7", desc: "Cuero vegetal, para la oficina." }
  ],

  // Modelos (precios EJEMPLO en soles)
  models: [
    { id: "cumbre-pro", name: "Cumbre Pro 49", price: 3499, tag: "Más completo", feats: ["Titanio 49 mm", "GPS doble frecuencia", "eSIM", "100 m"] },
    { id: "cumbre-sport", name: "Cumbre Sport 45", price: 2199, tag: "Más vendido", feats: ["Aluminio 45 mm", "GPS", "Medición de oxígeno", "50 m"] },
    { id: "cumbre-lite", name: "Cumbre Lite 41", price: 1299, tag: "Para empezar", feats: ["Aluminio 41 mm", "GPS", "Ritmo cardiaco", "50 m"] }
  ],
  months: [3, 6, 12]
};
