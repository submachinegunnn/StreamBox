const IMG = "https://image.tmdb.org/t/p/w500";

/* ===========================
   HELPERS
=========================== */

async function tmdb(endpoint) {
  const res = await fetch(`/api/tmdb?endpoint=${endpoint}`);
  return res.json();
}

function createCard(item) {
  if (!item.poster_path) return null;

  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <img src="${IMG + item.poster_path}" loading="lazy" />
  `;

  card.onclick = () => {
    const type = item.media_type || (item.title ? "movie" : "tv");
    window.location.href = `player.html?id=${item.id}&type=${type}`;
  };

  return card;
}

/* ===========================
   HERO
=========================== */

async function loadHero() {
  const data = await tmdb("/trending/movie/week");
  const movie = data.results[0];

  const hero = document.getElementById("hero");
  hero.style.backgroundImage =
    `linear-gradient(to top, #000 10%, transparent 60%), 
     url(${IMG + movie.backdrop_path})`;

  hero.innerHTML = `
    <div class="hero-content">
      <h1>${movie.title}</h1>
      <p>${movie.overview}</p>
      <button onclick="playHero(${movie.id})">▶ Play</button>
    </div>
  `;
}

window.playHero = id => {
  window.location.href = `player.html?id=${id}&type=movie`;
};

/* ===========================
   RAILS
=========================== */

async function loadRail(endpoint, containerId) {
  const data = await tmdb(endpoint);
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  data.results.forEach(item => {
    const card = createCard(item);
    if (card) container.appendChild(card);
  });
}

/* ===========================
   SEARCH (AUTOCOMPLETE)
=========================== */

const searchInput = document.getElementById("search");
const resultsBox = document.getElementById("search-results");

let searchTimeout;

searchInput.addEventListener("input", () => {
  clearTimeout(searchTimeout);

  const q = searchInput.value.trim();
  if (!q) {
    resultsBox.innerHTML = "";
    resultsBox.style.display = "none";
    return;
  }

  searchTimeout = setTimeout(() => runSearch(q), 300);
});

async function runSearch(query) {
  const data = await tmdb(`/search/multi?query=${encodeURIComponent(query)}`);
  resultsBox.innerHTML = "";
  resultsBox.style.display = "block";

  data.results.slice(0, 8).forEach(item => {
    if (!item.poster_path) return;

    const row = document.createElement("div");
    row.className = "search-item";

    row.innerHTML = `
      <img src="${IMG + item.poster_path}" />
      <span>${item.title || item.name}</span>
    `;

    row.onclick = () => {
      const type = item.media_type === "tv" ? "tv" : "movie";
      window.location.href = `player.html?id=${item.id}&type=${type}`;
    };

    resultsBox.appendChild(row);
  });
}

/* ===========================
   INIT
=========================== */

loadHero();
loadRail("/trending/all/week", "trending");
loadRail("/movie/popular", "movies");
loadRail("/tv/popular", "tv");
