import { BlogPost } from "../types";
import { API_URL } from "../api/api";

class BlogService {
  static async getBlogPosts(language: string): Promise<BlogPost[]> {
    try {
      const response = await fetch(`${API_URL}/blogs/?lang=${language}`, {
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
      console.error('Error fetching blog posts:', error);
      throw new Error('Failed to fetch blog posts');
    }
  }

  static async getBlogPostById(id: string,language: string): Promise<BlogPost> {
    try {
      const response = await fetch(`${API_URL}/blogs/${id}?lang=${language}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching blog post:', error);
      throw new Error('Failed to fetch blog post');
    }
  }

}

export default BlogService;
