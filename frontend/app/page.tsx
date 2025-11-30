'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MessagesBox from './components/MessagesBox';
import DiceRoller from './components/DiceRoller';
import { useUser } from './context/UserContext';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp?: Date;
}

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  // Redirect to campaign selection if no campaign is set
  useEffect(() => {
    if (!isLoading && !user?.campaignCode) {
      router.push('/campaigns');
    }
  }, [user, isLoading, router]);

  async function sendMessage(messageText: string) {
    if (!messageText || !messageText.trim()) return;

    try {
      // Send user message as before
      const url = `http://${process.env.NEXT_PUBLIC_API_URL}/messages`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: messageText,
          sender_id: user?.userId ?? null,
          campaign_code: user?.campaignCode ?? null,
          character_id: user?.characterId ?? null,
        }),
      });

      if (!resp.ok) throw new Error(`Server responded ${resp.status}`);

      const saved = await resp.json();
      setMessages((prev) => [...prev, saved]);
      setCurrentMessage('');
    } catch (err) {
      console.error('Failed to send message or get AI response', err);
    }
  }

  const [currentMessage, setCurrentMessage] = useState<string>('');

  const handleMessage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setCurrentMessage(event.target.value);
  }

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Fetch messages from backend API
    const fetchMessages = async () => {
      try {
        const url = `http://${process.env.NEXT_PUBLIC_API_URL}/messages`;
        const response = await fetch(url);
        const data = await response.json();

        const mapped = data.map((msg: any) => ({
          ...msg,
          sender: msg.sender_id === user?.userId ? 'user' : 'bot',
          timestamp: msg.timestamp ? new Date(msg.timestamp) : undefined,
        }));
        setMessages(mapped);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [user]);


  return (
    <div className="flex min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black">
      <main className="flex flex-col w-full h-screen p-6 gap-6" aria-label="Main chat interface">
        {/* Top section with Messages and Image side by side */}
        <div className="flex gap-6 flex-1 min-h-0" role="region" aria-label="Messages and vision display">
            {/* Messages Component and Image Box grouped - Dice roller will sit to the right */}
            <div className="flex-1 min-w-0 flex gap-6">
              <MessagesBox messages={messages} />

              {/* Image Box */}
              <div className="w-96 bg-gradient-to-br from-purple-800 to-indigo-900 rounded-lg shadow-lg p-6 flex items-center justify-center border-2 border-purple-500" role="img" aria-label="Visual display area showing the vision of the realm">
                <div className="w-full h-full bg-gradient-to-br from-purple-700 to-black rounded flex items-center justify-center">
                  <p className="text-purple-300 text-lg font-serif">Vision of the Realm</p>
                </div>
              </div>
            </div>

            {/* Dice Roller (side of the two boxes) */}
            <div className="w-72">
              <DiceRoller />
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
              value={currentMessage}
              onChange={(event) => handleMessage(event)}
            />
            <button 
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg font-serif font-bold transition-all focus:outline-none focus:ring-2 focus:ring-purple-300"
              aria-label="Send message button"
              onClick={() => sendMessage(currentMessage)}
            >
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
