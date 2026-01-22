document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM loaded");

  const TMDB_TOKEN = window.TMDB_API_KEY; // this is your v4 READ TOKEN
  const BASE = "https://api.themoviedb.org/3";
  const IMG = "https://image.tmdb.org/t/p/w500";

  const trending = document.getElementById("trending");
  const movies = document.getElementById("movies");
  const tv = document.getElementById("tv");

  async function tmdb(endpoint) {
    const res = await fetch(`${BASE}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();
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
    const t = await tmdb("/trending/all/week");
    t.results
      .filter(i => i.poster_path)
      .forEach(i => trending.appendChild(card(i)));

    const m = await tmdb("/movie/popular");
    m.results
      .filter(i => i.poster_path)
      .forEach(i => movies.appendChild(card(i)));

    const s = await tmdb("/tv/popular");
    s.results
      .filter(i => i.poster_path)
      .forEach(i => tv.appendChild(card(i)));

    console.log("✅ Cards rendered");
  }

  load();
});
