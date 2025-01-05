import * as Icons from 'lucide-react';
import { Thought } from '../../types';
import { LucideIcon } from 'lucide-react';

interface ThoughtCardProps {
  thought: Thought;
  isExpanded: boolean;
  onToggle: (id: string, expanded: boolean) => void;
}

export function ThoughtCard({ thought, isExpanded, onToggle }: ThoughtCardProps) {
  const Icon: LucideIcon = Icons[thought.icon as keyof typeof Icons] as LucideIcon;

  return (
    <div
      className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
      onMouseEnter={() => onToggle(thought.id, true)}
      onMouseLeave={() => onToggle(thought.id, false)}
    >
      <div className="flex items-start gap-6">
        <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg shrink-0">
          {Icon && <Icon className="text-blue-600 dark:text-blue-400" size={24} />}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 overflow-hidden whitespace-nowrap text-ellipsis">
            {thought.title}
          </h2>
          <time className="text-sm text-gray-500 dark:text-gray-400 mb-4 block">
            {thought.date}
          </time>
          <div 
            className={`prose prose-lg max-w-none overflow-hidden text-gray-900 dark:text-gray-100 transition-max-height ${
              isExpanded ? 'max-h-[800px]' : 'max-h-[100px]'
            }`}
          > 
            {isExpanded ? thought.fullContent : thought.content}
          </div>
        </div>
      </div>
    </div>
  );
} 