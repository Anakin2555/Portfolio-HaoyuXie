import { useEffect, useState } from 'react';
import {Github, Mail} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import AnimatedText from './AnimatedText';
import {BilibiliWhite,BilibiliBlack} from '../icon/bilibili';
export default function Hero() {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      className={`min-h-screen relative overflow-hidden ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-transparent to-transparent animate-pulse"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDEwMSwgMTAwLCAyNTUsIDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
      </div>

      <div className="container mx-auto px-6 relative">
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
          <div className={`mb-8 relative transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 relative z-10 animate-profile-image">
              <img
                src="https://avatars.githubusercontent.com/u/60338576?v=4"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
          </div>

          <h1 className={`text-6xl font-bold mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            
            {/*标题内容*/}
            <AnimatedText text="Hi, I'm Haoyu Xie" delay={50} />
            
            
          </h1>

          <p className={`text-xl mb-12 max-w-2xl transform transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          } ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            
            {/*自我介绍*/}
            A passionate <b>Front-End Developer</b> and <b>UX Designer</b> aspiring to excel as an independent developer.
            
          </p>

          <div className={`flex justify-center space-x-6 mb-12 transform transition-all duration-1000 delay-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            {[
              {
                icon: Github,
                href: 'https://github.com/Anakin2555',
                label: 'GitHub',
              },
              {
                icon: theme==='dark'?BilibiliWhite:BilibiliBlack,
                href: 'https://space.bilibili.com/430103599?spm_id_from=333.1007.0.0',
                label: 'Bilibili',
              },
              {
                icon: Mail,
                href: 'mailto:your-email@example.com',
                label: 'Email',
              },
            ].map(({ icon: Icon, href, label }, index) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className={`p-4 rounded-full transform hover:scale-110 transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                } shadow-lg animate-fade-in`}
                style={{ animationDelay: `${800 + index * 200}ms` }}
              >
                <Icon size={24} />
              </a>
            ))}
          </div>

          <div className={`animate-bounce-slow transform transition-all duration-1000 delay-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <a
              href="#projects"
              aria-label="Scroll to projects"
              className="inline-block"
            >
              <svg
                className={`w-8 h-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}