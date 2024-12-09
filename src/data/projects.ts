import { Project } from '../types';
import adven_cover from '../assets/img/adven_cover.png'
import lost_found_cover from '../assets/img/lost_found_cover.jpg'
export const projects: Project[] = [
  {
    id: '1',
    title: 'Enrollment Promotion Volunteer Application System',
    description: 'A full-stack system for volunteers to enroll and admins to audit.',
    image: adven_cover,
    tags: ['Vue 3', 'SpringBoot', 'MySQL'],
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com/example/project'
  },
  {
    id: '2',
    title: 'Campus Lost & Found MiniProgram',
    description: 'A Wechat MiniProgram Lost and Found solutions for college students.',
    image: lost_found_cover,
    tags: ['mpvue', 'SpringBoot', 'MySQL'],
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com/example/project'
  },
  {
    id: '3',
    title: 'E-commerce Platform',
    description: 'A full-featured e-commerce platform built with React and Node.js',
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80',
    tags: ['React', 'Node.js', 'MongoDB', 'Redux'],
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com/example/project'
  },
  {
    id: '4',
    title: 'Task Management App',
    description: 'A collaborative task management application with real-time updates',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80',
    tags: ['React', 'Firebase', 'Material-UI'],
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com/example/project'
  }
];