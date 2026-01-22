const q=new URLSearchParams(location.search);
const type=q.get('type');
const id=q.get('id');


const src= type==='tv'
?`https://www.vidking.net/embed/tv/${id}/1/1?autoPlay=true&nextEpisode=true&episodeSelector=true`
:`https://www.vidking.net/embed/movie/${id}?autoPlay=true`;


player.innerHTML=`<iframe src="${src}" allowfullscreen></iframe>`;


window.addEventListener('message',e=>{
if(typeof e.data!=='string')return;
const m=JSON.parse(e.data);
if(m.type!=='PLAYER_EVENT')return;
localStorage.setItem(`watch-${id}`,JSON.stringify({id,type,season:m.data.season,episode:m.data.episode}));
if(m.data.event==='ended'&&type==='tv')location.href=`/player.html?type=tv&id=${id}`;
});
