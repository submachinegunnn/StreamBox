const params = new URLSearchParams(location.search);
const id = params.get("id");
const type = params.get("type");

let url =
  type === "movie"
    ? `https://www.vidking.net/embed/movie/${id}?autoPlay=true`
    : `https://www.vidking.net/embed/tv/${id}/1/1?autoPlay=true&nextEpisode=true&episodeSelector=true`;

document.getElementById("player").innerHTML = `
  <iframe src="${url}" width="100%" height="600" frameborder="0" allowfullscreen></iframe>
`;

window.addEventListener("message", e => {
  if (!e.data?.includes("PLAYER_EVENT")) return;
  localStorage.setItem("continue_" + id, e.data);
});
