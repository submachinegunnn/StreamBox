const moviesEl = document.getElementById('movies');

async function loadMovies() {
  const res = await fetch('/api/tmdb?path=/movie/popular');
  const data = await res.json();

  moviesEl.innerHTML = data.results.map(movie => `
    <div class="movie" onclick="openMovie(${movie.id})">
      <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}">
      <h3>${movie.title}</h3>
    </div>
  `).join('');
}

function openMovie(id) {
  window.location.href = `/watch.html?id=${id}`;
}

loadMovies();
