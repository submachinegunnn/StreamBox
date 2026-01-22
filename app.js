/* ===============================
   CONFIG
================================ */

const TMDB_KEY =
  import.meta?.env?.VITE_TMDB_KEY || "YOUR_TMDB_KEY";

const TMDB = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p/w500";

/* ===============================
   ELEMENTS
================================ */

const moviesRail = document.getElementById("movies");
const tvRail = document.getElementById("tv");
const continueRail = document.getElementById("continue");
const searchInput = document.getElementById("search");

/* ===============================
   FETCH HELPERS
================================ */

async function fetchTMDB(path) {
  const res = await fetch(`${TMDB}${path}?api_key=${TMDB_KEY}`);
  return res.json();
}

/* ===============================
   RENDER CARD
================================ */

function renderCard(item, type, container) {
  if (!item.poster_path) return;

  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <img src="${IMG}${item.poster_path}" />
    <span>${item.title || item.name}</span>
  `;

  card.onclick = () => {
    localStorage.setItem(
      "selected",
      JSON.stringify({
        id: item.id,
        type,
        title: item.title || item.name
      })
    );
    window.location.href = "/player.html";
  };

  container.appendChild(card);
}

/* ===============================
   LOAD HOMEPAGE
================================ */

async function loadHome() {
  const movies = await fetchTMDB("/movie/popular");
  const tv = await fetchTMDB("/tv/popular");

  movies.results.forEach(m =>
    renderCard(m, "movie", moviesRail)
  );
  tv.results.forEach(t =>
    renderCard(t, "tv", tvRail)
  );

  loadContinueWatching();
}

/* ===============================
   SEARCH (REAL TMDB)
================================ */

let debounce;
searchInput?.addEventListener("input", e => {
  clearTimeout(debounce);
  const query = e.target.value.trim();

  debounce = setTimeout(() => {
    if (!query) {
      moviesRail.innerHTML = "";
      tvRail.innerHTML = "";
      loadHome();
      return;
    }
    searchTMDB(query);
  }, 400);
});

async function searchTMDB(query) {
  moviesRail.innerHTML = "";
  tvRail.innerHTML = "";

  const [movies, tv] = await Promise.all([
    fetchTMDB(`/search/movie&query=${query}`),
    fetchTMDB(`/search/tv&query=${query}`)
  ]);

  movies.results.forEach(m =>
    renderCard(m, "movie", moviesRail)
  );
  tv.results.forEach(t =>
    renderCard(t, "tv", tvRail)
  );
}

/* ===============================
   CONTINUE WATCHING
================================ */

function loadContinueWatching() {
  const saved = JSON.parse(
    localStorage.getItem("continue") || "[]"
  );

  continueRail.innerHTML = "";

  saved.forEach(item => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${IMG}${item.poster}" />
      <span>${item.title}</span>
    `;

    div.onclick = () => {
      localStorage.setItem(
        "selected",
        JSON.stringify(item)
      );
      window.location.href = "/player.html";
    };

    continueRail.appendChild(div);
  });
}

/* ===============================
   PLAYER PAGE
================================ */

function loadPlayer() {
  const data = JSON.parse(localStorage.getItem("selected"));
  if (!data) return;

  document.getElementById("title").innerText = data.title;

  let url =
    data.type === "movie"
      ? `https://www.vidking.net/embed/movie/${data.id}`
      : `https://www.vidking.net/embed/tv/${data.id}/1/1?episodeSelector=true&nextEpisode=true`;

  document.getElementById("player").innerHTML = `
    <iframe
      src="${url}&autoPlay=true&color=e50914"
      width="100%"
      height="600"
      frameborder="0"
      allowfullscreen>
    </iframe>
  `;

  trackProgress(data);
}

/* ===============================
   VIDKING PROGRESS TRACKING
================================ */

function trackProgress(item) {
  window.addEventListener("message", e => {
    if (typeof e.data !== "string") return;

    try {
      const msg = JSON.parse(e.data);
      if (msg.type !== "PLAYER_EVENT") return;

      const saved =
        JSON.parse(localStorage.getItem("continue")) || [];

      const exists = saved.find(s => s.id === item.id);
      if (!exists) {
        saved.unshift({
          ...item,
          poster: item.poster_path,
          progress: msg.data.progress
        });
      }

      localStorage.setItem(
        "continue",
        JSON.stringify(saved.slice(0, 10))
      );
    } catch {}
  });
}

/* ===============================
   INIT
================================ */

if (document.getElementById("movies")) loadHome();
if (document.getElementById("player")) loadPlayer();
