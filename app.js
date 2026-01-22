document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM loaded");

  const API_KEY = window.TMDB_API_KEY;
  const BASE = "https://api.themoviedb.org/3";
  const IMG = "https://image.tmdb.org/t/p/w500";

  const trending = document.getElementById("trending");
  const movies = document.getElementById("movies");
  const tv = document.getElementById("tv");

  console.log("Rails:", { trending, movies, tv });

  if (!trending || !movies || !tv) {
    console.error("❌ One or more rails not found in DOM");
    return;
  }

  async function get(url) {
    const full = `${BASE}${url}?api_key=${API_KEY}`;
    console.log("Fetching:", full);

    const res = await fetch(full);
    const data = await res.json();

    console.log("Response:", data);
    return data;
  }

  function card(item) {
    const el = document.createElement("div");
    el.className = "card";

    el.innerHTML = `
      <img src="${IMG + item.poster_path}" alt="">
    `;

    return el;
  }

  async function load() {
    const t = await get("/trending/all/week");
    t.results
      .filter(i => i.poster_path)
      .forEach(i => trending.appendChild(card(i)));

    const m = await get("/movie/popular");
    m.results
      .filter(i => i.poster_path)
      .forEach(i => movies.appendChild(card(i)));

    const s = await get("/tv/popular");
    s.results
      .filter(i => i.poster_path)
      .forEach(i => tv.appendChild(card(i)));

    console.log("✅ Cards appended");
  }

  load();
});
