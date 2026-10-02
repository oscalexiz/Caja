/* catalogo.js · filtros, orden y búsqueda del catálogo (index.html)
   ---------------------------------------------------------
   Reemplaza la función cargarPeliculas() por una llamada a tu API,
   por ejemplo:

   async function cargarPeliculas() {
       const res = await fetch("/api/peliculas");
       return res.json();
   }

   El resto del archivo no necesita cambios: ya está escrito para
   trabajar con el arreglo que esta función devuelva.
*/
(function () {
    const grid = document.getElementById("catalogo-grid");
    const filtros = document.getElementById("filtros");
    const orden = document.getElementById("orden");
    const contador = document.getElementById("contador");
    const buscador = document.querySelector(".nav-search input");
    const formBusqueda = document.querySelector(".nav-search");

    const params = new URLSearchParams(location.search);
    let generoActivo = "Todas";
    let texto = (params.get("q") || "").trim().toLowerCase();
    let PELICULAS = [];

    if (buscador && params.get("q")) buscador.value = params.get("q");

    /* TEMPORAL: mientras no tengas la API, deja esto vacío */
    async function cargarPeliculas() {
        return [];
    }

    const ordenar = {
        nota: (a, b) => b.nota - a.nota,
        reciente: (a, b) => b.anio - a.anio,
        titulo: (a, b) => a.titulo.localeCompare(b.titulo, "es")
    };

    function pintarFiltros() {
        const generos = ["Todas", ...[...new Set(PELICULAS.flatMap((p) => p.generos))]
            .sort((a, b) => a.localeCompare(b, "es"))];

        filtros.innerHTML = generos
            .map((g) => `<button type="button" class="chip" aria-pressed="${g === generoActivo}" data-genero="${esc(g)}">${esc(g)}</button>`)
            .join("");
    }

    function render() {
        const lista = PELICULAS
            .filter((p) => generoActivo === "Todas" || p.generos.includes(generoActivo))
            .filter((p) => !texto || p.titulo.toLowerCase().includes(texto) || p.director.toLowerCase().includes(texto))
            .sort(ordenar[orden.value]);

        grid.innerHTML = lista.length
            ? lista.map(tarjetaHTML).join("")
            : `<p class="empty">No encontramos películas con esos filtros. Prueba con otro género o borra la búsqueda.</p>`;

        contador.textContent = `${lista.length} ${lista.length === 1 ? "película" : "películas"}`;
    }

    filtros.addEventListener("click", (e) => {
        const chip = e.target.closest(".chip");
        if (!chip) return;
        generoActivo = chip.dataset.genero;
        filtros.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", c === chip));
        render();
    });

    orden.addEventListener("change", render);

    if (buscador) {
        buscador.addEventListener("input", () => {
            texto = buscador.value.trim().toLowerCase();
            render();
        });
        formBusqueda.addEventListener("submit", (e) => {
            e.preventDefault();
            document.getElementById("catalogo").scrollIntoView();
        });
    }

    (async function iniciar() {
        PELICULAS = await cargarPeliculas();
        pintarFiltros();
        render();
    })();
})();
