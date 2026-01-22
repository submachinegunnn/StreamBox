import { tmdb, IMG } from "./api/tmdb.js";

const rails = {
  trending: document.getElementById("trending"),
  movies: document.getElementById("movies"),
  tv: document.getElementById("tv"),
  continue: document.getElementById("continue")
};

const search = document.getElementById("search");

function card(item) {
  const el = document.createElement("div");
  el.className = "card";

  el.innerHTML = `
    <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" />
  `;

  el.onclick = () => {
    const type = item.media_type === "tv" ? "tv" : "movie";
    window.location.href = `/player.html?id=${item.id}&type=${type}`;
  };

  return el;
}


function render(list, el) {
  el.innerHTML = "";
  list.filter(i => i.poster_path).forEach(i => el.append(card(i)));
}

async function load() {
  render((await tmdb("/trending/all/week")).results, rails.trending);
  render((await tmdb("/movie/popular")).results, rails.movies);
  render((await tmdb("/tv/popular")).results, rails.tv);

  const cont = JSON.parse(localStorage.getItem("continue") || "[]");
  render(cont, rails.continue);
}

search.onkeydown = e => {
  if (e.key === "Enter") {
    location.href = `search.html?q=${encodeURIComponent(search.value)}`;
  }
};

load();

