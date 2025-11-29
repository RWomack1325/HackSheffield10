'use client';

import { useState } from 'react';
import MessagesBox from './components/MessagesBox';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Hello! How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
    {
      id: 2,
      text: 'I need some assistance with my project.',
      sender: 'user',
      timestamp: new Date(),
    },
  ]);
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black">
      <main className="flex flex-col w-full h-screen p-6 gap-6" aria-label="Main chat interface">
        {/* Top section with Messages and Image side by side */}
        <div className="flex gap-6 flex-1" role="region" aria-label="Messages and vision display">
          {/* Messages Component */}
          <MessagesBox messages={messages} />

          {/* Image Box */}
          <div className="flex-1 bg-gradient-to-br from-purple-800 to-indigo-900 rounded-lg shadow-lg p-6 flex items-center justify-center border-2 border-purple-500" role="img" aria-label="Visual display area showing the vision of the realm">
            <div className="w-full h-full bg-gradient-to-br from-purple-700 to-black rounded flex items-center justify-center">
              <p className="text-purple-300 text-lg font-serif">Vision of the Realm</p>
            </div>
          </div>
        </div>

        {/* Bottom section with Send Message Box */}
        <div className="bg-gradient-to-r from-purple-800 to-indigo-800 rounded-lg shadow-lg p-6 border-2 border-purple-500" role="region" aria-label="Message input area">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Type your message..."
              aria-label="Message input field"
              className="flex-1 px-4 py-3 border-2 border-purple-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-opacity-75 bg-purple-900 text-white placeholder-purple-300 font-serif"
            />
            <button 
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg font-serif font-bold transition-all focus:outline-none focus:ring-2 focus:ring-purple-300"
              aria-label="Send message button"
            >
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
