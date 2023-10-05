document.addEventListener("DOMContentLoaded", function () {
    const inputBusqueda = document.getElementById("searchInput");
    const botonBusqueda = document.getElementById("searchButton");
    const listaPeliculas = document.getElementById("listaPeliculas");

    // Lista de películas (se inicializa vacía)
    let peliculas = [];

    // Cargar la lista de películas al inicio
    fetch("https://japceibal.github.io/japflix_api/movies-data.json")
        .then(response => response.json())
        .then(data => {
            peliculas = data; // Almacenar todas las películas en la variable "peliculas"
        });

    // Función para convertir el rating en formato de "estrellas"
    function obtenerEstrellas (calificacion) {
        const puntaje = parseFloat(calificacion);
        const puntajeMaximo = 10;
        const porcentajeEstrellas = (puntaje / puntajeMaximo) * 100;
        const estrellasLlenas = Math.round((porcentajeEstrellas / 100) * 5);
        return '★'.repeat(estrellasLlenas) + '☆'.repeat(5 - estrellasLlenas);
    }

    function mostrarPeliculas (peliculasAMostrar) {
        listaPeliculas.innerHTML = "";
        peliculasAMostrar.forEach(pelicula => {
            const estrellasHTML = obtenerEstrellas(pelicula.vote_average);
            const tarjetaPelicula = document.createElement('li');
            tarjetaPelicula.classList.add('list-group-item');
            tarjetaPelicula.dataset.bsToggle = 'offcanvas';
            tarjetaPelicula.dataset.bsTarget = '#detallePelicula';
            tarjetaPelicula.dataset.bsIdPelicula = pelicula.id;

            tarjetaPelicula.innerHTML = `
                <div class="row">
                    <div class="col-md-9">
                        <h2>${pelicula.title}</h2>
                        <p> ${pelicula.tagline}</p>
                    </div>
                    <div class="col-md-3 text-end">
                        <p> <span class="estrellas">${estrellasHTML}</span></p>
                    </div>
                </div>
            `;

            listaPeliculas.appendChild(tarjetaPelicula);
        });

        // Agregar un evento clic a las tarjetas de película para mostrar los detalles
        const tarjetasPelicula = listaPeliculas.querySelectorAll(".list-group-item");
        tarjetasPelicula.forEach(tarjeta => {
            tarjeta.addEventListener("click", function () {
                // Obtener el ID de la película desde el atributo data-bs-id-pelicula
                const idPelicula = tarjeta.dataset.bsIdPelicula;
                const pelicula = peliculas.find(pelicula => pelicula.id.toString() === idPelicula);
                if (pelicula) {
                    mostrarDetallesPelicula(pelicula);
                }
            });
        });
    }


    function mostrarDetallesPelicula (pelicula) {
        const tituloModal = document.getElementById("detallePeliculaLabel");
        const contenidoModal = document.getElementById("contenidoDetalle");

        tituloModal.textContent = pelicula.title;

        contenidoModal.innerHTML = `
            <p>${pelicula.overview}</p>
            <hr class="my-4">
            <p>Géneros: ${pelicula.genres.map(genero => genero.name).join(" - ")}</p>
        `;

        // Crear una columna para la información adicional
        const columnaInfoAdicional = document.createElement("div");
        columnaInfoAdicional.classList.add("col-md-6");

        // Crear el botón con desplegable
        const botonInfoAdicional = document.createElement("button");
        botonInfoAdicional.classList.add("btn", "btn-secondary", "dropdown-top-right", "mb-3");
        botonInfoAdicional.type = "button";
        botonInfoAdicional.setAttribute("data-bs-toggle", "dropdown");
        botonInfoAdicional.textContent = "Información Adicional";

        // Crear el menú desplegable
        const menuDesplegable = document.createElement("ul");
        menuDesplegable.classList.add("dropdown-menu");
        menuDesplegable.setAttribute("aria-labelledby", "botonInfoAdicional");

        // Información adicional
        const infoAdicional = [
            { etiqueta: "Año de Lanzamiento", valor: pelicula.release_date.split("-")[0] },
            { etiqueta: "Duración", valor: `${pelicula.runtime} minutos` },
            { etiqueta: "Presupuesto", valor: `$${pelicula.budget}` },
            { etiqueta: "Ganancias", valor: `$${pelicula.revenue}` }
        ];

        // Agregar elementos al menú desplegable
        infoAdicional.forEach(item => {
            const elementoLista = document.createElement("li");
            elementoLista.textContent = `${item.etiqueta}: ${item.valor}`;
            menuDesplegable.appendChild(elementoLista);
        });

        // Agregar botón y menú desplegable a la columna de información adicional
        columnaInfoAdicional.appendChild(botonInfoAdicional);
        columnaInfoAdicional.appendChild(menuDesplegable);

        // Crear una fila y agregar las columnas al contenido del offcanvas
        const fila = document.createElement("div");
        fila.classList.add("row");
        fila.appendChild(contenidoModal.cloneNode(true)); // Copiar el contenido original
        fila.appendChild(columnaInfoAdicional);

        contenidoModal.innerHTML = "";
        contenidoModal.appendChild(fila);

        const detallePelicula = new bootstrap.Offcanvas(document.getElementById("detallePelicula"));
        detallePelicula.show();
    }

    // Agrega un evento clic al botón "Ver detalles"
    listaPeliculas.addEventListener("click", function (event) {
        if (event.target.matches(".btn[data-bs-id-pelicula]")) {
            const idPelicula = event.target.getAttribute("data-bs-id-pelicula");
            const pelicula = peliculas.find(pelicula => pelicula.id.toString() === idPelicula);
            if (pelicula) {
                mostrarDetallesPelicula(pelicula);
            }
        }
    });

    // Manejar la búsqueda al hacer clic en el botón
    botonBusqueda.addEventListener("click", function () {
        const terminoBusqueda = inputBusqueda.value.toLowerCase();

        // Filtrar las películas según el término de búsqueda
        const peliculasFiltradas = peliculas.filter(pelicula => pelicula.title.toLowerCase().includes(terminoBusqueda));

        // Mostrar las películas filtradas
        mostrarPeliculas(peliculasFiltradas);
    });

    // Cerrar el Offcanvas al hacer clic en el botón de cerrar
    const botonCerrarDetalle = document.getElementById("cerrarDetalleButton");
    botonCerrarDetalle.addEventListener("click", () => {
        const detallePelicula = new bootstrap.Offcanvas(document.getElementById("detallePelicula"));
        detallePelicula.hide();
    });
});
