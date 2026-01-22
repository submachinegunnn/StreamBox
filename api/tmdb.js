const BASE = "https://api.themoviedb.org/3";

export async function tmdb(endpoint) {
  const res = await fetch(BASE + endpoint, {
    headers: {
      Authorization: `Bearer ${window.TMDB_TOKEN}`,
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) {
    console.error("TMDB error", res.status);
    return { results: [] };
  }

  return res.json();
}

export const IMG = "https://image.tmdb.org/t/p/w500";
