import { ExternalLink, Github } from 'lucide-react';
import { Project } from '../../../types';
import { useTheme } from '../../../context/ThemeContext';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;   
  type: 'home' | 'projectList';
}

export default function ProjectCard({ project, type }: ProjectCardProps) {
  const { theme } = useTheme();

  return (
    <Link to={`/projects/${project.id}`} className="block w-full">
      <div className={`relative w-full rounded-xl shadow-fuchsia-700 overflow-hidden group ${
        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
        <img
          src={`https://raw.githubusercontent.com/anakin2555/pic/master/img/${project.image}`}
          alt={project.title}
          className={`object-cover object-top w-full ${type === 'home' ? 'h-[500px]' : ''} `}
        />
        <div className={`w-full p-6 ${
          type === 'home' 
            ? 'absolute bottom-0 backdrop-blur-lg bg-white bg-opacity-50 transform transition-all duration-500 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 dark:bg-black dark:bg-opacity-50' 
            : ''}`}>
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
          <div className="flex flex-wrap gap-2 mb-4 ">
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