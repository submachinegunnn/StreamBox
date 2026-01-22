document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ App loaded");

  const TOKEN = window.TMDB_TOKEN;
  const BASE = "https://api.themoviedb.org/3";
  const IMG = "https://image.tmdb.org/t/p/w500";

  /* ---------------- DOM ---------------- */
  const searchInput = document.getElementById("search");
  const continueRail = document.getElementById("continue");
  const trendingRail = document.getElementById("trending");
  const moviesRail = document.getElementById("movies");
  const tvRail = document.getElementById("tv");

  /* ---------------- API ---------------- */
  async function tmdb(endpoint) {
    const res = await fetch(`${BASE}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error("TMDB error", res.status);
      return { results: [] };
    }

    return res.json();
  }

  /* ---------------- UI ---------------- */
  function card(item) {
    const el = document.createElement("div");
    el.className = "card";

    el.innerHTML = `
      <img src="${IMG}${item.poster_path}" alt="">
    `;

    el.onclick = () => {
      const type = item.media_type || (item.title ? "movie" : "tv");
      window.location.href = `player.html?id=${item.id}&type=${type}`;
    };

    return el;
  }

  function render(list, rail) {
    rail.innerHTML = "";
    list
      .filter(i => i.poster_path)
      .forEach(i => rail.appendChild(card(i)));
  }

  /* ---------------- LOAD CONTENT ---------------- */
  async function loadHome() {
    const trending = await tmdb("/trending/all/week");
    render(trending.results, trendingRail);

    const movies = await tmdb("/movie/popular");
    render(movies.results, moviesRail);

    const tv = await tmdb("/tv/popular");
    render(tv.results, tvRail);

    console.log("✅ Rails rendered");
  }

  /* ---------------- SEARCH ---------------- */
  searchInput.addEventListener("keydown", async (e) => {
    if (e.key !== "Enter") return;

    const q = searchInput.value.trim();
    if (!q) return;

    const data = await tmdb(`/search/multi?query=${encodeURIComponent(q)}`);

    trendingRail.innerHTML = "";
    moviesRail.innerHTML = "";
    tvRail.innerHTML = "";

    render(data.results, trendingRail);
  });

  /* ---------------- CONTINUE WATCHING ---------------- */
  function loadContinue() {
    const list = JSON.parse(localStorage.getItem("continue") || "[]");
    render(list, continueRail);
  }

  loadContinue();
  loadHome();
});
