'use client';

import { useState } from 'react';

const DICE = [4, 6, 8, 10, 12, 20, 100];

type LastRoll = {
  timestamp: string;
  notation: string;
  rolls: number[];
  total: number;
};

export default function DiceRoller() {
  const [die, setDie] = useState<number>(20);
  const [count, setCount] = useState<number>(1);
  const [modifier, setModifier] = useState<number>(0);
  const [lastRoll, setLastRoll] = useState<LastRoll | null>(null);

  function rollOnce(sides: number) {
    return Math.floor(Math.random() * sides) + 1;
  }

  function rollDice() {
    const rolls = [] as number[];
    for (let i = 0; i < Math.max(1, count); i++) {
      rolls.push(rollOnce(die));
    }
    const sum = rolls.reduce((a, b) => a + b, 0) + modifier;
    const now = new Date().toLocaleTimeString();
    const notation = `${count}d${die}${modifier >= 0 ? `+${modifier}` : modifier}`;

    const result: LastRoll = {
      timestamp: now,
      notation,
      rolls,
      total: sum,
    };

    setLastRoll(result);
  }

  function quickRoll(sides: number) {
    setDie(sides);
    setCount(1);
    setModifier(0);
    setTimeout(rollDice, 10);
  }

  return (
    <aside className="w-72 bg-gradient-to-br from-black/40 to-purple-900/40 rounded-lg p-4 border-2 border-purple-600 shadow-inner flex flex-col gap-3">
      <h3 className="text-white font-bold text-lg">Dice Roller</h3>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-purple-200">Dice</label>
        <div className="flex gap-2 flex-wrap">
          {DICE.map((s) => (
            <button
              key={s}
              onClick={() => setDie(s)}
              className={`px-3 py-1 rounded-md text-sm font-mono ${die === s ? 'bg-purple-600 text-white' : 'bg-purple-800 text-purple-200'}`}
            >
              d{s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-sm text-purple-200">Count</label>
          <input
            type="number"
            min={1}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full mt-1 px-2 py-1 rounded bg-purple-900 text-white text-sm"
            aria-label="Number of dice"
          />
        </div>
        <div className="w-24">
          <label className="text-sm text-purple-200">Mod</label>
          <input
            type="number"
            value={modifier}
            onChange={(e) => setModifier(Number(e.target.value))}
            className="w-full mt-1 px-2 py-1 rounded bg-purple-900 text-white text-sm"
            aria-label="Modifier"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={rollDice}
          className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded font-bold"
          aria-label="Roll dice"
        >
          Roll
        </button>
        <button
          onClick={() => setLastRoll(null)}
          className="px-3 py-2 bg-gray-700 text-white rounded text-sm"
          aria-label="Clear last roll"
        >
          Clear
        </button>
      </div>

      <div className="pt-2 border-t border-purple-700 overflow-auto">
        <h4 className="text-sm text-purple-200">Last Roll</h4>
        <div className="mt-2">
          {!lastRoll ? (
            <div className="text-sm text-purple-300">No roll yet</div>
          ) : (
            <div className="text-sm text-white bg-purple-900/30 p-2 rounded flex justify-between">
              <div>
                <div className="text-xs text-purple-300">{lastRoll.timestamp} · {lastRoll.notation}</div>
                <div className="text-sm font-mono">{lastRoll.rolls.join(', ')}</div>
              </div>
              <div className="text-lg font-bold text-green-400 self-center">{lastRoll.total}</div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-1 text-xs text-purple-300">Quick rolls:</div>
      <div className="flex gap-2 flex-wrap">
        {DICE.map((s) => (
          <button key={`quick-${s}`} onClick={() => quickRoll(s)} className="px-2 py-1 bg-purple-700 text-white rounded text-sm">d{s}</button>
        ))}
      </div>
    </aside>
  );
}
