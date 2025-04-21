import { API_URL } from '../api/api';

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
}

export default UpdateService; 