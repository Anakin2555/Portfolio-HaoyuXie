import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import MusicPlayer from '../MusicPlayer';
import userProfile from '../../assets/img/user-profile.png'
import Navigation from './Navigation';

export default function Header() {
  const { theme, toggleTheme } = useTheme();  
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled
        ? theme === 'dark'
          ? 'bg-gray-900/80 backdrop-blur-md'
          : 'bg-white/80 backdrop-blur-md'
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - GitHub icon and Music Player */}
          <div className="flex items-center space-x-4">
            {/* <a
              href="https://github.com/Anakin2555"
              className={`${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              } hover:opacity-75 transition-opacity`}
              target="_blank"
              rel="noopener noreferrer"
              title="Visit my GitHub profile"
            >
              <Github size={24} />
            </a> */}
            <MusicPlayer />
          </div>

          {/* Center - Navigation */}
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
              src={userProfile}
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </div>
      </div>
    </header>
  );
}