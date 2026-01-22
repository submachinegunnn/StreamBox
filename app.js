document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM loaded");

  const TMDB_TOKEN = window.TMDB_API_KEY;
  const BASE = "https://api.themoviedb.org/3";
  const IMG = "https://image.tmdb.org/t/p/w500";

  const trendingRail = document.getElementById("trending");
  const moviesRail = document.getElementById("movies");
  const tvRail = document.getElementById("tv");
  const continueRail = document.getElementById("continue");

  const searchInput = document.getElementById("search");

  const playerOverlay = document.getElementById("player-overlay");
  const playerFrame = document.getElementById("player-frame");
  const closePlayer = document.getElementById("close-player");

  /* ---------------- TMDB ---------------- */

  async function tmdb(endpoint) {
    const res = await fetch(`${BASE}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
        "Content-Type": "application/json"
      }
    });
    return res.json();
  }

  /* ---------------- PLAYER ---------------- */

  function openPlayer(item, type) {
    let url;

    if (type === "tv") {
      url = `https://www.vidking.net/embed/tv/${item.id}/1/1?autoPlay=true&episodeSelector=true&nextEpisode=true`;
    } else {
      url = `https://www.vidking.net/embed/movie/${item.id}?autoPlay=true`;
    }

    playerFrame.src = url;
    playerOverlay.hidden = false;

    saveContinueWatching(item, type);
  }

  closePlayer.onclick = () => {
    playerOverlay.hidden = true;
    playerFrame.src = "";
  };

  /* ---------------- CARDS ---------------- */

  function card(item, type) {
    const el = document.createElement("div");
    el.className = "card";

    el.innerHTML = `
      <img src="${IMG + item.poster_path}" alt="">
    `;

    el.onclick = () => openPlayer(item, type);
    return el;
  }

  /* ---------------- LOAD RAILS ---------------- */

  async function load() {
    const t = await tmdb("/trending/all/week");
    t.results
      .filter(i => i.poster_path)
      .forEach(i =>
        trendingRail.appendChild(card(i, i.media_type))
      );

    const m = await tmdb("/movie/popular");
    m.results
      .filter(i => i.poster_path)
      .forEach(i =>
        moviesRail.appendChild(card(i, "movie"))
      );

    const s = await tmdb("/tv/popular");
    s.results
      .filter(i => i.poster_path)
      .forEach(i =>
        tvRail.appendChild(card(i, "tv"))
      );

    console.log("✅ Cards rendered");
  }

  /* ---------------- CONTINUE WATCHING ---------------- */

  function saveContinueWatching(item, type) {
    const list = JSON.parse(localStorage.getItem("continue") || "[]");

    if (!list.find(i => i.id === item.id)) {
      list.unshift({ ...item, media_type: type });
      localStorage.setItem("continue", JSON.stringify(list.slice(0, 10)));
    }

    loadContinueWatching();
  }

  function loadContinueWatching() {
    const list = JSON.parse(localStorage.getItem("continue") || "[]");
    continueRail.innerHTML = "";
    list.forEach(i =>
      continueRail.appendChild(card(i, i.media_type))
    );
  }

  /* ---------------- SEARCH PAGE ---------------- */

  searchInput.addEventListener("keydown", async e => {
    if (e.key !== "Enter") return;

    const q = searchInput.value.trim();
    if (!q) return;

    const data = await tmdb(`/search/multi?query=${encodeURIComponent(q)}`);

    document.getElementById("search-page").hidden = false;
    trendingRail.parentElement.hidden = true;
    moviesRail.parentElement.hidden = true;
    tvRail.parentElement.hidden = true;

    const grid = document.getElementById("search-grid");
    grid.innerHTML = "";

    data.results
      .filter(i => i.poster_path)
      .forEach(i =>
        grid.appendChild(card(i, i.media_type))
      );
  });

  /* ---------------- INIT ---------------- */

  loadContinueWatching();
  load();
});
