export default async function handler(req, res) {
  const endpoint = req.query.endpoint;

  if (!endpoint) {
    return res.status(400).json({ error: "Missing endpoint" });
  }

  const response = await fetch(
    `https://api.themoviedb.org/3${endpoint}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );

  const data = await response.json();
  res.status(200).json(data);
}
