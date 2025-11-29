"use client";

import { useState } from "react";

interface Character {
  id: number;
  name: string;
  class: string;
  race: string;
  level: number;
  hp: number;
}

export default function CreateCharacterForm({ onCreate }: { onCreate: (c: Character) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [cls, setCls] = useState("");
  const [race, setRace] = useState("");
  const [level, setLevel] = useState<number>(1);
  const [hp, setHp] = useState<number>(10);
  const [error, setError] = useState("");

  const reset = () => {
    setName("");
    setCls("");
    setRace("");
    setLevel(1);
    setHp(10);
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter a character name.");
      return;
    }
    const newChar: Character = {
      id: Date.now(),
      name: name.trim(),
      class: cls || "Adventurer",
      race: race || "Human",
      level: Math.max(1, Math.floor(level)),
      hp: Math.max(1, Math.floor(hp)),
    };
    onCreate(newChar);
    reset();
    setOpen(false);
  };

  return (
    <div className="max-w-md w-full mb-6">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-serif font-bold"
        >
          Create New Character
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-gradient-to-br from-purple-800 to-indigo-900 rounded-lg shadow-lg p-6 border-2 border-purple-500">
          <h3 className="text-xl font-serif font-bold text-purple-100 mb-3">Create Character</h3>
          {error && <div className="text-red-300 mb-2">{error}</div>}
          <label className="block mb-2">
            <span className="text-purple-200">Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 px-3 py-2 rounded bg-purple-900 text-white" />
          </label>
          <label className="block mb-2">
            <span className="text-purple-200">Class</span>
            <input value={cls} onChange={(e) => setCls(e.target.value)} placeholder="e.g. Fighter" className="w-full mt-1 px-3 py-2 rounded bg-purple-900 text-white" />
          </label>
          <label className="block mb-2">
            <span className="text-purple-200">Race</span>
            <input value={race} onChange={(e) => setRace(e.target.value)} placeholder="e.g. Elf" className="w-full mt-1 px-3 py-2 rounded bg-purple-900 text-white" />
          </label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <label className="block">
              <span className="text-purple-200">Level</span>
              <input type="number" value={level} onChange={(e) => setLevel(Number(e.target.value))} className="w-full mt-1 px-3 py-2 rounded bg-purple-900 text-white" min={1} />
            </label>
            <label className="block">
              <span className="text-purple-200">HP</span>
              <input type="number" value={hp} onChange={(e) => setHp(Number(e.target.value))} className="w-full mt-1 px-3 py-2 rounded bg-purple-900 text-white" min={1} />
            </label>
          </div>

          <div className="flex gap-3 mt-4">
            <button type="submit" className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg font-serif font-bold">Create & Select</button>
            <button type="button" onClick={() => { reset(); setOpen(false); }} className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}
