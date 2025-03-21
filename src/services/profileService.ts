import type { Profile } from "../types";

const API_URL = 'http://localhost:3001/api';

class ProfileService {
  static async getProfile(language: string): Promise<Profile> {
    try {
      const response = await fetch(`${API_URL}/profile?lang=${language}`);
      console.log(response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw new Error('Failed to fetch profile');
    }
  }

  static async updateProfile(profileData: Partial<Profile>): Promise<Profile> {
    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error('Failed to update profile');
    }
  }
}

export default ProfileService; 