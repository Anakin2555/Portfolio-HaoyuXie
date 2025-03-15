import { Project } from "../types";

const API_URL = 'http://localhost:3001/api';

class ProjectService {
  static async getProjects(language: string): Promise<Project[]> {
    try {
      const response = await fetch(`${API_URL}/projects?lang=${language}`);
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

  static async addProject(project: Project): Promise<Project> {
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
}

export default ProjectService;