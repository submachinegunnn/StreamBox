const supabase = supabase.createClient(
'https://pyxjcokseendxnutwfeo.supabase.co',
'sb_publishable_P6pcnsChNbNkl5in99Spng_8l62itwv'
);


const authEl = document.getElementById('auth');
const appEl = document.getElementById('app');


async function signup() {
await supabase.auth.signUp({
email: email.value,
password: password.value
});
}


async function login() {
await supabase.auth.signInWithPassword({
email: email.value,
password: password.value
});
}


async function oauth(provider) {
await supabase.auth.signInWithOAuth({ provider });
}


async function logout() {
await supabase.auth.signOut();
}


async function loadMovies() {
const r = await fetch('/api/tmdb?path=movie/popular');
const d = await r.json();
movies.innerHTML = d.results.map(m => `<div>${m.title}</div>`).join('');
}


supabase.auth.onAuthStateChange(async (_, session) => {
authEl.hidden = !!session;
appEl.hidden = !session;


if (session) {
await supabase.from('profiles').upsert({
id: session.user.id,
email: session.user.email
});
loadMovies();
}
});