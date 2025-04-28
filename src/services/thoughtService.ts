import { Thought } from "../types";
import { API_URL } from "../utils/api";

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

  static async addThought(thought: Thought): Promise<Thought> {
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
}

export default ThoughtService; 