export interface Project {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  contentText:string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  contentText:string;
}

export interface Skill {
  name: string;
  level: number;
  category: 'frontend' | 'backend' | 'tools' | 'other';
}

export interface Thought{
  id: string
  title: string
  content: string
  fullContent: string
  date: string
  icon: string
}

export interface Comment {
  id: string;
  text: string;
  timestamp: string;
  ip: string;
  pageId: string;
  parentId?: string;
  replies?: Comment[];
}

export interface MessageBoardProps {
  pageId: string;
}