import React, {  useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
// import { blogPosts } from '../data/blog-posts';
// import { projects } from '../data/projects';
import MessageBoard from './components/layout/MessageBoard';
import { BlogPost, Project } from '../types';
import ReactMarkdown from 'react-markdown';
import projectService from '../services/projectService';
import BlogService from '../services/blogService';
import { useLanguage } from '../context/LanguageContext';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { FILE_URL, IMG_URL } from '../utils/api';
// Add type definition for code component props
interface CodeProps extends React.ComponentPropsWithoutRef<'code'> {
  inline?: boolean;
  node?: any;
}

export default function Detail() {
  const { id } = useParams<{ id: string }>();
  const { theme } = useTheme();
  const location = useLocation();
  const {language} = useLanguage();

  const [item, setItem] = useState<BlogPost | Project | null>(null);
  const [markdownContent, setMarkdownContent] = useState<string>('');

  // 获取内容类型
  const type = location.pathname.split('/')[1];
  
  // 第一个useEffect仅负责获取项目
  useEffect(() => {
    if (id && type) {
      if (type === 'projects') {
        projectService.getProjectById(id, language).then((project) => {
          setItem(project);
        });
      } else if (type === 'blogs') {
        if(id){
          BlogService.getBlogPostById(id,language).then((blogPost) => {
          setItem(blogPost);
        });
      }
      }
    }
  }, [id, type, language]);

  // 第二个useEffect监听item变化，获取Markdown内容
  useEffect(() => {
    const fetchMarkdownContent = async () => {
      if (item) {
        try {
          let fileUrl = '';
          if(type==='projects'){
            fileUrl = `${FILE_URL}/project/${(item as Project).contentFile}`;
          }else{
            fileUrl = `${FILE_URL}/blog/${(item as BlogPost).contentFile}`;
          }
          
          const response = await fetch(fileUrl);
          
          if (!response.ok) {
            throw new Error(`Failed to fetch markdown: ${response.status}`);
          }
          
          const markdownText = await response.text();
          setMarkdownContent(markdownText);
        } catch (error) {
          console.error('Error loading markdown file:', error);
        }
      }
    };
    
    fetchMarkdownContent();
  }, [item, type]); // 当item或type改变时执行

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



          {/* 博客特有的元数据 */}
          {type === 'blogs' && (
            <div className={`flex items-center text-sm mb-4 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <time dateTime={(item as BlogPost).date}>{(item as BlogPost).date}</time>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                <Clock size={16} className="mr-1" />
                {(item as BlogPost).readTime}
              </span>
            </div>
          )}








          {/* 大图 */}
          <img
            src={type==='blogs' ? `${IMG_URL}/${(item as BlogPost).image}` : `${IMG_URL}/${(item as Project).image}`}
            alt={item.title}
            className="w-full object-cover rounded-xl mb-8"
          />




          <div className={
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }>
            {
              // type === 'blogs' ? 
              // (item as BlogPost).content.split('\n\n').map((paragraph: string, index: number) => (
              //   <React.Fragment key={index}>
              //     {paragraph}
              //     <br />
              //     <br />
              //   </React.Fragment>
              // )) : 


              // MarkDown渲染
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeRaw, rehypeKatex]}
                components={{
                  // 代码块渲染
                  code({ node, inline, className, children, ...props }: CodeProps) {
                    const match = /language-(\w+)/.exec(className || '')
                    const code = String(children).replace(/\n$/, '')

                    return !inline && match ? (
                      <div className="relative">
                        {/* 代码语言标签 */}
                        <div className="absolute right-2 top-2 text-xs text-gray-400">
                          {match[1]}
                        </div>
                        
                        {/* 复制按钮 */}
                        <button
                          onClick={() => navigator.clipboard.writeText(code)}
                          className="absolute right-2 top-8 p-1 text-xs bg-gray-700 rounded hover:bg-gray-600"
                        >
                          Copy
                        </button>

                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-lg !bg-gray-800"
                          showLineNumbers={true}
                          wrapLines={true}
                          {...props}
                        >
                          {code}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className={`${className} bg-gray-100 rounded px-1`} {...props}>
                        {children}
                      </code>
                    )
                  },
                  // 图片渲染优化
                  img({ node, ...props }) {
                    return (
                      <img
                        {...props}
                        className="rounded-lg max-w-full h-auto my-4"
                        loading="lazy"
                        alt={props.alt || ''}
                      />
                    )
                  },
                  // 标题渲染
                  h1: ({ node, ...props }) => <h1 className="text-3xl font-bold my-4" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-2xl font-bold my-3" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-xl font-bold my-2" {...props} />,
                  // 引用块样式
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-gray-300 pl-4 my-4 italic" {...props} />
                  ),
                }}
              >
               {markdownContent}
              </ReactMarkdown>
            }
          </div>
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

          <MessageBoard pageId={location.pathname.slice(1).replace('/', '-')} />
      </article>
    </div>
  );
}