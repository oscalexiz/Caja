/* pelicula.js · rellena la plantilla pelicula.html según ?id=...
   ---------------------------------------------------------
   Reemplaza cargarPelicula(id) por una llamada a tu API, por ejemplo:

   async function cargarPelicula(id) {
       const res = await fetch(`/api/peliculas/${encodeURIComponent(id)}`);
       if (!res.ok) return null;
       return res.json();
       // La respuesta debería incluir también "resenas" y "similares",
       // ya resueltas por tu backend con SQL (AVG, COUNT, JOIN, etc.)
   }
*/
(function () {
    const $ = (sel) => document.querySelector(sel);
    const id = new URLSearchParams(location.search).get("id");

    /* TEMPORAL: mientras no tengas la API, deja esto como null */
    async function cargarPelicula(id) {
        return null;
    }

    function mostrarNoEncontrada() {
        $("#pelicula").innerHTML = `
            <div class="empty" style="grid-column:1/-1">
                <h1>No encontramos esa película</h1>
                <p style="margin:12px 0 24px">Puede que el enlace esté mal escrito o que la película ya no esté en el catálogo.</p>
                <a class="btn btn-primary" href="index.html#catalogo">Volver al catálogo</a>
            </div>`;
    }

    function pintar(p) {
        document.title = `${p.titulo} (${p.anio}) · LaCaja`;

        const poster = $("#p-poster");
        poster.style.setProperty("--h", p.hue);
        poster.innerHTML = posterHTML(p);

        $("#p-titulo").textContent = p.titulo;
        $("#p-director").textContent = p.director;
        $("#p-anio").textContent = p.anio;
        $("#p-duracion").textContent = `${p.duracion} min`;
        $("#p-pais").textContent = p.pais;
        $("#p-generos").innerHTML = p.generos.map((g) => `<li>${esc(g)}</li>`).join("");
        $("#p-sinopsis").textContent = p.sinopsis;
        $("#p-reparto").innerHTML = p.reparto.map((a) => `<li>${esc(a)}</li>`).join("");

        /* Valoración */
        $("#p-nota").textContent = p.nota.toFixed(1);
        $("#p-stars").style.setProperty("--p", `${(p.nota / 5) * 100}%`);
        $("#p-votos").textContent = `${p.votos.toLocaleString("es-MX")} valoraciones`;

        /* Distribución de estrellas: p.distribucion = {5:.., 4:.., 3:.., 2:.., 1:..}
           Tu backend la calcula con SQL, por ejemplo:
           SELECT nota, COUNT(*) FROM resenas WHERE pelicula_id=? GROUP BY nota */
        const dist = p.distribucion || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        $("#p-histograma").innerHTML = [5, 4, 3, 2, 1].map((s) => `
            <div class="hist-row"><span>${s}★</span><div class="hist-bar"><i style="width:${dist[s] || 0}%"></i></div><span>${dist[s] || 0}%</span></div>
        `).join("");

        /* Ficha técnica */
        const ficha = [
            ["Director", p.director],
            ["Año", p.anio],
            ["Duración", `${p.duracion} minutos`],
            ["País", p.pais],
            ["Idioma original", p.idioma]
        ];
        $("#p-ficha").innerHTML = ficha.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join("");

        /* Botones Vista / Me gusta / Ver después.
           Aquí deberías pedir el estado real al servidor (si el usuario
           inició sesión) y, al hacer click, enviarlo con fetch + POST. */
        document.querySelectorAll(".action-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                const activo = btn.getAttribute("aria-pressed") === "true";
                btn.setAttribute("aria-pressed", !activo);
                // TODO: fetch(`/api/peliculas/${p.id}/acciones/${btn.dataset.accion}`, { method: activo ? "DELETE" : "PUT" })
            });
        });

        /* Reseñas: p.resenas = [{ usuario, nota, fecha, texto }, ...] */
        const listaResenas = $("#p-resenas");
        function pintarResenas(resenas) {
            listaResenas.innerHTML = resenas.length
                ? resenas.map(resenaHTML).join("")
                : `<p class="empty">Todavía no hay reseñas. Sé la primera persona en escribir una.</p>`;
            $("#p-num-resenas").textContent = `(${resenas.length})`;
        }
        pintarResenas(p.resenas || []);

        $("#form-resena").addEventListener("submit", async (e) => {
            e.preventDefault();
            const form = e.target;
            const texto = form.texto.value.trim();
            const marcada = form.querySelector('input[name="rating"]:checked');
            if (!texto) return;

            // TODO: enviar a tu API y usar la respuesta en vez de este objeto local
            // await fetch(`/api/peliculas/${p.id}/resenas`, {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ texto, nota: marcada ? Number(marcada.value) : null })
            // });

            form.reset();
        });

        /* Similares: tu backend las elige (por géneros en común, por ejemplo) */
        $("#p-similares").innerHTML = (p.similares || []).map(tarjetaHTML).join("")
            || `<p class="empty">Aún no hay recomendaciones para esta película.</p>`;
    }

    (async function iniciar() {
        if (!id) { mostrarNoEncontrada(); return; }
        const p = await cargarPelicula(id);
        if (!p) { mostrarNoEncontrada(); return; }
        pintar(p);
    })();
})();
