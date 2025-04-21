import { useTheme } from '../../../context/ThemeContext';

export default function Footer() {
  const { theme } = useTheme();
  
  
  return (
    <footer className={`${
      theme === 'dark' 
        ? 'bg-gray-900 text-white' 
        : 'bg-white text-gray-900'
    }`}>        
        <div className={`border-t mb-10 ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        } mt-4 pt-8 text-center text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <p>© {new Date().getFullYear()} Haoyu Xie. All rights reserved.</p>
          <p>Made with love and 🍰</p>
        </div>
    </footer>
  );
}