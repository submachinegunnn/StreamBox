const rails = {
  continue: document.getElementById("continue"),
  trending: document.getElementById("trending"),
  movies: document.getElementById("movies"),
  tv: document.getElementById("tv"),
};

const searchInput = document.getElementById("search");

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query.length > 0) {
      runSearch(query);
    }
  }
});

async function tmdb(path, query = "") {
  const res = await fetch(`/api/tmdb?path=${path}&query=${query}`);
  return res.json();
}

function createCard(item) {
  const div = document.createElement("div");
  div.className = "card";

  div.innerHTML = `
    <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" />
    <span>${item.title || item.name}</span>
  `;

  div.onclick = () => {
    window.location.href = `/player.html?id=${item.id}&type=${item.media_type || (item.title ? "movie" : "tv")}`;
  };

  return div;
}

async function loadHome() {
  const trending = await tmdb("trending/all/week");
  trending.results.forEach(i => rails.trending.appendChild(createCard(i)));

  const movies = await tmdb("movie/popular");
  movies.results.forEach(i => rails.movies.appendChild(createCard(i)));

  const tv = await tmdb("tv/popular");
  tv.results.forEach(i => rails.tv.appendChild(createCard(i)));
}

loadHome();

