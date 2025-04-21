import { useState, useMemo, useEffect } from 'react';
import BlogCard from './components/blog/BlogCard';
import BlogSearch from './components/blog/BlogSearch';
import MessageBoard from './components/layout/MessageBoard';
import BlogService from '../services/blogService';
import { BlogPost } from '../types';
import Thoughts from './Thoughts';
import { useLanguage } from '../context/LanguageContext'; 
import { translations } from '../data/translations';
export default function Blogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const {language} = useLanguage();
  const t = translations[language];

  const filteredPosts = useMemo(() => {
    if (!searchQuery) return blogPosts;
    const query = searchQuery.toLowerCase();
    return blogPosts.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query)
    );
  }, [searchQuery,blogPosts]);


  // 获取博客列表
  useEffect(() => {
    BlogService.getBlogPosts(language).then((blogPosts) => {
      setBlogPosts(blogPosts);
      console.log('BlogPosts',blogPosts);
      
    });
  }, [language]);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {t.section.blogs.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {t.section.blogs.description}
          </p>
        </header>

        <BlogSearch 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No blog posts found matching your search.</p>
          </div>
        )}

        <Thoughts/>

        <MessageBoard pageId="blog" />
      </div>
    </div>
  );
}