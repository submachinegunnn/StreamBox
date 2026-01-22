const API='/api/tmdb';
const get=path=>fetch(`${API}?path=${encodeURIComponent(path)}`).then(r=>r.json());


function card(item,type){
const d=document.createElement('div');
d.className='card';
d.innerHTML=`<img src="https://image.tmdb.org/t/p/w500${item.poster_path}"><p>${item.title||item.name}</p>`;
d.onclick=()=>location.href= type==='tv'?`/episode.html?id=${item.id}`:`/player.html?type=${type}&id=${item.id}`;
return d;
}


function rail(el,items,type){el.innerHTML='';items.forEach(i=>i.poster_path&&el.append(card(i,type)))}


async function home(){
rail(movies,(await get('/movie/popular')).results,'movie');
rail(tv,(await get('/tv/popular')).results,'tv');
recommendations();
continueWatching();
}


function continueWatching(){
const el=document.getElementById('continue');
el.innerHTML='';
Object.values(localStorage).forEach(v=>{
try{const d=JSON.parse(v);if(d.id)el.append(card(d,d.type));}catch{}
})
}


async function recommendations(){
const watched=Object.values(localStorage).map(v=>{try{return JSON.parse(v)}catch{}}).filter(Boolean);
if(!watched.length) return;
const last=watched.pop();
const r=await get(`/${last.type}/${last.id}/recommendations`);
rail(recommended,r.results,last.type);
}


search.oninput=async e=>{
if(!e.target.value)return searchResults.innerHTML='';
const r=await get(`/search/multi?query=${e.target.value}`);
searchResults.innerHTML='';
r.results.slice(0,8).forEach(i=>{
if(!i.poster_path)return;
const d=document.createElement('div');
d.className='search-item';
d.textContent=i.title||i.name;
d.onclick=()=>location.href=i.media_type==='tv'?`/episode.html?id=${i.id}`:`/player.html?type=${i.media_type}&id=${i.id}`;
searchResults.append(d);
})
};


home();
