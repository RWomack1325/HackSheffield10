'use client';

import React, { useEffect, useRef } from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp?: Date;
}

interface MessagesBoxProps {
  messages: Message[];
}

export default function MessagesBox({ messages }: MessagesBoxProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 min-h-0 bg-gradient-to-br from-purple-800 to-indigo-900 rounded-lg shadow-lg p-6 overflow-y-auto border-2 border-purple-500 flex flex-col" role="region" aria-label="Message history">
      <h2 className="text-xl font-serif font-bold mb-4 text-purple-100" id="messages-heading">
        Messages
      </h2>
      <div className="space-y-3 flex-1 overflow-y-auto mb-4" role="log" aria-labelledby="messages-heading" aria-live="polite" aria-atomic="false">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-3 rounded ${
              message.sender === 'bot'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-purple-50 border-l-4 border-purple-300'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-purple-50 ml-auto w-2/3 border-r-4 border-pink-300'
            }`}
            role="article"
            aria-label={`Message from ${message.sender === 'bot' ? 'assistant' : 'you'}`}
          >
            <p className="font-serif text-base leading-relaxed">{message.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
