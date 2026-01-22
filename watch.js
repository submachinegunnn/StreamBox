const id = new URLSearchParams(location.search).get('id');


async function load() {
const m = await fetch(`/api/tmdb?path=/movie/${id}`).then(r=>r.json());
document.getElementById('title').textContent = m.title;


const progress = localStorage.getItem(`time-movie-${id}`) || 0;


document.getElementById('player').innerHTML = `
<iframe src="https://www.vidking.net/embed/movie/${id}?autoPlay=true&progress=${progress}" width="100%" height="600" allowfullscreen></iframe>`;


localStorage.setItem(`progress-${id}`, JSON.stringify({ id, type:'movie', poster_path:m.poster_path, title:m.title }));
}


window.addEventListener('message', e => {
try {
const d = JSON.parse(e.data);
if (d?.data?.currentTime)
localStorage.setItem(`time-movie-${id}`, Math.floor(d.data.currentTime));
} catch {}
});


load();
