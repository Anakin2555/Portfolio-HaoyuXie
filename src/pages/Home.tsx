import Hero from './components/home/Hero.tsx';
import Skills from './components/home/Skills.tsx';
import ProjectCard from './components/projects/ProjectCard.tsx';
import BlogCard from './components/blog/BlogCard.tsx';
import { useTheme } from '../context/ThemeContext';
import {useNavigate} from "react-router-dom";
import Updates from "./components/home/Updates.tsx";
import MessageBoard from './components/layout/MessageBoard.tsx';
import { useEffect, useState } from 'react';
import projectService from '../services/projectService.ts';
import { Project, BlogPost } from '../types/index.ts';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';
import BlogService from '../services/blogService.ts';

export default function Home() {
  const { theme } = useTheme();
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const {language} = useLanguage();
  const t = translations[language];


  

  // Navigate to Projects page
  function toProject(){
      navigate('/projects')
  }
  
  // Scroll to the update section
  function handleScrollToUpdate(){
      const target=document.getElementById('updateSection')
      target?.scrollIntoView({behavior:'smooth'})
      
  }

  // Fetch projects from the server
  useEffect(() => {
    projectService.getProjects(language).then((projects) => {
      console.log(projects);
      setProjects(projects);
    });
  }, [language]);

  // Fetch blogs from the server
  useEffect(() => {
    BlogService.getBlogPosts(language).then((blogs) => {
      console.log(blogs);
      setBlogs(blogs);
    });
  }, [language]);

  // Render the Home page
  return (
      <div className="min-h-screen">
          <Hero scrollToUpdate={handleScrollToUpdate}/>
          <section className="mx-auto sm:w-[500px] md:w-[800px] lg:w-[1100px] flex flex-row" id="updateSection">
              <div className="flex-[70%]">
                <Updates title={t.section.update}/>
              </div>
              <div className="flex-[30%]">
                <Skills title={t.section.skills}/>
              </div>
          </section>
          
          <section className={`py-16 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
              <div className="container mx-auto px-6 flex flex-col items-center ">

                  <h2 className={`text-3xl font-bold mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      👜 {t.section.projects.title}
                  </h2>
                  <div className="sm:w-[500px] md:w-[800px] lg:w-[1100px] flex flex-col items-center gap-8">
                      {projects.slice(0, 3).map((project) => (
                          <ProjectCard key={project.id} project={project} type="home"/>
                      ))}
                  </div>

                  <a className={`text-xl ${theme==='dark'?'text-white':'text-gray-800'} cursor-pointer mt-5`} onClick={toProject}>
                      {t.section.projects.more}{' >'}
                  </a>

              </div>
          </section>

          <section className={`py-16 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
              <div className="container mx-auto px-6">
                  <h2 className={`text-3xl font-bold mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {t.section.blogs.title}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {blogs.slice(0, 3).map((post) => (
                          <BlogCard key={post.id} post={post}/>
                      ))}
                  </div>
              </div>
          </section>

          <MessageBoard pageId="home"/>
        
          

      </div>
  );
}