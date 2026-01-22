const params = new URLSearchParams(window.location.search);
const movieId = params.get('id');

async function loadMovie() {
  const res = await fetch(`/api/tmdb?path=/movie/${movieId}`);
  const movie = await res.json();

  document.getElementById('title').textContent = movie.title;

  // Resume support (optional)
  const savedTime = localStorage.getItem(`movie-${movieId}-time`) || 0;

  document.getElementById('player').innerHTML = `
    <iframe
      src="https://www.vidking.net/embed/movie/${movieId}?autoPlay=true&progress=${savedTime}"
      width="100%"
      height="600"
      frameborder="0"
      allowfullscreen>
    </iframe>
  `;
}

loadMovie();

/* 🎯 WATCH PROGRESS TRACKING */
window.addEventListener("message", event => {
  if (typeof event.data !== "string") return;

  try {
    const msg = JSON.parse(event.data);
    if (msg?.data?.currentTime) {
      localStorage.setItem(
        `movie-${movieId}-time`,
        Math.floor(msg.data.currentTime)
      );
    }
  } catch {}
});
