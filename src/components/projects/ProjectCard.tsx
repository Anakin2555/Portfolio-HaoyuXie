import { ExternalLink, Github } from 'lucide-react';
import { Project } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { theme } = useTheme();

  return (
    <Link to={`/projects/${project.id}`} className="block">
      <div className={`w-full rounded-xl shadow-fuchsia-700 overflow-hidden ${
        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
      }`}>
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-auto"
        />
        <div className="p-6">
          <h2 className={`text-xl font-semibold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {project.title}
          </h2>
          <p className={`mb-4 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {project.excerpt}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className={`px-3 py-1 rounded-full text-sm ${
                  theme === 'dark' 
                    ? 'bg-blue-900/50 text-blue-200' 
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex space-x-4">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                className={`inline-flex items-center ${
                  theme === 'dark' 
                    ? 'text-blue-400 hover:text-blue-300' 
                    : 'text-blue-600 hover:text-blue-800'
                }`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={18} className="mr-1" />
                Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                className={`inline-flex items-center ${
                  theme === 'dark' 
                    ? 'text-gray-300 hover:text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={18} className="mr-1" />
                Source Code
              </a>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}