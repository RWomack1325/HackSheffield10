'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';

export default function CampaignSelection() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [campaignCode, setCampaignCode] = useState<string>('');
  const [campaignName, setCampaignName] = useState<string>('');
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [error, setError] = useState<string>('');

  const generateCampaignCode = () => {
    return `campaign_${Date.now()}`;
  };

  const generateUserId = () => {
    return `user_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleStartCampaign = async () => {
    if (!campaignName.trim()) {
      setError('Please enter a campaign name');
      return;
    }

    const campaignCode = generateCampaignCode();
    const userId = user?.userId || generateUserId();

    try {
      const url = `http://${process.env.NEXT_PUBLIC_API_URL}/campaign`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignName: campaignName,
          campaignCode: campaignCode,
        }),
      });

      if (!resp.ok) throw new Error(`Server responded ${resp.status}`);

      setUser({
        userId,
        characterId: '', // Will be set when character is created
        campaignName,
        campaignCode,
      });

      router.push('/character-sheets');
    } catch (err) {
      setError('Failed to create campaign');
      console.error('Failed to create campaign', err);
    }
  };

  const handleJoinCampaign = async () => {
    if (!campaignName.trim()) {
      setError('Please enter a campaign name');
      return;
    }

    const userId = user?.userId || generateUserId();

    try {
      const url = `http://${process.env.NEXT_PUBLIC_API_URL}/campaign?campaignName=${encodeURIComponent(campaignName)}`;
      const resp = await fetch(url, {
        method: 'GET',
      });

      if (!resp.ok) {
        setError('Please enter a valid campaign name');
        return;
      }

      const resp_json = await resp.json();

      setUser({
        userId,
        characterId: '', // Will be set when character is created
        campaignCode: resp_json.campaignCode,
        campaignName: resp_json.campaignName,
      });

      router.push('/character-sheets');
    } catch (err) {
      setError('Failed to join campaign');
      console.error('Failed to join campaign', err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black">
      <main className="flex flex-col w-full items-center justify-center p-6" aria-label="Campaign selection page">
        <div className="max-w-md w-full space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-serif font-bold text-purple-100 mb-2">
              🏰 DND Companion
            </h1>
            <p className="text-purple-300 font-serif">Begin your adventure</p>
          </div>

          {error && (
            <div
              className="bg-red-900/50 border-2 border-red-500 rounded-lg p-4 text-red-200 font-serif"
              role="alert"
            >
              {error}
            </div>
          )}

          {!showJoinForm ? (
            <div className="space-y-4">
              {/* Start Campaign Card */}
              <div className="bg-gradient-to-br from-purple-800 to-indigo-900 rounded-lg shadow-lg p-6 border-2 border-purple-500 hover:border-purple-300 transition-all">
                <h2 className="text-2xl font-serif font-bold text-purple-100 mb-4">
                  Start New Campaign
                </h2>
                <p className="text-purple-300 font-serif mb-4">
                  Create a new campaign and invite friends to join
                </p>
                <input
                  type="text"
                  placeholder="Enter campaign name..."
                  value={campaignName}
                  onChange={(e) => {
                    setCampaignName(e.target.value);
                    setError('');
                  }}
                  className="w-full px-4 py-3 border-2 border-purple-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 bg-purple-900 text-white placeholder-purple-300 font-serif mb-4"
                  aria-label="Campaign name input"
                />
                <button
                  onClick={handleStartCampaign}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg font-serif font-bold transition-all focus:outline-none focus:ring-2 focus:ring-purple-300"
                  aria-label="Start new campaign button"
                >
                  Start Campaign
                </button>
              </div>

              {/* Join Campaign Card */}
              <div className="bg-gradient-to-br from-purple-800 to-indigo-900 rounded-lg shadow-lg p-6 border-2 border-purple-500 hover:border-purple-300 transition-all">
                <h2 className="text-2xl font-serif font-bold text-purple-100 mb-4">
                  Join Existing Campaign
                </h2>
                <p className="text-purple-300 font-serif mb-4">
                  Join a campaign using an invitation code
                </p>
                <button
                  onClick={() => {
                    setShowJoinForm(true);
                    setError('');
                  }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-serif font-bold transition-all focus:outline-none focus:ring-2 focus:ring-purple-300"
                  aria-label="Join campaign button"
                >
                  Join Campaign
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-purple-800 to-indigo-900 rounded-lg shadow-lg p-6 border-2 border-purple-500 space-y-4">
              <h2 className="text-2xl font-serif font-bold text-purple-100">
                Join Campaign
              </h2>
              <input
                type="text"
                placeholder="Enter campaign name to join..."
                value={campaignName}
                onChange={(e) => {
                  setCampaignName(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-3 border-2 border-purple-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 bg-purple-900 text-white placeholder-purple-300 font-serif"
                aria-label="Campaign name input"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleJoinCampaign}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg font-serif font-bold transition-all focus:outline-none focus:ring-2 focus:ring-purple-300"
                  aria-label="Confirm join campaign button"
                >
                  Join
                </button>
                <button
                  onClick={() => {
                    setShowJoinForm(false);
                    setCampaignName('');
                  }}
                  className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-serif font-bold transition-all focus:outline-none focus:ring-2 focus:ring-gray-300"
                  aria-label="Cancel join campaign button"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
