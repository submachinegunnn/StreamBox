export default async function handler(req, res) {
  const url = `https://api.themoviedb.org/3${req.query.path}?api_key=${process.env.TMDB_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  res.status(200).json(data);
}
