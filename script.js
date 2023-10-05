document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const movieList = document.getElementById("movieList");

    // Lista de películas (se inicializa vacía)
    let movies = [];

    // Cargar la lista de películas al inicio
    fetch("https://japceibal.github.io/japflix_api/movies-data.json")
        .then(response => response.json())
        .then(data => {
            movies = data; // Almacenar todas las películas en la variable "movies"
        });

    // Función para convertir el rating en formato de "estrellas"
    function getStars (voteAverage) {
        const rating = parseFloat(voteAverage);
        const maxRating = 10;
        const starPercentage = (rating / maxRating) * 100;
        const stars = Math.round((starPercentage / 100) * 5); // Escala de 1 a 5
        let starsHTML = '';

        for (let i = 0; i < 5; i++) {
            if (i < stars) {
                starsHTML += '★'; // Estrella llena
            } else {
                starsHTML += '☆'; // Estrella vacía
            }
        }

        return starsHTML;
    }

    function displayMovieDetails (movie) {
        const modalTitle = document.getElementById("movieOffcanvasLabel");
        const modalContent = document.getElementById("modalContent");

        modalTitle.textContent = movie.title;

        modalContent.innerHTML = `
        <p>Título: ${movie.title}</p>
        <p>Descripción General: ${movie.overview}</p>
        <p>Géneros: ${movie.genres.map(genre => genre.name).join(", ")}</p>
    `;

        const movieOffcanvas = new bootstrap.Offcanvas(document.getElementById("movieOffcanvas"));
        movieOffcanvas.show();
    }
    document.addEventListener("click", function (event) {
        if (event.target.matches(".btn[data-bs-movie-id]")) {
            const movieId = event.target.getAttribute("data-bs-movie-id");
            const movie = movies.find(movie => movie.id === movieId);
            if (movie) {
                displayMovieDetails(movie);
            }
        } else if (event.target === searchButton) {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(searchTerm));
            displayMovies(filteredMovies);
        }
    });




    // Manejar la búsqueda al hacer clic en el botón
    searchButton.addEventListener("click", function () {
        const searchTerm = searchInput.value.toLowerCase();

        // Filtrar las películas según el término de búsqueda
        const filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(searchTerm));

        // Mostrar las películas filtradas
        displayMovies(filteredMovies);
    });

    // Función para mostrar las películas en la lista
    function displayMovies (moviesToDisplay) {
        movieList.innerHTML = "";
        moviesToDisplay.forEach(movie => {
            const movieCard = document.createElement("li");
            movieCard.classList.add("list-group-item");
            const starsHTML = getStars(movie.vote_average);
            movieCard.innerHTML = `
                <h2>${movie.title}</h2>
                <p>Tagline: ${movie.tagline}</p>
                <p>Rating: ${starsHTML}</p>
                <button class="btn btn-primary" data-bs-toggle="offcanvas" data-bs-target="#movieOffcanvas"
                    data-bs-movie-id="${movie.id}">Ver detalles</button>
            `;
            movieList.appendChild(movieCard);
        });
    }

    // Manejar la apertura del Offcanvas al hacer clic en el botón "Ver detalles"
    movieList.addEventListener("click", function (event) {
        if (event.target && event.target.matches(".btn[data-bs-toggle='offcanvas']")) {
            const movieId = event.target.getAttribute("data-bs-movie-id");
            const movie = movies.find(movie => movie.id === movieId);
            if (movie) {
                displayMovieDetails(movie);
            }
        }
    });

    // Cerrar el Offcanvas al hacer clic en el botón de cerrar
    const closeModalButton = document.getElementById("closeModalButton");
    closeModalButton.addEventListener("click", () => {
        const movieOffcanvas = new bootstrap.Offcanvas(document.getElementById("movieOffcanvas"));
        movieOffcanvas.hide();
    });
});
