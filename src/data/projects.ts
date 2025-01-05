import { Project } from '../types';
import adven_cover from '../assets/img/adven_cover.png'
import lost_found_cover from '../assets/img/lost_found_cover.jpg'
import mental_cover from '../assets/img/mental_cover.png'
import verge_cover from '../assets/img/verge_cover.png'
export const projects: Project[] = [
  {
    id: '1',
    title: 'Enrollment Promotion Volunteer Application System',
    excerpt: 'A full-stack system for volunteers to enroll and admins to audit.',
    contentText:'....',
    image: adven_cover,
    tags: ['Full-Stack','Vue 3', 'SpringBoot', 'MySQL'],
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com/example/project'
  },
  {
    id: '2',
    title: 'Campus Lost & Found MiniProgram',
    excerpt: 'A Wechat MiniProgram Lost and Found solutions for college students.',
    image: lost_found_cover,
    contentText:'....',
    tags: ['Full-Stack','mpvue', 'SpringBoot', 'MySQL'],
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com/example/project'
  },
  {
    id: '3',
    title: 'Mental Health Website for Teenagers',
    excerpt: 'A Website aiming to solve mental health problems for teenagers.',
    contentText:'....',
    image: mental_cover,
    tags: ['Full-Stack','Vue2', 'SpringBoot', 'MySQL','Redis'],
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com/example/project'
  },
  {
    id: '4',
    title: 'Technology Information Mobile App',
    excerpt: 'A collaborative task management application with real-time updates',
    contentText:'....',
    image: verge_cover,
    tags: ['UX/UI Design','Figma'],
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com/example/project'
  }
];