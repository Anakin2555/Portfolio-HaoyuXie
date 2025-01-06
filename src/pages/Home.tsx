import Hero from '../components/home/Hero';
import Skills from '../components/home/Skills';
import ProjectCard from '../components/projects/ProjectCard';
import BlogCard from '../components/blog/BlogCard';
import { projects } from '../data/projects';
import { blogPosts } from '../data/blog-posts';
import { useTheme } from '../context/ThemeContext';
import {useNavigate} from "react-router-dom";
import Update from "../components/home/Update.tsx";
import MessageBoard from '../components/layout/MessageBoard.tsx';

export default function Home() {
  const { theme } = useTheme();
  const navigate = useNavigate()
  function toProject(){
      navigate('/projects')
  }
  
  function handleScrollToUpdate(){
      const target=document.getElementById('updateSection')
      target?.scrollIntoView({behavior:'smooth'})
      
  }
  return (
      <div className="min-h-screen">
          <Hero scrollToUpdate={handleScrollToUpdate}/>
          <section className={"flex flex-row justify-center"} id="updateSection">
              <Update></Update>
              <div className="hidden md:block" >
                <Skills/>
              </div>
          </section>
          
          <section className={`py-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className="container mx-auto px-6 flex flex-col items-center ">

                  <h2 className={`text-3xl font-bold mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      👜 Featured Projects
                  </h2>
                  <div className="sm:w-[500px] md:w-[800px] lg:w-[1100px] flex flex-col items-center gap-8">
                      {projects.slice(0, 3).map((project) => (
                          <ProjectCard key={project.id} project={project}/>
                      ))}
                  </div>

                  <a className={`text-xl ${theme==='dark'?'text-white':'text-gray-800'} cursor-pointer mt-5`} onClick={toProject}>
                      Not Enough? 👉Click here{'>'}
                  </a>

              </div>
          </section>

          <section className={`py-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className="container mx-auto px-6">
                  <h2 className={`text-3xl font-bold mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Latest Blog Posts
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {blogPosts.map((post) => (
                          <BlogCard key={post.id} post={post}/>
                      ))}
                  </div>
              </div>
          </section>

          <MessageBoard pageId="home" />
        
          

      </div>
  );
}