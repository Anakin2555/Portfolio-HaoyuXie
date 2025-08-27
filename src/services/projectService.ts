import { API_URL, FILE_URL } from "../utils/api";

import { Project } from "../types/index";

export interface ProjectAdmin {
  id: string;
  title: {
    en: string;
    zh: string;
  };
  excerpt: {
    en: string;
    zh: string;
  };
  image: string;
  contentFile: {
    en: string;
    zh: string;
  };
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
}
class ProjectService {
  static async getProjects(language: string): Promise<Project[]> {
    try {
      const response = await fetch(`${API_URL}/projects?lang=${language}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw new Error('Failed to fetch projects');
    }
  }

  static async getProjectById(id: string, language: string): Promise<Project> {
    try {
      const response = await fetch(`${API_URL}/projects/${id}?lang=${language}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching project:', error);
      throw new Error('Failed to fetch project');
    }
  }

  static async getProjectContent(filename: string, language: 'en' | 'zh'): Promise<string> {
      try {
        let fileUrl = '';
        fileUrl = `${FILE_URL}/project/${filename}`;
        const response = await fetch(fileUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch markdown: ${response.status}`);
        }
          const markdownText = await response.text();
          return markdownText;
      } catch (error) {
          console.error('Error loading markdown file:', error);
          throw new Error('Failed to fetch project content');
      }
  }

  static async updateProject(id: string, project: ProjectAdmin): Promise<ProjectAdmin> {
    try {
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } 
      
      return await response.json();
    } catch (error) {
      console.error('Error updating project:', error);
      throw new Error('Failed to update project');
    }
  }

  static async addProject(project: ProjectAdmin): Promise<ProjectAdmin> {
    try {
      const response = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error adding project:', error);
      throw new Error('Failed to add project');
    }
  }

  static async deleteProject(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      throw new Error('Failed to delete project');
    } 
  }
}

export default ProjectService;