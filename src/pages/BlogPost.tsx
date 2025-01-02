import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { blogPosts } from '../data/blog-posts';
import { useTheme } from '../context/ThemeContext';

export default function BlogPost() {
  const { id } = useParams();
  const post = blogPosts.find(post => post.id === id);
  const { theme } = useTheme();

  if (!post) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h1>
          <Link to="/blog" className="text-white hover:text-white">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <article className="container mx-auto px-6 max-w-4xl">
        <Link 
          to="/blog" 
          className={`inline-flex items-center mb-8 ${
            theme === 'dark' 
              ? 'text-gray-400 hover:text-white' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Blog
        </Link>

        <img
          src={post.image}
          alt={post.title}
          className="w-full h-[400px] object-cover rounded-xl mb-8"
        />

        <div className={`flex items-center text-sm mb-4 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <time dateTime={post.date}>{post.date}</time>
          <span className="mx-2">•</span>
          <span className="flex items-center">
            <Clock size={16} className="mr-1" />
            {post.readTime}
          </span>
        </div>

        <h1 className={`text-4xl font-bold mb-6 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {post.title}
        </h1>
        
        <div className={`prose prose-lg max-w-none ${
          theme === 'dark' ? 'prose-invert' : ''
        }`}>
          <p className={`mb-4 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {post.excerpt}
          </p>
          <p className={
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
            nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            <br>
            </br>
            <br>
            </br>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
            nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            <br>
            </br>
            <br>
            </br>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
            nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            <br>
            </br>
            <br>
            </br>
            <br>
            </br>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
            nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            <br>
            </br>
            <br>
            </br>
            <br>
            </br>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
            nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
      </article>
    </div>
  );
}