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
    <div className="flex min-h-screen bg-gray-100 dark:bg-black">
      <main className="flex flex-col w-full h-screen p-6 gap-6">
        {/* Top section with Messages and Image side by side */}
        <div className="flex gap-6 flex-1">
          {/* Messages Component */}
          <MessagesBox messages={messages} />

          {/* Image Box */}
          <div className="flex-1 bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 flex items-center justify-center border border-gray-200 dark:border-gray-700">
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">Image Placeholder</p>
            </div>
          </div>
        </div>

        {/* Bottom section with Send Message Box */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            />
            <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
