// import * as Icons from 'lucide-react';
import { Thought } from '../../types';
// import { LucideIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ThoughtCardProps {
  thought: Thought;
  isExpanded: boolean;
  onToggle: (id: string, expanded: boolean) => void;
}

export function ThoughtCard({ thought, isExpanded, onToggle }: ThoughtCardProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState('100px');

  useEffect(() => {
    if (isExpanded && contentRef.current) {
      const fullHeight = contentRef.current.scrollHeight + 20; // 添加 padding 缓冲
      setMaxHeight(`${fullHeight}px`);
    } else {
      setMaxHeight('50px');
    }
  }, [isExpanded, thought.fullContent]); // 当内容变化时重新计算

  // const Icon: LucideIcon = Icons[thought.icon as keyof typeof Icons] as LucideIcon;

  return (
    <div
      className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
      onMouseEnter={() => onToggle(thought.id, true)}
      onMouseLeave={() => onToggle(thought.id, false)}
    >
      <div className="flex items-start gap-6">
        {/* <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg shrink-0">
          {Icon && <Icon className="text-blue-600 dark:text-blue-400" size={24} />}
        </div> */}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 overflow-hidden whitespace-nowrap text-ellipsis">
            {thought.title}
          </h2>
          <time className="text-sm text-gray-500 dark:text-gray-400 mb-4 block">
            {thought.date.slice(0,10)}
          </time>
          <div 
            ref={contentRef}
            className={`prose prose-lg max-w-none overflow-hidden text-gray-900 dark:text-gray-100 transition-all duration-[0.5s] ease-in-out ${
              isExpanded ? 'opacity-100' : 'opacity-70'
            }`}
            style={{ height: isExpanded ? maxHeight : '50px' }}
          >
            {isExpanded ? thought.fullContent : thought.content}
          </div>
        </div>
      </div>
    </div>
  );
} 