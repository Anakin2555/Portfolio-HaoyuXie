import { Project } from '../types';
import adven_cover from '../assets/img/adven_cover.png'
import lost_found_cover from '../assets/img/lost_found_cover.jpg'
import mental from '../assets/img/mental_cover.png'
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
    title: 'Mental Health Website for Teenagers',
    description: 'A Website aiming to solve mental health problems for teenagers.',
    image: mental,
    tags: ['Vue2', 'SpringBoot', 'MySQL','Redis'],
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