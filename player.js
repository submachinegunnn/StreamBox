const params = new URLSearchParams(location.search);
const id = params.get("id");
const type = params.get("type");

const iframe = document.getElementById("player");

if (type === "tv") {
  iframe.src = `https://www.vidking.net/embed/tv/${id}/1/1?autoPlay=true&nextEpisode=true`;
} else {
  iframe.src = `https://www.vidking.net/embed/movie/${id}?autoPlay=true`;
}
