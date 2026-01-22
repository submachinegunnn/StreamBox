document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM loaded");

  const TMDB_TOKEN = window.TMDB_API_KEY; // this is your v4 READ TOKEN
  const BASE = "https://api.themoviedb.org/3";
  const IMG = "https://image.tmdb.org/t/p/w500";

  const trending = document.getElementById("trending");
  const movies = document.getElementById("movies");
  const tv = document.getElementById("tv");

  const playerOverlay = document.getElementById("player-overlay");
  const playerFrame = document.getElementById("player-frame");
  const closePlayer = document.getElementById("close-player");

  function openPlayer(item) {
    const type = item.media_type === "tv" ? "tv" : "movie";
    let url;

    if (type === "movie") {
      url = `https://www.vidking.net/embed/movie/${item.id}?autoPlay=true`;
    } else {
      url = `https://www.vidking.net/embed/tv/${item.id}/1/1?autoPlay=true&episodeSelector=true&nextEpisode=true`;
    }

  playerFrame.src = url;
  playerOverlay.hidden = false;

  saveContinueWatching(item);
}

closePlayer.onclick = () => {
  playerOverlay.hidden = true;
  playerFrame.src = "";
};


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

  el.onclick = () => openPlayer(item);

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


