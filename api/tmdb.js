export default async function handler(req, res) {
  const { path } = req.query;

  const response = await fetch(`https://api.themoviedb.org/3${path}`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  res.status(200).json(data);
}
