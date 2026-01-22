export default async function handler(req, res) {
  const { path } = req.query;

  const r = await fetch(
    `https://api.themoviedb.org/3${path}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_KEY}`
      }
    }
  );

  const data = await r.json();
  res.status(200).json(data);
}
