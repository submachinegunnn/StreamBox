/* ==============================
   DOM
============================== */
const searchInput = document.getElementById("search");

const rails = {
  continue: document.getElementById("continue"),
  trending: document.getElementById("trending"),
  movies: document.getElementById("movies"),
  tv: document.getElementById("tv")
};

const IMG = "https://image.tmdb.org/t/p/w500";

/* ==============================
   TMDB FETCH (API PROXY)
============================== */
async function tmdb(path) {
  const res = await fetch(`/api/tmdb?path=${encodeURIComponent(path)}`);
  if (!res.ok) throw new Error("TMDB error");
  return res.json();
}

/* ==============================
   CARD RENDER
============================== */
function createCard(item, type, container) {
  if (!item.poster_path) return;

  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <img src="${IMG}${item.poster_path}" alt="${item.title || item.name}">
    <p>${item.title || item.name}</p>
  `;

  card.addEventListener("click", () => {
    window.location.href = `/watch.html?id=${item.id}&type=${type}`;
  });

  container.appendChild(card);
}

/* ==============================
   LOAD HOME CONTENT
============================== */
async function loadHome() {
  rails.trending.innerHTML = "";
  rails.movies.innerHTML = "";
  rails.tv.innerHTML = "";

  const [trending, movies, tv] = await Promise.all([
    tmdb("/trending/all/week"),
    tmdb("/movie/popular"),
    tmdb("/tv/popular")
  ]);

  trending.results.forEach(item => {
    if (item.media_type === "movie") {
      createCard(item, "movie", rails.trending);
    }
    if (item.media_type === "tv") {
      createCard(item, "tv", rails.trending);
    }
  });

  movies.results.forEach(item =>
    createCard(item, "movie", rails.movies)
  );

  tv.results.forEach(item =>
    createCard(item, "tv", rails.tv)
  );
}

/* ==============================
   SEARCH (MULTI)
============================== */
searchInput.addEventListener("input", async e => {
  const query = e.target.value.trim();

  if (!query) {
    loadHome();
    return;
  }

  rails.trending.innerHTML = "";
  rails.movies.innerHTML = "";
  rails.tv.innerHTML = "";

  const results = await tmdb(
    `/search/multi?query=${encodeURIComponent(query)}`
  );

  results.results.forEach(item => {
    if (!item.poster_path) return;

    if (item.media_type === "movie") {
      createCard(item, "movie", rails.movies);
    }

    if (item.media_type === "tv") {
      createCard(item, "tv", rails.tv);
    }
  });
});

/* ==============================
   INIT
============================== */
loadHome();
