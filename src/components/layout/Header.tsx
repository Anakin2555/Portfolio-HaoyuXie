import { Moon, Sun, Languages } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import MusicPlayer from '../MusicPlayer';
import userProfile from '../../assets/icon/user-profile.png'
import Navigation from './Navigation';
import { useLanguage } from '../../context/LanguageContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  // Add focus management
  const enButtonRef = useRef<HTMLButtonElement>(null);
  const zhButtonRef = useRef<HTMLButtonElement>(null);

  const handleLanguageSelect = (selectedLang: 'en' | 'zh') => {
    if (language !== selectedLang) {
      toggleLanguage();
    }
    setShowLanguageMenu(false);
  };

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

  useEffect(() => {
    if (showLanguageMenu) {
      // Focus the current language button when menu opens
      // if (language === 'en') {
      //   enButtonRef.current?.focus();
      // } else {
      //   zhButtonRef.current?.focus();
      // }
    }
  }, [showLanguageMenu, language]);

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

          {/* Right side - Language Toggle, Theme Toggle & Profile Image */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onMouseEnter={() => setShowLanguageMenu(true)}
                onMouseLeave={() => setShowLanguageMenu(false)}
                className={`p-2 rounded-lg ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-800'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-label="Change language"
                aria-haspopup="true"
              >
                <Languages size={20} />
              </button>

              {/* Language Toggle Menu */}
              {showLanguageMenu && (
                <div
                  onMouseEnter={() => setShowLanguageMenu(true)}
                  onMouseLeave={() => setShowLanguageMenu(false)}
                  className={`absolute right-0 w-28 rounded-lg shadow-lg ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border border-gray-700' 
                      : 'bg-white border border-gray-200'
                  } py-1`}
                  role="menu"
                  aria-orientation="vertical"
                >
                  <button
                    ref={enButtonRef}
                    onClick={() => handleLanguageSelect('en')}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    } ${language === 'en' ? 'font-semibold bg-opacity-50 dark:text-white text-black' : ''}`}
                    role="menuitem"
                    tabIndex={language === 'en' ? 0 : -1}
                  >
                    English
                  </button>
                  <button
                    ref={zhButtonRef}
                    onClick={() => handleLanguageSelect('zh')}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    } ${language === 'zh' ? 'font-semibold bg-opacity-50 dark:text-white text-black' : ''}`}
                    role="menuitem"
                    tabIndex={language === 'zh' ? 0 : -1}
                  >
                    简体中文
                  </button>
                </div>
              )}
            </div>
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