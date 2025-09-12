import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Bienvenido</h1>
      <p>Starter con Next.js + Supabase + esquema multi-tenant.</p>
      <ul>
        <li><Link href="/login">Iniciar sesión</Link></li>
        <li><Link href="/demo-razas">Demo: imagen por raza</Link></li>
      </ul>
    </div>
  );
}
