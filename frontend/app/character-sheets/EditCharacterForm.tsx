"use client";

import { useState } from "react";

interface Character {
  id: number;
  name: string;
  characterClass: string;
  race: string;
  level: number;
  hp: number;
  backstory: string;
}

export default function EditCharacterForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Character;
  onSave: (c: Partial<Character>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial.name || "");
  const [characterClass, setCharacterClass] = useState(initial.characterClass || "");
  const [race, setRace] = useState(initial.race || "");
  const [level, setLevel] = useState(String(initial.level ?? 1));
  const [hp, setHp] = useState(String(initial.hp ?? 1));
  const [backstory, setBackstory] = useState(initial.backstory || "");
  const [isSaving, setIsSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        id: initial.id,
        name: name.trim(),
        characterClass: characterClass.trim(),
        race: race.trim(),
        level: Number(level) || 1,
        hp: Number(hp) || 1,
        backstory: backstory.trim(),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />

      <form
        onSubmit={submit}
        className="relative bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg p-6 w-full max-w-lg shadow-lg text-purple-100 z-10"
        aria-label={`Edit character ${initial.name}`}
      >
        <h3 className="text-2xl font-serif font-bold mb-4">Edit Character</h3>

        <div className="grid grid-cols-1 gap-3">
          <input
            className="p-2 rounded bg-purple-800/60"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
          />

          <input
            className="p-2 rounded bg-purple-800/60"
            value={characterClass}
            onChange={(e) => setCharacterClass(e.target.value)}
            placeholder="Class"
            required
          />

          <input
            className="p-2 rounded bg-purple-800/60"
            value={race}
            onChange={(e) => setRace(e.target.value)}
            placeholder="Race"
            required
          />

          <div className="flex gap-3">
            <input
              type="number"
              min={1}
              className="p-2 rounded bg-purple-800/60 flex-1"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              placeholder="Level"
              required
            />

            <input
              type="number"
              min={1}
              className="p-2 rounded bg-purple-800/60 flex-1"
              value={hp}
              onChange={(e) => setHp(e.target.value)}
              placeholder="HP"
              required
            />
          </div>

          <textarea
            className="p-2 rounded bg-purple-800/60 min-h-[8rem]"
            value={backstory}
            onChange={(e) => setBackstory(e.target.value)}
            placeholder="Backstory"
          />
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-purple-700/60 rounded font-serif"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 bg-green-600 rounded font-serif font-bold disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
