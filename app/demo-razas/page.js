'use client';
import { useState, useEffect } from "react";

const DOG_BREEDS = [
  "labrador", "poodle", "bulldog", "beagle", "chihuahua",
  "doberman", "husky", "pug", "rottweiler", "shihtzu"
];

const CAT_BREEDS = [
  // IDs de The Cat API
  { id: "abys", name: "Abisinio" },
  { id: "beng", name: "Bengala" },
  { id: "siam", name: "Siamés" },
  { id: "pers", name: "Persa" },
  { id: "ragd", name: "Ragdoll" }
];

export default function DemoRazas() {
  const [species, setSpecies] = useState("perro");
  const [breed, setBreed] = useState("");
  const [img, setImg] = useState("");
  const catKey = process.env.NEXT_PUBLIC_CAT_API_KEY;

  useEffect(() => {
    async function fetchImg() {
      setImg("");
      if (!breed) return;
      if (species === "perro") {
        const res = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`);
        const data = await res.json();
        setImg(data?.message || "");
      } else {
        const res = await fetch(`https://api.thecatapi.com/v1/images/search?breed_ids=${breed}`, {
          headers: { "x-api-key": catKey || "" }
        });
        const data = await res.json();
        setImg(data?.[0]?.url || "");
      }
    }
    fetchImg();
  }, [breed, species, catKey]);

  return (
    <div>
      <h2>Demo: imagen por raza</h2>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <label>Especie</label>
        <select value={species} onChange={e=>{ setSpecies(e.target.value); setBreed(""); setImg(""); }}>
          <option value="perro">Perro</option>
          <option value="gato">Gato</option>
        </select>

        <label>Raza</label>
        {species === "perro" ? (
          <select value={breed} onChange={e=>setBreed(e.target.value)}>
            <option value="">-- Selecciona --</option>
            {DOG_BREEDS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        ) : (
          <select value={breed} onChange={e=>setBreed(e.target.value)}>
            <option value="">-- Selecciona --</option>
            {CAT_BREEDS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        )}
      </div>

      <div style={{ marginTop: 16 }}>
        {img ? <img src={img} alt="Raza" style={{ maxWidth: 360, borderRadius: 8 }} /> : <p>Selecciona raza…</p>}
      </div>
    </div>
  );
}
