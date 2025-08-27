import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { BlogPost } from '../../../types';
import { useTheme } from '../../../context/ThemeContext';
import { IMG_URL } from '../../../utils/api';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const { theme } = useTheme();

  return (
    <Link 
      to={`/blogs/${post.id}`}
      className={`rounded-xl shadow-lg overflow-hidden ${
        theme === 'dark' ? 'bg-gray-700' : 'bg-white'
      }`}>
      <img
        src={`${IMG_URL}/${post.image}`}  
        alt={post.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className={`flex items-center text-sm mb-2 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <time dateTime={post.date}>{post.date}</time>
          <span className="mx-2">•</span>
          <span className="flex items-center">
            <Clock size={16} className="mr-1" />
            {post.readTime}
          </span>
        </div>
        <h3 className={`text-xl font-semibold mb-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          <div className={`hover:${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
          }`}>
            {post.title}
          </div>
        </h3>
        <p className={`${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {post.excerpt}
        </p>
        <div
        
          className={`inline-block mt-4 ${
            theme === 'dark' 
              ? 'text-blue-400 hover:text-blue-300' 
              : 'text-blue-600 hover:text-blue-800'
          }`}
        >
          Read More →
        </div>
      </div>
    </Link>
  );
}