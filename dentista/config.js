/*
 * CONFIGURACIÓN DE LA CLÍNICA DENTAL
 * Cambia este archivo para poner el nombre, WhatsApp, sedes, precios y doctores del cliente.
 * Todos los datos de abajo son de EJEMPLO (clínica ficticia).
 */
window.CLINIC = {
  name: "Illari Dental",
  // Número con código de país (51 = Perú), sin espacios ni "+". EJEMPLO, reemplazar.
  whatsapp: "51999999999",

  // Cifras de confianza (cuentan al aparecer)
  stats: [
    { value: 8400, prefix: "+", suffix: "", label: "Pacientes atendidos" },
    { value: 4.9, prefix: "", suffix: "★", decimals: 1, label: "Promedio en Google" },
    { value: 12, prefix: "", suffix: " años", label: "Cuidando sonrisas" },
    { value: 2, prefix: "", suffix: " sedes", label: "Huancayo y Lima" }
  ],

  // Tratamientos con precio de referencia en soles (EJEMPLO)
  treatments: [
    { id: "limpieza", name: "Limpieza y profilaxis", price: "S/ 90", note: "con ultrasonido", icon: "spark", size: "w" },
    { id: "blanqueamiento", name: "Blanqueamiento LED", price: "S/ 490", note: "en una sola sesión", icon: "sun", size: "w" },
    { id: "ortodoncia", name: "Ortodoncia con brackets", price: "S/ 2,900", note: "o cuotas desde S/ 160", icon: "brace", size: "s" },
    { id: "alineadores", name: "Alineadores invisibles", price: "S/ 6,900", note: "plan digital 3D", icon: "clear", size: "s" },
    { id: "implantes", name: "Implantes dentales", price: "S/ 3,200", note: "por pieza, con corona", icon: "implant", size: "t" },
    { id: "carillas", name: "Carillas de porcelana", price: "S/ 750", note: "por pieza", icon: "shine", size: "s" },
    { id: "endodoncia", name: "Endodoncia", price: "S/ 380", note: "sin dolor, con sedación", icon: "root", size: "s" },
    { id: "ninos", name: "Odontopediatría", price: "S/ 70", note: "consulta para niños", icon: "kid", size: "w" }
  ],

  // Calculadora de cuotas (precio total EJEMPLO en soles)
  financing: [
    { name: "Ortodoncia con brackets", total: 2900 },
    { name: "Alineadores invisibles", total: 6900 },
    { name: "Implante dental", total: 3200 },
    { name: "Diseño de sonrisa (6 carillas)", total: 4500 }
  ],
  months: [3, 6, 12, 18],

  // Especialistas (nombres ficticios)
  doctors: [
    { name: "Dra. Valeria Huamán", role: "Ortodoncia y alineadores", cop: "COP 21458", years: 11 },
    { name: "Dr. Renato Quispe", role: "Implantes y cirugía oral", cop: "COP 18733", years: 15 },
    { name: "Dra. Lucía Mendoza", role: "Estética y diseño de sonrisa", cop: "COP 25190", years: 8 }
  ],

  // Sedes (direcciones de EJEMPLO)
  locations: [
    { city: "Huancayo", area: "El Tambo", address: "Av. Huancavelica 1250, El Tambo", hours: "Lun a sáb · 9:00 a 20:00" },
    { city: "Lima", area: "Miraflores", address: "Av. Larco 880, piso 4, Miraflores", hours: "Lun a sáb · 8:00 a 21:00" }
  ],

  // Opiniones (EJEMPLO)
  reviews: [
    { name: "Andrea P.", text: "Me hice el blanqueamiento en una hora y no sentí nada. El trato fue increíble.", tag: "Blanqueamiento" },
    { name: "Jorge M.", text: "Pagué mis alineadores en cuotas y nadie nota que los uso. Recomendadísimo.", tag: "Alineadores" },
    { name: "Rosa C.", text: "Llevé a mi hijo con miedo al dentista y salió feliz con su diploma.", tag: "Niños" },
    { name: "Luis T.", text: "Mi implante quedó idéntico a mis dientes. Explican todo con calma.", tag: "Implantes" },
    { name: "Milagros R.", text: "Reservé por WhatsApp un sábado y me atendieron a la hora exacta.", tag: "Limpieza" },
    { name: "Diego V.", text: "Las carillas me cambiaron la sonrisa. Vale cada sol.", tag: "Carillas" }
  ],

  faqs: [
    { q: "¿La primera consulta tiene costo?", a: "La evaluación con radiografía digital cuesta S/ 40 y se descuenta si empiezas tu tratamiento ese mismo mes." },
    { q: "¿Puedo pagar en cuotas?", a: "Sí. Ortodoncia, alineadores, implantes y carillas se pueden pagar en 3 a 18 cuotas sin intereses con tarjeta, o en cuotas directas con la clínica." },
    { q: "¿Qué medios de pago aceptan?", a: "Yape, Plin, transferencia, efectivo y todas las tarjetas Visa y Mastercard." },
    { q: "¿Duele el blanqueamiento?", a: "No. Protegemos tus encías y usamos un gel desensibilizante. Puedes sentir algo de sensibilidad leve por uno o dos días." },
    { q: "¿Atienden emergencias?", a: "Sí. Escríbenos por WhatsApp y te damos el primer espacio libre del día en la sede más cercana." }
  ]
};
