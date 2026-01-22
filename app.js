const supabaseClient = supabase.createClient(
  'https://pyxjcokseendxnutwfeo.supabase.co',
  'sb_publishable_P6pcnsChNbNkl5in99Spng_8l62itwv'
);

const authEl = document.getElementById('auth');
const appEl = document.getElementById('app');

async function signup() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const { error } = await supabaseClient.auth.signUp({
    email,
    password
  });

  if (error) alert(error.message);
}

async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) alert(error.message);
}

async function logout() {
  await supabaseClient.auth.signOut();
}

supabaseClient.auth.onAuthStateChange(async (_, session) => {
  authEl.hidden = !!session;
  appEl.hidden = !session;

  if (session) {
    await supabaseClient.from('profiles').upsert({
      id: session.user.id,
      email: session.user.email
    });
  }
});
