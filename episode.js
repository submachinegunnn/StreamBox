import { tmdb } from "./api/tmdb.js";

const id = new URLSearchParams(location.search).get("id");
const root = document.getElementById("episodes");

(async () => {
  const show = await tmdb(`/tv/${id}`);
  const season = await tmdb(`/tv/${id}/season/1`);

  season.episodes.forEach(ep => {
    const btn = document.createElement("button");
    btn.textContent = `S1E${ep.episode_number} — ${ep.name}`;
    btn.onclick = () => {
      location.href = `player.html?type=tv&id=${id}&s=1&e=${ep.episode_number}`;
    };
    root.append(btn);
  });
})();

