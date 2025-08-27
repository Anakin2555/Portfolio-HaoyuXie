import { BlogPost } from "../types";
import { API_URL, FILE_URL } from "../utils/api";

export interface BlogPostAdmin{
  id: string
  title:{
    en: string
    zh: string
  }
  date: string
  excerpt:{
    en: string
    zh: string
  }
  readTime: string;
  image: string;
  contentFile: {
    en: string
    zh: string
  }
}

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


  static async addBlogPost(blogPost: BlogPostAdmin): Promise<BlogPostAdmin> {
    try {
      const response = await fetch(`${API_URL}/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogPost),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } 
      return await response.json();
    } catch (error) {
      console.error('Error adding blog post:', error);
      throw new Error('Failed to add blog post');
    }
  }

  static async updateBlogPost(blogPost: BlogPostAdmin): Promise<BlogPostAdmin> {
    try {
      const response = await fetch(`${API_URL}/blogs/${blogPost.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogPost),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating blog post:', error);
      throw new Error('Failed to update blog post');
    }
  }

  static async deleteBlogPost(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting blog post:', error);
      throw new Error('Failed to delete blog post');
    }
  }

  static async getBlogContent(filename: string, language: string): Promise<string> {
    try {
      const response = await fetch(`${FILE_URL}/blog/${filename}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.error('Error fetching blog content:', error);
      throw new Error('Failed to fetch blog content');
    }
  }

  static async uploadBlogFile(file: File, language: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);

    try {
      const response = await fetch(`${API_URL}/blogs/uploadmd`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.filename;
    } catch (error) {
      console.error('Error uploading blog file:', error);
      throw new Error('Failed to upload blog file');
    }
  }

  static async uploadBlogImg(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/blogs/uploadimg`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.fileName; 
    } catch (error) {
      console.error('Error uploading blog img:', error);
      throw new Error('Failed to upload blog img');
    }
  }
}

export default BlogService;
