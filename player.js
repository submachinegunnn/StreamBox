const p = new URLSearchParams(location.search);
const type = p.get("type");
const id = p.get("id");
const s = p.get("s") || 1;
const e = p.get("e") || 1;

const frame = document.getElementById("frame");
let url;

if (type === "movie") {
  url = `https://www.vidking.net/embed/movie/${id}?autoPlay=true`;
} else {
  url = `https://www.vidking.net/embed/tv/${id}/${s}/${e}?autoPlay=true&nextEpisode=true`;
}

frame.src = url;

/* Save continue watching */
const list = JSON.parse(localStorage.getItem("continue") || "[]");
if (!list.find(i => i.id == id)) {
  list.unshift({ id, media_type: type });
  localStorage.setItem("continue", JSON.stringify(list.slice(0, 10)));
}
