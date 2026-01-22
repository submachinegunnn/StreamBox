const id=new URLSearchParams(location.search).get('id');
const API='/api/tmdb';
const get=p=>fetch(`${API}?path=${encodeURIComponent(p)}`).then(r=>r.json());


(async()=>{
const show=await get(`/tv/${id}`);
document.getElementById('show').textContent=show.name;
const seasons=await get(`/tv/${id}`);
seasons.seasons.forEach(s=>{
const b=document.createElement('button');
b.textContent=`Season ${s.season_number}`;
b.onclick=async()=>{
const eps=await get(`/tv/${id}/season/${s.season_number}`);
episodes.innerHTML='';
eps.episodes.forEach(e=>{
const d=document.createElement('div');
d.className='card';
d.textContent=`E${e.episode_number} ${e.name}`;
d.onclick=()=>location.href=`/player.html?type=tv&id=${id}`;
episodes.append(d);
})
}
seasons.append(b);
})
})();
