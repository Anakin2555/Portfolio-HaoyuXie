import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Navigation from './Navigation';

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gray-900/90 backdrop-blur-md'
          : 'bg-white/90 backdrop-blur-md'
      }`}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - GitHub icon */}
          <a
            href="https://github.com/Anakin2555"
            className={`${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            } hover:opacity-75 transition-opacity`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                clipRule="evenodd"
              />
            </svg>
          </a>

          {/* Center - Navigation Links */}
          <Navigation />

          {/* Right side - Theme Toggle & Profile Image */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${
                theme === 'dark'
                  ? 'text-gray-300 hover:bg-gray-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <img
              src="https://avatars.githubusercontent.com/u/60338576?v=4"
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </div>
      </nav>
    </header>
  );
}