import { Thought } from "../types";
import { API_URL } from "../utils/api";
export interface ThoughtAdmin{
  id: string
  title:{
    en: string
    zh: string
  }
  content:{
    en: string
    zh: string
  }
  fullContent:{
    en: string
    zh: string
  }
  date: string
}


class ThoughtService {
  
  static async getThoughts(language: string): Promise<Thought[]> {
    try {
      const response = await fetch(`${API_URL}/thoughts/?lang=${language}`, {
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
      console.error('Error fetching thoughts:', error);
      throw new Error('Failed to fetch thoughts');
    }
  }

  static async getThoughtById(id: string,language: string): Promise<Thought> {
    try {
      const response = await fetch(`${API_URL}/thoughts/${id}?lang=${language}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching thought:', error);
      throw new Error('Failed to fetch thought');
    }
  }

  static async addThought(thought: ThoughtAdmin): Promise<ThoughtAdmin> {
    try {
      const response = await fetch(`${API_URL}/thoughts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(thought),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error adding thought:', error);
      throw new Error('Failed to add thought');
    }
  }

  static async updateThought(thought: ThoughtAdmin): Promise<ThoughtAdmin> {
    try {
      const response = await fetch(`${API_URL}/thoughts/${thought.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(thought),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating thought:', error);
      throw new Error('Failed to update thought');
    }
  }

  static async deleteThought(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/thoughts/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting thought:', error);
      throw new Error('Failed to delete thought');
    }
  }
}

export default ThoughtService; 