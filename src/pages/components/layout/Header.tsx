import { Moon, Sun, Languages } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import MusicPlayer from './MusicPlayer';
import userProfile from '../../../assets/img/user-profile.png'
import Navigation from './Navigation';
import { useLanguage } from '../../../context/LanguageContext';
import LoginModal from '../auth/LoginModal';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { logoutAdmin, getVisitorInfo } from '../../../store/slices/userSlice';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pressCount, setPressCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const lastPressTime = useRef<number>(0);
  
  const dispatch = useAppDispatch();
  const { currentUser, visitorInfo } = useAppSelector((state) => state.user);

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
    if (!currentUser) {
      dispatch(getVisitorInfo());
    }
  }, [currentUser, dispatch]);

  const handlePressStart = () => {
    if (currentUser) return; // 已登录不触发

    pressTimer.current = setTimeout(() => {
      const now = Date.now();
      if (lastPressTime.current && (now - lastPressTime.current) < 2000) {
        setPressCount(prev => prev + 1);
        if (pressCount === 1) {
          setIsLoginModalOpen(true);
          setPressCount(0);
        }
      } else {
        setPressCount(1);
      }
      lastPressTime.current = now;
    }, 1000);
  };

  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
  };

  // 清理定时器
  useEffect(() => {
    const resetTimer = setTimeout(() => {
      setPressCount(0);
    }, 2000);

    return () => clearTimeout(resetTimer);
  }, [pressCount]);

  // const handleLogin = () => {
  //   setIsLoginModalOpen(true);
  // };

  const handleLogout = () => {
    dispatch(logoutAdmin());
  };

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

            {/* Theme Toggle */}
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

            {/* User Profile Section */}
            <div 
              className="relative"
              onMouseEnter={() => currentUser && setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <div 
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                  theme === 'dark' 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onMouseDown={handlePressStart}
                onMouseUp={handlePressEnd}
                onMouseLeave={handlePressEnd}
                onTouchStart={handlePressStart}
                onTouchEnd={handlePressEnd}
              >
                {currentUser ? (
                  <>
                    <img
                      src={userProfile}
                      alt="Admin"
                      className="w-6 h-6 rounded-full"
                    />
                    <span className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Admin
                    </span>
                  </>
                ) : (
                  <>
                    <svg 
                      className={`w-5 h-5 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 1024 1024"
                    >
                      <path d="M512.010745 1022.082324c-282.335297 0-511.220241-228.798986-511.220241-511.036046C0.790504 228.798986 229.675448 0 512.010745 0c282.312784 0 511.198751 228.798986 511.198751 511.046279C1023.208473 793.285385 794.322505 1022.082324 512.010745 1022.082324zM512.010745 95.826486c-229.385341 0-415.371242 185.884594-415.371242 415.220816 0 107.22714 41.021276 204.6551 107.802238 278.339286 60.140729-29.092595 38.062897-4.88424 116.77254-37.274952 80.539314-33.089629 99.610672-44.639686 99.610672-44.639686l0.776689-76.29464c0 0-30.169113-22.890336-39.543621-94.683453-18.895349 5.426593-25.108864-21.988804-26.237571-39.429011-1.001817-16.863063-10.926864-69.487607 12.105712-64.739467-4.714372-35.144428-8.094352-66.844407-6.417153-83.633792 5.763261-58.938344 62.97324-120.518864 151.105486-125.017318 103.665011 4.486174 144.737452 66.028832 150.500713 124.9682 1.680269 16.800641-2.028193 48.511877-6.739495 83.594907 23.025413-4.686742 13.028735 47.861054 11.901051 64.726164-1.028423 17.440208-7.394411 44.756343-26.208918 39.34203-9.42158 71.79107-39.593763 94.498234-39.593763 94.498234l0.725524 75.924203c0 0 19.070334 10.788717 99.609649 43.892673 78.70862 32.387641 56.605206 9.609869 116.77561 38.765909 66.75231-73.686233 107.772562-171.101913 107.772562-278.339286C927.356404 281.712103 741.398132 95.826486 512.010745 95.826486z" />
                    </svg>
                    {visitorInfo && (
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {visitorInfo.name}
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Admin Dropdown */}
              {currentUser && showDropdown && (
                <div 
                  className={`absolute right-0 w-28 rounded-lg shadow-lg ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border border-gray-700' 
                      : 'bg-white border border-gray-200'
                  } py-1`}
                  role="menu"
                  aria-orientation="vertical"
                >
                  <button
                    onClick={handleLogout}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    role="menuitem"
                  >
                    {language === 'en' ? 'Logout' : '登出'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => setIsLoginModalOpen(false)}
      />
    </header>
  );
}