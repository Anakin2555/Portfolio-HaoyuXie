import { API_URL } from '../utils/api';

export interface Update {
  id: number;
  title: {
    en: string;
    zh: string;
  };
  date: string;
  category: {
    en: string;
    zh: string;
  };
}

export type CreateUpdateDTO = Omit<Update, 'id'>;
export type UpdateUpdateDTO = CreateUpdateDTO;

class UpdateService {
  
  static async getUpdates(language: string): Promise<Update[]> {
    try {
      const response = await fetch(`${API_URL}/updates?lang=${language}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching updates:', error);
      throw new Error('Failed to fetch updates');
    }
  }

  static async createUpdate(update: CreateUpdateDTO): Promise<Update> {
    try {
      const response = await fetch(`${API_URL}/updates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(update),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating update:', error);
      throw new Error('Failed to create update');
    }
  }
  
  static async updateUpdate(id: number, update: UpdateUpdateDTO): Promise<Update> {
    try {
      const response = await fetch(`${API_URL}/updates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(update),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating update:', error);
      throw new Error('Failed to update update');
    }
  }
  
  static async deleteUpdate(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/updates/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting update:', error);
      throw new Error('Failed to delete update');
    }
  }
}

export default UpdateService; 