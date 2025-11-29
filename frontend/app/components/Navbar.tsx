'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearUser } = useUser();

  const isActive = (path: string) => pathname === path;

  const handleLeaveCampaign = () => {
    if (confirm('Are you sure you want to leave this campaign?')) {
      clearUser();
      router.push('/campaigns');
    }
  };

  return (
    <nav 
      className="bg-gradient-to-r from-purple-900 to-indigo-900 border-b-2 border-purple-500 shadow-lg"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-serif font-bold text-purple-100">
            🏰 DND Companion
          </div>
          
          <ul className="flex gap-8 items-center" role="list">
            <li role="listitem">
              <Link
                href="/"
                className={`font-serif font-semibold text-lg transition-all px-4 py-2 rounded-lg ${
                  isActive('/')
                    ? 'bg-purple-600 text-white border-b-2 border-purple-300'
                    : 'text-purple-200 hover:text-white hover:bg-purple-700/30'
                }`}
                aria-current={isActive('/') ? 'page' : undefined}
              >
                Chat
              </Link>
            </li>
            <li role="listitem">
              <Link
                href="/character-sheets"
                className={`font-serif font-semibold text-lg transition-all px-4 py-2 rounded-lg ${
                  isActive('/character-sheets')
                    ? 'bg-purple-600 text-white border-b-2 border-purple-300'
                    : 'text-purple-200 hover:text-white hover:bg-purple-700/30'
                }`}
                aria-current={isActive('/character-sheets') ? 'page' : undefined}
              >
                Character Sheets
              </Link>
            </li>
          
            {/* User character */}
            {user?.characterId && (
              <li role="listitem" className="flex items-center gap-3 ml-4 pl-4 border-l-2 border-purple-500">
                <span className="text-purple-200 font-serif text-sm">
                  {user.characterName ? `Character: ${user.characterName}` : `Character ID: ${user.characterId}`}
                </span>
              </li>
            )}

            {/* Campaign Info and Leave Button */}
            {user?.campaignCode && (
              <li role="listitem" className="flex items-center gap-3 ml-4 pl-4 border-l-2 border-purple-500">
                <span className="text-purple-200 font-serif text-sm">
                  {user.campaignName ? `Campaign: ${user.campaignName}` : 'In Campaign'}
                </span>
                <button
                  onClick={handleLeaveCampaign}
                  className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-serif font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-400"
                  aria-label="Leave campaign button"
                >
                  Leave
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

