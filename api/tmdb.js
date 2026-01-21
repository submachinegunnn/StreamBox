export default async function handler(req, res) {
const { path } = req.query;
if (!path) return res.status(400).end();


const url = `https://api.themoviedb.org/3/${path}?api_key=${process.env.TMDB_KEY}`;
const r = await fetch(url);
const data = await r.json();


res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');
res.status(200).json(data);
}