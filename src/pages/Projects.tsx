import { useState, useMemo } from 'react';
import { projects } from '../data/projects';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectFilter from '../components/projects/ProjectFilter';
import Masonry from 'react-masonry-css';
import MessageBoard from '../components/layout/MessageBoard';

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = useMemo(() => {
    const allTags = projects.flatMap(project => project.tags);
    return [...new Set(allTags)];
  }, []);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'all') return projects;
    return projects.filter(project => 
      project.tags.includes(selectedCategory)
    );
  }, [selectedCategory]);

  const breakpointColumns = {
    default: 3,
    1200: 2,
    700: 1
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            My Projects
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            A collection of my work, side projects, and experiments.
          </p>
        </header>

        <ProjectFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <Masonry
          breakpointCols={breakpointColumns}
          className="flex -ml-8 w-auto"
          columnClassName="pl-8 bg-clip-padding"
        >
          {filteredProjects.map((project) => (
            <div key={project.id} className="mb-8">
              <ProjectCard project={project} />
            </div>
          ))}
        </Masonry>

      


        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No projects found in this category.</p>
          </div>
        )}

        <MessageBoard pageId="projects" />

      </div>
    </div>
  );
}