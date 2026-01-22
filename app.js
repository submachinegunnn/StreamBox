const moviesEl = document.getElementById('movies');
const tvEl = document.getElementById('tv');
const continueEl = document.getElementById('continue');
const searchInput = document.getElementById('search');


async function loadHome() {
const movies = await fetch('/api/tmdb?path=/movie/popular').then(r=>r.json());
const tv = await fetch('/api/tmdb?path=/tv/popular').then(r=>r.json());


moviesEl.innerHTML = movies.results.map(m => card(m, 'movie')).join('');
tvEl.innerHTML = tv.results.map(t => card(t, 'tv')).join('');


loadContinue();
}


function card(item, type) {
return `
<div class="card" onclick="openItem('${type}', ${item.id})">
<img src="https://image.tmdb.org/t/p/w300${item.poster_path}">
<p>${item.title || item.name}</p>
</div>`;
}


function openItem(type, id) {
window.location.href = type === 'movie'
? `/watch.html?id=${id}`
: `/tv.html?id=${id}`;
}


function loadContinue() {
  continueEl.innerHTML = Object.keys(localStorage)
    .filter(k => k.startsWith('progress-'))
    .slice(0, 10)
    .map(k => {
      const d = JSON.parse(localStorage.getItem(k));
      return card(d, d.type);
    }).join('');
}


searchInput.oninput = async e => {
const q = e.target.value;
if (!q) return loadHome();


const res = await fetch(`/api/tmdb?path=/search/multi&query=${q}`);
const data = await res.json();


moviesEl.innerHTML = data.results
.filter(r => r.media_type !== 'person')
.map(r => card(r, r.media_type)).join('');
tvEl.innerHTML = '';
};

loadHome()

