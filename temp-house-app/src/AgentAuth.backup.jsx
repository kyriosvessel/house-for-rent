import { useState } from 'react';
import { supabase } from './lib/supabase';

export default function AgentAuth({ onBack }) {
  const [login, setLogin] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      if (login) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMessage('Login successful!');
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: name, phone } }
        });
        if (error) throw error;
        setMessage('Registration submitted! Check your email to confirm your account.');
      }
    } catch (e) {
      setMessage(e.message);
    } finally {
      setBusy(false);
    }
  }

  return <main style={{maxWidth:440,margin:'35px auto',padding:24,fontSize:18}}>
    <button onClick={onBack}>← Back to home</button>
    <h1>{login ? 'Agent Login' : 'Agent Sign Up'}</h1>
    <p>{login ? 'Welcome back!' : 'Create your free agent account.'}</p>
    <form onSubmit={submit} style={{display:'grid',gap:14}}>
      {!login && <>
        <input required placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
        <input required placeholder="Phone number" value={phone} onChange={e=>setPhone(e.target.value)} />
      </>}
      <input required type="email" placeholder="Email address" value={email} onChange={e=>setEmail(e.target.value)} />
      <input required minLength={6} type="password" placeholder="Password (at least 6 characters)" value={password} onChange={e=>setPassword(e.target.value)} />
      <button disabled={busy} type="submit">{busy ? 'Please wait...' : login ? 'Log In' : 'Create Account'}</button>
    </form>
    <p role="status">{message}</p>
    <button onClick={()=>{setLogin(!login);setMessage('')}}>
      {login ? 'Need an account? Sign up' : 'Already registered? Log in'}
    </button>
  </main>;
}
