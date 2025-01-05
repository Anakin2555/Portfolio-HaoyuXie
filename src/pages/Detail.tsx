import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { blogPosts } from '../data/blog-posts';
import { projects } from '../data/projects';

export default function Detail() {
  const { id } = useParams();
  const { theme } = useTheme();
  const location = useLocation();
  
  // 获取内容类型
  const type = location.pathname.split('/')[1];
  
  // 根据类型选择数据源
  const item = (() => {
    switch (type) {
      case 'blog':
        return blogPosts.find(post => post.id === id);
      case 'projects':
        return projects.find(project => project.id === id);
      default:
        return null;
    }
  })();

  if (!item) {
    return <div>Not found</div>;
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <article className="container mx-auto px-6 max-w-4xl">
        <Link 
          to={`/${type}`}
          className={`inline-flex items-center mb-8 ${
            theme === 'dark' 
              ? 'text-gray-400 hover:text-white' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to {type.charAt(0).toUpperCase() + type.slice(1)}
        </Link>

        <img
          src={item.image}
          alt={item.title}
          className="w-full object-cover rounded-xl mb-8"
        />

        {/* 博客特有的元数据 */}
        {type === 'blog' && (
          <div className={`flex items-center text-sm mb-4 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <time dateTime={item.date}>{item.date}</time>
            <span className="mx-2">•</span>
            <span className="flex items-center">
              <Clock size={16} className="mr-1" />
              {(item as any).readTime}
            </span>
          </div>
        )}

        {/* 项目特有的元数据 */}
        {type === 'projects' && (
          <div className={`flex flex-wrap gap-2 mb-4 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {(item as any).technologies?.map((tech: string) => (
              <span key={tech} className={`px-3 py-1 rounded-full ${
                theme === 'dark' 
                  ? 'bg-gray-800 text-gray-300' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {tech}
              </span>
            ))}
          </div>
        )}

        <h1 className={`text-4xl font-bold mb-6 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {item.title}
        </h1>
        
        <div className={`prose prose-lg max-w-none ${
          theme === 'dark' ? 'prose-invert' : ''
        }`}>
          <p className={`mb-4 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {item.excerpt}
          </p>
          <p className={
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }>
            {item.contentText.split('\n\n').map((paragraph, index) => (
              <React.Fragment key={index}>
                {paragraph}
                <br></br>
                <br></br>
              </React.Fragment>
            ))}
          </p>
        </div>

        {/* 项目特有的链接 */}
        {type === 'projects' && (
          <div className="mt-8 flex gap-4">
            {(item as any).demoUrl && (
              <a 
                href={(item as any).demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-6 py-2 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                Live Demo
              </a>
            )}
            {(item as any).githubUrl && (
              <a 
                href={(item as any).githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-6 py-2 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-700 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}
              >
                View Code
              </a>
            )}
          </div>
        )}
      </article>
    </div>
  );
}