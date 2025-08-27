export interface Project {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  contentFile: string;
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
  contentFile: string;
}

export interface Skill {
  name: string;
  level: number;
}

export interface Thought{
  id: string
  title: string
  content: string
  fullContent: string
  date: string
}

export interface Update {
  id: string;
  title: string;
  date: string;
  category: string;
}
// export interface Comment {
//   id: string;
//   text: string;
//   timestamp: string;
//   pageId: string;
//   parentId?: string;
//   replies?: Comment[];
//   location?: string;
// }
export interface Visitor {
  deviceId: string;
  name: string;
  ip: string;
  location: {
    city: string;
    region: string;
    country: string;
    timezone: string;
  };
  userAgent: string;
  lastVisit: string;
}

// 扩展Comment类型，添加访客信息
export interface Comment {
  id: string;
  text: string;
  timestamp: string;
  visitor: Visitor;  // 添加访客信息
  pageId: string;
  parentId?: string;
  grandParentId?: string;
  replies: Comment[];
}
export interface MessageBoardProps {
  pageId: string;
}

export interface Profile {
  introduction: string;
  education: Education[];
  skills: Skill[];
}

export interface Education {
  degree: string;
  school: string;
  department: string;
  period: string;
  description: string;
}
