const API_KEY = window.TMDB_API_KEY;
const BASE = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p/w500";

const trending = document.getElementById("trending");
const movies = document.getElementById("movies");
const tv = document.getElementById("tv");

async function get(url) {
  const r = await fetch(`${BASE}${url}?api_key=${API_KEY}`);
  return r.json();
}

function makeCard(item) {
  const d = document.createElement("div");
  d.className = "card";
  d.innerHTML = `
    <img src="${IMG + item.poster_path}">
  `;
  return d;
}

async function load() {
  const t = await get("/trending/all/week");
  t.results.forEach(i => trending.appendChild(makeCard(i)));

  const m = await get("/movie/popular");
  m.results.forEach(i => movies.appendChild(makeCard(i)));

  const s = await get("/tv/popular");
  s.results.forEach(i => tv.appendChild(makeCard(i)));
}

load();
