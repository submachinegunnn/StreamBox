const id = new URLSearchParams(location.search).get('id');
const seasonEl = document.getElementById('season');
const episodeEl = document.getElementById('episode');


let show;


async function load() {
show = await fetch(`/api/tmdb?path=/tv/${id}`).then(r=>r.json());
document.getElementById('title').textContent = show.name;


show.seasons.forEach(s => {
if (s.season_number > 0)
seasonEl.innerHTML += `<option value="${s.season_number}">Season ${s.season_number}</option>`;
});


seasonEl.onchange = loadEpisodes;
episodeEl.onchange = play;


loadEpisodes();
}


async function loadEpisodes() {
const s = seasonEl.value;
const data = await fetch(`/api/tmdb?path=/tv/${id}/season/${s}`).then(r=>r.json());


episodeEl.innerHTML = data.episodes.map(e =>
`<option value="${e.episode_number}">Ep ${e.episode_number}</option>`).join('');


play();
}


function play() {
const s = seasonEl.value;
const e = episodeEl.value;
document.getElementById('player').innerHTML = `
<iframe src="https://www.vidking.net/embed/tv/${id}/${s}/${e}?autoPlay=true&nextEpisode=true&episodeSelector=true" width="100%" height="600" allowfullscreen></iframe>`;
}


load();
