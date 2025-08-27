import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
interface MarkdownPreviewProps {
  content: string;
}
interface CodeProps extends React.ComponentPropsWithoutRef<'code'> {
  inline?: boolean;
  node?: any;
}
const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content }) => {
  return (
    <div className="markdown-preview">
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
               {content}
      </ReactMarkdown>    
    </div>
  );
};

export default MarkdownPreview; 