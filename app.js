const TOKEN = import.meta?.env?.TMDB_TOKEN || "";
const API = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p/w500";

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json"
};

const rails = {
  trending: "/trending/all/week",
  movies: "/movie/popular",
  tv: "/tv/popular"
};

async function fetchList(endpoint, container) {
  const res = await fetch(API + endpoint, { headers });
  const data = await res.json();
  renderCards(data.results, container);
}

function renderCards(items, containerId) {
  const el = document.getElementById(containerId);
  el.innerHTML = "";

  items.forEach(i => {
    if (!i.poster_path) return;

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${IMG + i.poster_path}" />
    `;
    card.onclick = () => openPlayer(i);
    el.appendChild(card);
  });
}

function openPlayer(item) {
  const type = item.media_type || (item.title ? "movie" : "tv");
  location.href = `player.html?id=${item.id}&type=${type}`;
}

async function loadHero() {
  const res = await fetch(API + "/trending/movie/week", { headers });
  const movie = (await res.json()).results[0];
  document.getElementById("hero").style.backgroundImage =
    `url(${IMG + movie.backdrop_path})`;
}

loadHero();
fetchList(rails.trending, "trending");
fetchList(rails.movies, "movies");
fetchList(rails.tv, "tv");
