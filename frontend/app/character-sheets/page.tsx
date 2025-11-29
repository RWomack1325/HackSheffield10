"use client";

import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import CreateCharacterForm from "./CreateCharacterForm";

interface Character {
  id: number;
  name: string;
  characterClass: string;
  race: string;
  level: number;
  hp: number;
  backstory: string;
}

export default function CharacterSheets() {
  const { user, setUserPartial } = useUser();

  const [characters, setCharacters] = useState<Character[]>([]);

  const handleSelect = (characterId: number, characterName: string) => {
    const idStr = String(characterId);
    const currentlySelected = user?.characterId === idStr;

    if (currentlySelected) {
      // clicking selected character will deselect it
      setUserPartial({ characterId: '' });
      return;
    }

    // set the selected character (allow switching later)
    setUserPartial({ characterId: idStr, characterName });
  };

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const url = `http://${process.env.NEXT_PUBLIC_API_URL}/character-sheets`;
        const response = await fetch(url);
        const data = await response.json();

        setCharacters(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchCharacters();
  }, [user]);

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black">
      <main className="flex flex-col w-full p-6 gap-6" aria-label="Character sheets page">
        <div className="mb-4">
          <h1 className="text-4xl font-serif font-bold text-purple-100">Character Sheets</h1>
          <p className="text-purple-300 font-serif mt-2">Manage your D&D characters</p>
        </div>

        {/* Create form toggle and form */}
        <CreateCharacterForm onCreate={async (newChar) => {

            const url = `http://${process.env.NEXT_PUBLIC_API_URL}/character-sheets`;
            const resp = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newChar.name,
                    characterClass: newChar.characterClass,
                    race: newChar.race,
                    level: newChar.level,
                    hp: newChar.hp,
                    backstory: newChar.backstory
                    }),
            });

        if (!resp.ok) throw new Error(`Server responded ${resp.status}`);

        const saved = await resp.json();
          setCharacters((prev) => [saved, ...prev]);


          // automatically select the newly created character
          setUserPartial({ characterId: String(saved.id), characterName: saved.name });
        }} />

        {/* Characters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
          {characters.map((character) => {
            const isSelected = user?.characterId === String(character.id);
            return (
              <div
                key={character.id}
                className={`bg-gradient-to-br from-purple-800 to-indigo-900 rounded-lg shadow-lg p-6 border-2 ${isSelected ? 'border-green-400' : 'border-purple-500'} hover:border-purple-300 transition-all`}
                role="listitem"
              >
                <div className="mb-4">
                  <h2 className="text-2xl font-serif font-bold text-purple-100">
                    {character.name}
                  </h2>
                </div>

                <div className="space-y-3 text-purple-200 font-serif">
                  <div className="flex justify-between items-center bg-purple-900/50 p-3 rounded">
                    <span className="font-semibold">Class:</span>
                    <span className="text-purple-100">{character.characterClass}</span>
                  </div>

                  <div className="flex justify-between items-center bg-purple-900/50 p-3 rounded">
                    <span className="font-semibold">Race:</span>
                    <span className="text-purple-100">{character.race}</span>
                  </div>

                  <div className="flex justify-between items-center bg-purple-900/50 p-3 rounded">
                    <span className="font-semibold">Level:</span>
                    <span className="text-purple-100">{character.level}</span>
                  </div>

                  <div className="flex justify-between items-center bg-purple-900/50 p-3 rounded">
                    <span className="font-semibold">HP:</span>
                    <span className="text-red-400">{character.hp}</span>
                  </div>

                  <div className="bg-purple-900/50 p-3 rounded">
                    <label className="font-semibold text-purple-100 block mb-2">Backstory</label>
                    <div
                      className="text-purple-200 text-sm leading-relaxed max-h-32 overflow-y-auto whitespace-pre-wrap p-2 rounded bg-purple-900/30"
                      aria-label={`Backstory for ${character.name}`}
                    >
                      {character.backstory}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => handleSelect(character.id, character.name)}
                    className={`flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg font-serif font-bold transition-all focus:outline-none focus:ring-2 focus:ring-green-300 ${isSelected ? 'opacity-80' : ''}`}
                    aria-label={`Select ${character.name} as active character`}
                  >
                    {isSelected ? 'Selected' : 'Select'}
                  </button>

                  <button
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg font-serif font-bold transition-all focus:outline-none focus:ring-2 focus:ring-purple-300"
                    aria-label={`Edit ${character.name}`}
                  >
                    Edit
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* (Create form is above) */}
      </main>
    </div>
  );
}
