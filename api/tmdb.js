export default async function handler(req, res) {
const { path } = req.query;
if (!path) return res.status(400).json({ error: 'Missing path' });


const r = await fetch(`https://api.themoviedb.org/3${path}`, {
headers: {
Authorization: `Bearer ${process.env.TMDB_KEY}`,
'Content-Type': 'application/json'
}
});


const data = await r.json();
res.status(200).json(data);
}
