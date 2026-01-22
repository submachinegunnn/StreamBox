export default async function handler(req, res) {
  const { path, query = "" } = req.query;

  const url = `https://api.themoviedb.org/3/${path}?${query}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_KEY}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  res.status(200).json(data);
}
