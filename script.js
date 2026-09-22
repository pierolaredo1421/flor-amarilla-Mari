// ================== CONFIGURA AQUÍ ==================
const CONFIG = {
  nombre: "Mari",        // nombre de tu amiga, ej. "Valeria" (vacío = no se muestra)
  firma: "— You daddy, Piero",
};

// Cada línea aparece escribiéndose sola, en este orden
const MENSAJES = [
  "Aunque estemos lejos, siempre estás en mi corazón, y siempre será así.",
  "Te quiero muchísimo, y eso nunca va a cambiar.",
  "Nunca vas a estar sola: pase lo que pase, aquí voy a estar para ti.",
  "Y el día que por fin nos volvamos a ver, será el mejor día de todos.",
  "Ah, y si hoy alguien te regaló una flor… bótala 😌",
  { texto: "Quédate solo con mi flor amarilla, porque la mía vivirá toda la vida. 🌼", destacado: true },
];
// ====================================================

const $ = (id) => document.getElementById(id);
const SVG = "http://www.w3.org/2000/svg";

// ---------- Estrellas ----------
for (let i = 0; i < 90; i++) {
  const e = document.createElement("span");
  e.className = "estrella";
  const t = Math.random() * 2 + 1;
  e.style.width = e.style.height = t + "px";
  e.style.left = Math.random() * 100 + "vw";
  e.style.top = Math.random() * 100 + "vh";
  e.style.animationDuration = 2 + Math.random() * 4 + "s";
  e.style.animationDelay = -Math.random() * 5 + "s";
  $("cielo").appendChild(e);
}

// ---------- Luciérnagas ----------
for (let i = 0; i < 18; i++) {
  const l = document.createElement("span");
  l.className = "luciernaga";
  l.style.left = Math.random() * 100 + "vw";
  l.style.top = Math.random() * 100 + "vh";
  l.style.setProperty("--x", Math.random() * 120 - 60 + "px");
  l.style.setProperty("--y", Math.random() * 120 - 60 + "px");
  l.style.animationDuration = 4 + Math.random() * 5 + "s";
  l.style.animationDelay = -Math.random() * 6 + "s";
  $("luciernagas").appendChild(l);
}

// ---------- Pétalos de la flor ----------
function crearCapa(contenedor, cantidad, largo, ancho, giroExtra, gradiente, retrasoBase) {
  for (let i = 0; i < cantidad; i++) {
    const giro = document.createElementNS(SVG, "g");
    giro.setAttribute("transform", `rotate(${(360 / cantidad) * i + giroExtra} 150 190)`);

    const petalo = document.createElementNS(SVG, "ellipse");
    petalo.setAttribute("class", "petalo");
    petalo.setAttribute("cx", 150);
    petalo.setAttribute("cy", 190 - largo);
    petalo.setAttribute("rx", ancho);
    petalo.setAttribute("ry", largo);
    petalo.setAttribute("fill", `url(#${gradiente})`);
    petalo.style.animationDelay = retrasoBase + i * 0.12 + "s";

    giro.appendChild(petalo);
    contenedor.appendChild(giro);
  }
}
crearCapa($("capaExterior"), 14, 52, 17, 0, "gradPetalo", 1.9);
crearCapa($("capaInterior"), 14, 38, 13, 12.8, "gradPetalo2", 2.6);

// Semillas del centro (patrón de girasol)
for (let i = 0; i < 70; i++) {
  const ang = i * 137.5 * (Math.PI / 180);
  const r = 2.9 * Math.sqrt(i);
  const s = document.createElementNS(SVG, "circle");
  s.setAttribute("cx", 150 + r * Math.cos(ang));
  s.setAttribute("cy", 190 + r * Math.sin(ang));
  s.setAttribute("r", 1.4);
  s.setAttribute("fill", "#E9B872");
  s.setAttribute("opacity", ".75");
  $("semillas").appendChild(s);
}

// ---------- Nombre ----------
if (CONFIG.nombre) $("nombreInicio").textContent = CONFIG.nombre;

// ---------- Escribir texto letra por letra ----------
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

async function escribir(elemento, texto, velocidad = 45) {
  elemento.classList.add("cursor");
  for (const letra of Array.from(texto)) {
    elemento.textContent += letra;
    await esperar(letra === "," || letra === "." || letra === "…" ? velocidad * 6 : velocidad);
  }
  elemento.classList.remove("cursor");
}

// ---------- Pétalos cayendo al final ----------
function lluviaDePetalos() {
  const cantidad = window.innerWidth < 800 ? 14 : 26;
  for (let i = 0; i < cantidad; i++) {
    const p = document.createElement("span");
    p.className = "petalo-cae";
    p.style.left = Math.random() * 100 + "vw";
    p.style.animationDuration = 7 + Math.random() * 8 + "s";
    p.style.animationDelay = Math.random() * 6 + "s";
    p.style.transform = `scale(${0.6 + Math.random() * 0.7})`;
    $("petalos").appendChild(p);
  }
}

// ---------- Secuencia principal ----------
async function empezar() {
  $("inicio").classList.add("oculto");
  $("escena").classList.add("visible");

  const flor = document.querySelector(".flor");
  await esperar(500);
  flor.classList.add("armar");

  // Tiempo que tarda la flor en armarse
  await esperar(4800);
  flor.classList.add("meciendo");

  const titulo = CONFIG.nombre
    ? `Para ti, ${CONFIG.nombre} 💛`
    : "Para mi mejor amiga 💛";
  await escribir($("titulo"), titulo, 70);
  await esperar(600);

  for (const m of MENSAJES) {
    const texto = typeof m === "string" ? m : m.texto;
    const p = document.createElement("p");
    if (m.destacado) p.classList.add("destacado");
    $("mensajes").appendChild(p);
    p.scrollIntoView({ behavior: "smooth", block: "center" }); // en celular baja sola
    await escribir(p, texto);
    await esperar(900);
  }

  $("firma").textContent = CONFIG.firma;
  $("firma").classList.add("visible");
  $("firma").scrollIntoView({ behavior: "smooth", block: "center" });
  lluviaDePetalos();
}

$("btnAbrir").addEventListener("click", empezar, { once: true });
