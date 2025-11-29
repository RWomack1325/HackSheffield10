'use client';

import { useState } from 'react';

interface Character {
  id: number;
  name: string;
  class: string;
  race: string;
  level: number;
  hp: number;
}

export default function CharacterSheets() {
  const [characters, setCharacters] = useState<Character[]>([
    {
      id: 1,
      name: 'Aragorn the Ranger',
      class: 'Ranger',
      race: 'Human',
      level: 8,
      hp: 65,
    },
    {
      id: 2,
      name: 'Elara Moonwhisper',
      class: 'Wizard',
      race: 'Elf',
      level: 6,
      hp: 32,
    },
  ]);

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black">
      <main className="flex flex-col w-full p-6 gap-6" aria-label="Character sheets page">
        <div className="mb-4">
          <h1 className="text-4xl font-serif font-bold text-purple-100">Character Sheets</h1>
          <p className="text-purple-300 font-serif mt-2">Manage your D&D characters</p>
        </div>

        {/* Characters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
          {characters.map((character) => (
            <div
              key={character.id}
              className="bg-gradient-to-br from-purple-800 to-indigo-900 rounded-lg shadow-lg p-6 border-2 border-purple-500 hover:border-purple-300 transition-all"
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
                  <span className="text-purple-100">{character.class}</span>
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
              </div>

              <button
                className="w-full mt-6 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg font-serif font-bold transition-all focus:outline-none focus:ring-2 focus:ring-purple-300"
                aria-label={`Edit ${character.name}`}
              >
                Edit
              </button>
            </div>
          ))}
        </div>

        {/* Create New Character Button */}
        <div className="mt-8 flex justify-center">
          <button
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg font-serif font-bold text-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-300"
            aria-label="Create a new character"
          >
            Create New Character
          </button>
        </div>
      </main>
    </div>
  );
}
