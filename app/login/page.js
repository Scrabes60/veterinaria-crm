'use client';
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setErr(error.message);
    router.push("/dashboard");
  };

  return (
    <div style={{ maxWidth: 360 }}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={onSubmit}>
        <label>Email</label><br/>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required style={{ width: '100%', padding: 8 }}/><br/><br/>
        <label>Contraseña</label><br/>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required style={{ width: '100%', padding: 8 }}/><br/><br/>
        <button type="submit">Entrar</button>
        {err && <p style={{ color: 'red' }}>{err}</p>}
      </form>
    </div>
  );
}
