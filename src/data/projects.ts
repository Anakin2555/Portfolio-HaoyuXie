import { Project } from '../types';


export const projects: Project[] = [
  {
    id: '1',
    title: 'Enrollment Promotion Volunteer Application System',
    excerpt: 'A full-stack system for volunteers to enroll and admins to audit.',
    content: `The Enrollment Promotion Volunteer Application System is a comprehensive platform designed to streamline the volunteer recruitment and management process for university enrollment promotion activities.
Key Features:
• Online volunteer registration and profile management
• Admin dashboard for application review and training management
• Event publishing and attendance tracking
• Real-time communication between volunteers and administrators
• Data analytics and reporting dashboard

Technical Highlights:
• Vue 3 for responsive front-end interface
• Spring Boot backend with RESTful APIs
• MySQL database for data persistence
• JWT authentication for secure access
• WebSocket for real-time notifications`,
    image: 'adven_cover.png',
    tags: ['Full-Stack','Vue 3', 'SpringBoot', 'MySQL'],
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com/example/project'
  },
  {
    id: '2',
    title: 'Campus Lost & Found MiniProgram',
    excerpt: 'A Wechat MiniProgram Lost and Found solutions for college students.',
    content: `The Campus Lost & Found MiniProgram is a WeChat-based solution designed specifically for university students to efficiently manage lost and found items on campus.
Core Features:
• Location-based lost and found item posting
• Smart item matching algorithm
• Real-time chat between users
• Item status tracking system
• Push notifications for potential matches

Implementation Details:
• MPVUE framework for WeChat Mini Program
• Spring Boot backend services
• MySQL database with spatial indexing
• Cloud storage for image uploads
• WeChat Pay integration for rewards`,
    image: 'lost_found_cover.jpg',
    tags: ['Full-Stack','mpvue', 'SpringBoot', 'MySQL'],
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com/example/project'
  },
  {
    id: '3',
    title: 'Mental Health Website for Teenagers',
    excerpt: 'A Website aiming to solve mental health problems for teenagers.',
    content: `The Mental Health Website is a professional platform providing mental health support and resources specifically designed for teenagers
Platform Features:
• Online psychological assessment tools
• Professional counselor appointment system
• Mental health knowledge base
• Anonymous community discussions
• 24/7 emergency support hotline

Technical Stack:
• Vue.js 2 frontend framework
• Spring Boot backend
• MySQL for primary database
• Redis for caching and sessions
• WebSocket for real-time chat support`,
    image: 'mental_cover.png',
    tags: ['Full-Stack','Vue2', 'SpringBoot', 'MySQL','Redis'],
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com/example/project'
  },
  {
    id: '4',
    title: 'Technology Information Mobile App',
    excerpt: 'A collaborative task management application with real-time updates',
    content: `The Technology Information Mobile App is a modern mobile application designed for tech enthusiasts, providing the latest technology news, product reviews, and technical analysis.
Design Features:
• Clean and modern interface design
• Personalized content recommendations
• Dark mode support
• Gesture-based navigation
• Responsive layouts for all devices

UI/UX Highlights:
• Minimalist design philosophy
• Intuitive user flows
• Accessibility considerations
• Smooth animations and transitions
• Cross-platform consistency`,
    image: 'verge_cover.png',
    tags: ['UX/UI Design','Figma'],
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com/example/project'
  }
];