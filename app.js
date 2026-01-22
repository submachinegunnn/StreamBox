const API_KEY = window.TMDB_API_KEY;
const BASE = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p/w500";

const searchInput = document.getElementById("search");
const searchResults = document.getElementById("search-results");

const hero = document.getElementById("hero");
const continueRail = document.getElementById("continue");
const trendingRail = document.getElementById("trending");
const moviesRail = document.getElementById("movies");
const tvRail = document.getElementById("tv");

/* ---------------- FETCH ---------------- */

async function tmdb(url) {
  const res = await fetch(`${BASE}${url}?api_key=${API_KEY}`);
  return res.json();
}

/* ---------------- CARD ---------------- */

function card(item) {
  const el = document.createElement("div");
  el.className = "card";

  const img = document.createElement("img");
  img.src = item.poster_path
    ? IMG + item.poster_path
    : "https://via.placeholder.com/300x450";

  el.appendChild(img);
  return el;
}

/* ---------------- HERO ---------------- */

async function loadHero() {
  const data = await tmdb("/trending/all/week");
  const item = data.results[0];

  hero.style.backgroundImage = `
    linear-gradient(to top, rgba(0,0,0,.85), transparent),
    url(${IMG}${item.backdrop_path})
  `;

  hero.innerHTML = `
    <div class="hero-content">
      <h1>${item.title || item.name}</h1>
      <p>${item.overview}</p>
      <button>▶ Play</button>
    </div>
  `;
}

/* ---------------- RAILS ---------------- */

async function loadTrending() {
  const data = await tmdb("/trending/all/week");
  trendingRail.innerHTML = "";
  data.results.forEach(i => trendingRail.appendChild(card(i)));
}

async function loadMovies() {
  const data = await tmdb("/movie/popular");
  moviesRail.innerHTML = "";
  data.results.forEach(i => moviesRail.appendChild(card(i)));
}

async function loadTV() {
  const data = await tmdb("/tv/popular");
  tvRail.innerHTML = "";
  data.results.forEach(i => tvRail.appendChild(card(i)));
}

/* ---------------- SEARCH ---------------- */

searchInput.addEventListener("keydown", async e => {
  if (e.key !== "Enter") return;

  const q = searchInput.value.trim();
  if (!q) return;

  const data = await tmdb(`/search/multi&query=${encodeURIComponent(q)}`);
  searchResults.innerHTML = "";
  searchResults.style.display = "block";

  data.results
    .filter(i => i.poster_path)
    .slice(0, 8)
    .forEach(i => {
      const row = document.createElement("div");
      row.className = "search-item";
      row.innerHTML = `
        <img src="${IMG}${i.poster_path}">
        <div>${i.title || i.name}</div>
      `;
      searchResults.appendChild(row);
    });
});

/* ---------------- INIT ---------------- */

loadHero();
loadTrending();
loadMovies();
loadTV();
