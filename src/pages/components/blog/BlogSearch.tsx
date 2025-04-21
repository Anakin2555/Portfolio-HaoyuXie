import { Search } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface BlogSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}



export default function BlogSearch({ searchQuery, onSearchChange }: BlogSearchProps) {
  const { theme } = useTheme();

  return (
    <div className="relative mb-8">
      <input
        type="text"
        placeholder="Search blog posts..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className={`w-full px-4 py-3 pl-12 rounded-lg ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500'
            : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
        } focus:ring-1 focus:ring-blue-500`}
      />
      <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
      }`} size={20} />
    </div>
  );
}