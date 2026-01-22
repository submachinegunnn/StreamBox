import { tmdb, IMG } from "./api/tmdb.js";

const q = new URLSearchParams(location.search).get("q");
const grid = document.getElementById("grid");

function card(item) {
  const el = document.createElement("div");
  el.className = "card";
  el.innerHTML = `<img src="${IMG}${item.poster_path}">`;

  el.onclick = () => {
    if (item.media_type === "tv") {
      location.href = `episode.html?id=${item.id}`;
    } else {
      location.href = `player.html?type=movie&id=${item.id}`;
    }
  };

  return el;
}

(async () => {
  const data = await tmdb(`/search/multi?query=${q}`);
  data.results.filter(i => i.poster_path).forEach(i => grid.append(card(i)));
})();
