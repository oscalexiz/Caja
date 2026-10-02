/* =========================================================
   app.js · funciones compartidas por todas las páginas
   ---------------------------------------------------------
   Este archivo YA NO tiene películas de ejemplo. Cuando
   conectes tu base de datos, catalogo.js y pelicula.js pedirán
   los datos a tu API (fetch) y usarán estas mismas funciones
   para pintarlos. La forma que debe tener cada película es:

   {
       id: "texto-sin-espacios",
       titulo: "Texto",
       anio: 2024,
       director: "Texto",
       duracion: 120,            // minutos
       pais: "Texto",
       idioma: "Texto",
       generos: ["Genero1", "Genero2"],
       reparto: ["Actor 1", "Actor 2"],
       sinopsis: "Texto",
       nota: 4.2,                 // 0 a 5, vendrá de AVG(resenas.nota)
       votos: 120,                // vendrá de COUNT(resenas.id)
       poster: "",                // ruta de imagen, o "" para el fondo de color
       hue: 12                    // 0-360, color del fondo cuando no hay poster
   }
   ========================================================= */

/* Evita que texto escrito por usuarios se interprete como HTML */
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
));

const urlPelicula = (p) => `pelicula.html?id=${encodeURIComponent(p.id)}`;

/* Contenido del póster: imagen real o, si no hay, fondo de color con el título */
const posterHTML = (p) => p.poster
    ? `<img src="${esc(p.poster)}" alt="Póster de ${esc(p.titulo)}" loading="lazy">`
    : `<div class="poster-fallback"><span class="pf-year">${p.anio}</span><span class="pf-title">${esc(p.titulo)}</span></div>`;

/* Tarjeta del catálogo */
const tarjetaHTML = (p) => `
    <a class="card" href="${urlPelicula(p)}">
        <div class="poster" style="--h:${p.hue}">
            ${posterHTML(p)}
            <span class="badge" aria-label="Nota ${p.nota.toFixed(1)} de 5">★ ${p.nota.toFixed(1)}</span>
        </div>
        <div class="card-info">
            <h3 class="card-title">${esc(p.titulo)}</h3>
            <p class="card-meta"><span>${p.anio}</span><span>${esc(p.generos[0] ?? "")}</span></p>
        </div>
    </a>`;

/* Reseña individual (sirve tanto con datos reales como de prueba) */
const resenaHTML = (r) => `
    <article class="review">
        <div class="avatar" aria-hidden="true">${esc(r.usuario.charAt(0))}</div>
        <div>
            <div class="review-top">
                <span class="review-user">${esc(r.usuario)}</span>
                <span class="stars" style="--p:${(r.nota / 5) * 100}%" role="img" aria-label="${r.nota} de 5 estrellas">★★★★★</span>
                <span class="review-date">${esc(r.fecha)}</span>
            </div>
            <p class="review-text">${esc(r.texto)}</p>
        </div>
    </article>`;

/* Menú desplegable en móvil */
(function () {
    const btn = document.querySelector(".nav-toggle");
    const menu = document.querySelector(".nav-menu");
    if (!btn || !menu) return;

    btn.addEventListener("click", () => {
        const abierto = menu.classList.toggle("open");
        btn.setAttribute("aria-expanded", abierto);
        btn.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    });
})();
