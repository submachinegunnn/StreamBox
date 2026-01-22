document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ StreamBox loaded");

  /* =========================
     CONFIG
  ========================= */

  const TMDB_TOKEN = window.TMDB_API_KEY;
  const BASE = "https://api.themoviedb.org/3";
  const IMG = "https://image.tmdb.org/t/p/w500";

  if (!TMDB_TOKEN) {
    console.error("❌ TMDB_API_KEY missing");
    return;
  }

  /* =========================
     ELEMENTS
  ========================= */

  const rails = {
    trending: document.getElementById("trending"),
    movies: document.getElementById("movies"),
    tv: document.getElementById("tv"),
    continue: document.getElementById("continue"),
  };

  const searchInput = document.getElementById("search");
  const searchResults = document.getElementById("search-results");
  const searchPage = document.getElementById("search-page");
  const searchGrid = document.getElementById("search-grid");

  /* =========================
     TMDB FETCH
  ========================= */

  async function tmdb(endpoint) {
    const res = await fetch(`${BASE}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error("TMDB error:", res.status);
      return { results: [] };
    }

    return res.json();
  }

  /* =========================
     CARD CREATOR
  ========================= */

  function createCard(item) {
    if (!item.poster_path) return null;

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${IMG + item.poster_path}" alt="${item.title || item.name}">
    `;

    card.onclick = () => {
      const type = item.media_type || (item.first_air_date ? "tv" : "movie");
      window.location.href = `player.html?id=${item.id}&type=${type}`;
    };

    return card;
  }

  /* =========================
     LOAD RAILS
  ========================= */

  async function loadRails() {
    console.log("📡 Loading content…");

    const trending = await tmdb("/trending/all/week");
    trending.results.forEach(i => {
      const c = createCard(i);
      if (c) rails.trending.appendChild(c);
    });

    const movies = await tmdb("/movie/popular");
    movies.results.forEach(i => {
      const c = createCard(i);
      if (c) rails.movies.appendChild(c);
    });

    const tv = await tmdb("/tv/popular");
    tv.results.forEach(i => {
      const c = createCard(i);
      if (c) rails.tv.appendChild(c);
    });

    loadContinueWatching();

    console.log("✅ Cards rendered");
  }

  /* =========================
     CONTINUE WATCHING
  ========================= */

  function saveContinue(item) {
    let list = JSON.parse(localStorage.getItem("continue") || "[]");
    list = list.filter(i => i.id !== item.id);
    list.unshift(item);
    localStorage.setItem("continue", JSON.stringify(list.slice(0, 10)));
  }

  function loadContinueWatching() {
    rails.continue.innerHTML = "";
    const list = JSON.parse(localStorage.getItem("continue") || "[]");
    list.forEach(i => {
      const c = createCard(i);
      if (c) rails.continue.appendChild(c);
    });
  }

  /* =========================
     SEARCH (ENTER KEY)
  ========================= */

  searchInput.addEventListener("keydown", async e => {
    if (e.key !== "Enter") return;

    const q = searchInput.value.trim();
    if (!q) return;

    searchGrid.innerHTML = "";
    searchPage.hidden = false;
    searchResults.style.display = "none";

    const data = await tmdb(`/search/multi?query=${encodeURIComponent(q)}`);

    data.results
      .filter(i => i.poster_path)
      .forEach(i => {
        const c = createCard(i);
        if (c) searchGrid.appendChild(c);
      });
  });

  /* =========================
     SEARCH AUTOCOMPLETE
  ========================= */

  let searchTimer;

  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);

    const q = searchInput.value.trim();
    if (!q) {
      searchResults.style.display = "none";
      return;
    }

    searchTimer = setTimeout(async () => {
      const data = await tmdb(`/search/multi?query=${encodeURIComponent(q)}`);

      searchResults.innerHTML = "";
      searchResults.style.display = "block";

      data.results
        .filter(i => i.poster_path)
        .slice(0, 6)
        .forEach(i => {
          const row = document.createElement("div");
          row.className = "search-item";
          row.innerHTML = `
            <img src="${IMG + i.poster_path}">
            <div>${i.title || i.name}</div>
          `;
          row.onclick = () => {
            const type = i.media_type || "movie";
            window.location.href = `player.html?id=${i.id}&type=${type}`;
          };
          searchResults.appendChild(row);
        });
    }, 300);
  });

  /* =========================
     INIT
  ========================= */

  loadRails();
});
