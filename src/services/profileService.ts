import type { Profile } from "../types";
import type { ProfileAdmin } from '../types/profileAdmin';
import { API_URL } from "../utils/api";

class ProfileService {
  static async getProfile(language: string): Promise<Profile> {
    try {
      const response = await fetch(`${API_URL}/profile?lang=${language}`, {
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
      console.error('Error fetching profile:', error);
      throw new Error('Failed to fetch profile');
    }
  }

  static async updateProfile(profileData: ProfileAdmin): Promise<ProfileAdmin> {
    try {
      console.log(JSON.stringify(profileData));
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