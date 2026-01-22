const params = new URLSearchParams(location.search);
const id = params.get("id");
const type = params.get("type");
const season = params.get("season") || 1;
const episode = params.get("episode") || 1;

const iframe = document.getElementById("player");

let src = "";

if (type === "tv") {
  src = `https://www.vidking.net/embed/tv/${id}/${season}/${episode}?autoPlay=true&nextEpisode=true&episodeSelector=true`;
} else {
  src = `https://www.vidking.net/embed/movie/${id}?autoPlay=true`;
}

iframe.src = src;
