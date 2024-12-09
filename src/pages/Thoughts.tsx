import { useState } from 'react';
import { BookOpen, Coffee, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

const thoughts = [
  {
    id: '1',
    title: 'The Joy of Learning',
    content: 'Reflecting on my journey in tech and the importance of continuous learning...',
    fullContent: `Learning is a never-ending journey in the tech world. Every day brings new challenges and opportunities to grow. I've found that maintaining a growth mindset and embracing challenges has been crucial to my development as a software engineer.

    Some key lessons I've learned:
    • Stay curious and open to new technologies
    • Build projects to reinforce learning
    • Share knowledge with others
    • Focus on fundamentals first
    • Practice consistently`,
    date: '2024-03-15',
    icon: BookOpen,
  },
  {
    id: '2',
    title: 'Building in Public',
    content: 'Why sharing your work and learning process can benefit both you and others...',
    fullContent: `Building in public has transformed my approach to development. It's not just about sharing the final product, but the entire journey - including the struggles and failures. This transparency helps create authentic connections and provides valuable learning opportunities for others.`,
    date: '2024-03-10',
    icon: Coffee,
  },
  {
    id: '3',
    title: 'Future of Web Development',
    content: 'My thoughts on upcoming trends and technologies in web development...',
    fullContent: `The web development landscape is constantly evolving. From AI-powered development tools to WebAssembly and Edge Computing, we're seeing exciting new possibilities emerge. As developers, it's crucial to stay informed while maintaining a strong foundation in the fundamentals.`,
    date: '2024-03-05',
    icon: Lightbulb,
  },
];

export default function Thoughts() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Thoughts & Musings</h1>
          <p className="text-xl text-gray-600">
            Personal reflections on technology, career, and life as a developer.
          </p>
        </header>

        <div className="space-y-8">
          {thoughts.map((thought) => {
            const Icon = thought.icon;
            const isExpanded = expandedId === thought.id;

            return (
              <article 
                key={thought.id}
                className="bg-white rounded-xl shadow-lg p-8 transition-all duration-300"
              >
                <div className="flex items-start gap-6">
                  <div className="bg-blue-100 p-4 rounded-lg">
                    <Icon className="text-blue-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        {thought.title}
                      </h2>
                      <button
                        onClick={() => toggleExpand(thought.id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {isExpanded ? (
                          <ChevronUp size={24} />
                        ) : (
                          <ChevronDown size={24} />
                        )}
                      </button>
                    </div>
                    <time className="text-sm text-gray-500 mb-4 block">
                      {thought.date}
                    </time>
                    <div className={`prose prose-lg max-w-none ${
                      isExpanded ? 'block' : 'line-clamp-3'
                    }`}>
                      {isExpanded ? thought.fullContent : thought.content}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}