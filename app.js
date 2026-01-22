const API_KEY = import.meta?.env?.VITE_TMDB_KEY || window.TMDB_API_KEY;
const BASE = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p/w500";

const searchInput = document.getElementById("search");
const searchResults = document.getElementById("search-results");

const trendingRail = document.getElementById("trending");
const moviesRail = document.getElementById("movies");
const tvRail = document.getElementById("tv");
const continueRail = document.getElementById("continue");
const hero = document.getElementById("hero");

/* --------------------------
   FETCH HELPER
-------------------------- */

async function fetchTMDB(endpoint) {
  const res = await fetch(`${BASE}${endpoint}&api_key=${API_KEY}`);
  return res.json();
}

/* --------------------------
   CARD BUILDER
-------------------------- */

function createCard(item) {
  const card = document.createElement("div");
  card.className = "card";

  const img = document.createElement("img");
  img.src = item.poster_path
    ? IMG + item.poster_path
    : "https://via.placeholder.com/300x450?text=No+Image";

  img.alt = item.title || item.name;

  card.appendChild(img);

  card.onclick = () => {
    alert(`Clicked: ${item.title || item.name}`);
    // hook player here later
  };

  return card;
}

/* --------------------------
   LOAD RAILS
-------------------------- */

async function loadTrending() {
  const data = await fetchTMDB("/trending/all/week?");
  trendingRail.innerHTML = "";
  data.results.slice(0, 20).forEach(item => {
    trendingRail.appendChild(createCard(item));
  });

  // Hero
  const heroItem = data.results[0];
  hero.style.backgroundImage = `linear-gradient(to top, rgba(0,0,0,.85), transparent),
    url(${IMG}${heroItem.backdrop_path})`;

  hero.innerHTML = `
    <div class="hero-content">
      <h1>${heroItem.title || heroItem.name}</h1>
      <p>${heroItem.overview}</p>
      <button>▶ Play</button>
    </div>
  `;
}

async function loadMovies() {
  const data = await fetchTMDB("/movie/popular?");
  moviesRail.innerHTML = "";
  data.results.slice(0, 20).forEach(item => {
    moviesRail.appendChild(createCard(item));
  });
}

async function loadTV() {
  const data = await fetchTMDB("/tv/popular?");
  tvRail.innerHTML = "";
  data.results.slice(0, 20).forEach(item => {
    tvRail.appendChild(createCard(item));
  });
}

/* --------------------------
   CONTINUE WATCHING
-------------------------- */

function loadContinueWatching() {
  const saved = JSON.parse(localStorage.getItem("continueWatching") || "[]");
  continueRail.innerHTML = "";

  saved.forEach(item => {
    continueRail.appendChild(createCard(item));
  });
}

/* --------------------------
   SEARCH (ENTER WORKS)
-------------------------- */

let searchTimeout;

searchInput.addEventListener("input", () => {
  clearTimeout(searchTimeout);

  const q = searchInput.value.trim();
  if (!q) {
    searchResults.style.display = "none";
    searchResults.innerHTML = "";
    return;
  }

  searchTimeout = setTimeout(() => runSearch(q), 350);
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const q = searchInput.value.trim();
    if (q) runSearch(q, true);
  }
});

async function runSearch(query, forceOpen = false) {
  const data = await fetchTMDB(`/search/multi?query=${encodeURIComponent(query)}&`);

  searchResults.innerHTML = "";
  searchResults.style.display = "block";

  data.results
    .filter(i => i.poster_path)
    .slice(0, 8)
    .forEach(item => {
      const row = document.createElement("div");
      row.className = "search-item";

      row.innerHTML = `
        <img src="${IMG}${item.poster_path}">
        <div>
          <strong>${item.title || item.name}</strong>
          <small>${item.media_type.toUpperCase()}</small>
        </div>
      `;

      row.onclick = () => {
        alert(`Open ${item.title || item.name}`);
        searchResults.style.display = "none";
      };

      searchResults.appendChild(row);
    });

  if (forceOpen && data.results.length === 0) {
    searchResults.innerHTML = `<p style="padding:12px;color:#aaa;">No results</p>`;
  }
}

/* --------------------------
   INIT
-------------------------- */

loadTrending();
loadMovies();
loadTV();
loadContinueWatching();
