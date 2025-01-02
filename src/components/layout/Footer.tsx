import { Github, Linkedin, Mail } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer className={`${
      theme === 'dark' 
        ? 'bg-gray-800 text-white' 
        : 'bg-gray-100 text-gray-900'
    }`}>
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className={`text-xl font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Contact</h3>
            <div className="flex space-x-4">
              <a href="https://github.com" className={`${
                theme === 'dark' 
                  ? 'text-gray-300 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}>
                <Github size={20} />
              </a>
              <a href="https://linkedin.com" className={`${
                theme === 'dark' 
                  ? 'text-gray-300 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}>
                <Linkedin size={20} />
              </a>
              <a href="mailto:example@email.com" className={`${
                theme === 'dark' 
                  ? 'text-gray-300 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}>
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className={`text-xl font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Quick Links</h3>
            <ul className="space-y-2">
              {['Projects', 'Blog', 'Thoughts'].map(link => (
                <li key={link}>
                  <a href={`/${link.toLowerCase()}`} className={`${
                    theme === 'dark' 
                      ? 'text-gray-300 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}>{link}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className={`text-xl font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Newsletter</h3>
            <p className={`mb-4 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>Subscribe to get the latest updates</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className={`px-4 py-2 rounded-l-lg w-full ${
                  theme === 'dark' 
                    ? 'bg-gray-800 text-white border-gray-700' 
                    : 'bg-white text-gray-900 border-gray-200'
                }`}
              />
              <button className={`px-4 py-2 rounded-r-lg ${
                theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}>
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className={`border-t ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        } mt-8 pt-8 text-center ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          <p>© {new Date().getFullYear()} Your Name. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}