const moviesRail = document.getElementById("movies");
const tvRail = document.getElementById("tv");
const continueRail = document.getElementById("continue");
const searchInput = document.getElementById("search");

const IMG = "https://image.tmdb.org/t/p/w500";

/* -----------------------------
   FETCH HELPER (API PROXY)
----------------------------- */
async function tmdb(path) {
  const res = await fetch(`/api/tmdb?path=${encodeURIComponent(path)}`);
  return res.json();
}

/* -----------------------------
   CARD RENDER
----------------------------- */
function renderCard(item, type, container) {
  if (!item.poster_path) return;

  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <img src="${IMG}${item.poster_path}">
    <p>${item.title || item.name}</p>
  `;

  card.onclick = () => {
    window.location.href =
      type === "movie"
        ? `/watch.html?id=${item.id}`
        : `/tv.html?id=${item.id}`;
  };

  container.appendChild(card);
}

/* -----------------------------
   LOAD HOME
----------------------------- */
async function loadHome() {
  moviesRail.innerHTML = "";
  tvRail.innerHTML = "";

  const movies = await tmdb("/movie/popular");
  const tv = await tmdb("/tv/popular");

  movies.results.forEach(m =>
    renderCard(m, "movie", moviesRail)
  );

  tv.results.forEach(t =>
    renderCard(t, "tv", tvRail)
  );

  loadContinue();
}

/* -----------------------------
   SEARCH (REAL TMDB)
----------------------------- */
let debounce;
searchInput.addEventListener("input", e => {
  clearTimeout(debounce);
  const q = e.target.value.trim();

  debounce = setTimeout(() => {
    if (!q) return loadHome();
    search(q);
  }, 400);
});

async function search(query) {
  moviesRail.innerHTML = "";
  tvRail.innerHTML = "";

  const [movies, tv] = await Promise.all([
    tmdb(`/search/movie?query=${query}`),
    tmdb(`/search/tv?query=${query}`)
  ]);

  movies.results.forEach(m =>
    renderCard(m, "movie", moviesRail)
  );

  tv.results.forEach(t =>
    renderCard(t, "tv", tvRail)
  );
}

/* -----------------------------
   CONTINUE WATCHING
----------------------------- */
function loadContinue() {
  continueRail.innerHTML = "";

  Object.keys(localStorage)
    .filter(k => k.startsWith("progress-"))
    .slice(0, 10)
    .forEach(k => {
      const item = JSON.parse(localStorage.getItem(k));
      renderCard(item, item.type, continueRail);
    });
}

/* -----------------------------
   INIT
----------------------------- */
loadHome();
