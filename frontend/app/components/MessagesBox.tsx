'use client';

import React from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface MessagesBoxProps {
  messages: Message[];
}

export default function MessagesBox({ messages }: MessagesBoxProps) {

  return (
    <div className="flex-1 bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 overflow-y-auto border border-gray-200 dark:border-gray-700 flex flex-col">
      <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">
        Messages
      </h2>
      <div className="space-y-3 flex-1 overflow-y-auto mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-3 rounded ${
              message.sender === 'bot'
                ? 'bg-blue-100 dark:bg-blue-900 text-black dark:text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white ml-auto w-2/3'
            }`}
          >
            <p>{message.text}</p>
            <span className="text-xs opacity-70 mt-1 block">
              {message.timestamp.toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
