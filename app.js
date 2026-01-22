async function loadMovies() {
  const res = await fetch('/api/tmdb?path=/movie/popular');
  const data = await res.json();

  movies.innerHTML = data.results.map(m => `
    <div>
      <img src="https://image.tmdb.org/t/p/w300${m.poster_path}">
      <h3>${m.title}</h3>
    </div>
  `).join('');
}

loadMovies();
