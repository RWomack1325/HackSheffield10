'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

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
          </ul>
        </div>
      </div>
    </nav>
  );
}
