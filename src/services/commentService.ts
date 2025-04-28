import DOMPurify from 'dompurify';
import { Comment } from '../types';
import { API_URL } from '../utils/api';

class CommentService {
  private static commentCache = new Map<string, number[]>(); // 存储访客评论时间戳
  private static RATE_LIMIT_WINDOW = 30000; // 30秒时间窗口
  private static MAX_COMMENTS_PER_WINDOW = 5; // 每个时间窗口最大评论数
  private static COOLDOWN_PERIOD = 300000; // 超出限制后的冷却时间（5分钟）

  // 检查评论频率
  private static checkCommentRate(visitorId: string): boolean {
    const now = Date.now();
    const timestamps = this.commentCache.get(visitorId) || [];
    
    // 如果有评论记录，检查是否在冷却期
    if (timestamps.length >= this.MAX_COMMENTS_PER_WINDOW) {
      const latestTimestamp = Math.max(...timestamps);
      const timeSinceLastComment = now - latestTimestamp;
      
      // 如果在冷却期内，抛出错误
      if (timeSinceLastComment < this.COOLDOWN_PERIOD) {
        const remainingCooldown = Math.ceil((this.COOLDOWN_PERIOD - timeSinceLastComment) / 60000);
        throw new Error(`评论太频繁，请等待 ${remainingCooldown} 分钟后再试`);
      }
      
      // 如果冷却期已过，清空之前的记录
      this.commentCache.set(visitorId, []);
      return true;
    }

    // 清理过期的时间戳（只保留时间窗口内的记录）
    const validTimestamps = timestamps.filter(
      time => now - time < this.RATE_LIMIT_WINDOW
    );

    // 检查是否超出频率限制
    if (validTimestamps.length >= this.MAX_COMMENTS_PER_WINDOW) {
      // 触发冷却期
      this.commentCache.set(visitorId, [...validTimestamps, now]);
      throw new Error('评论太频繁，将进入5分钟冷却期');
    }

    // 更新缓存
    this.commentCache.set(visitorId, [...validTimestamps, now]);
    return true;
  }

  // 内容安全检查
  private static validateContent(text: string): string {
    // 移除所有HTML标签
    const sanitizedText = DOMPurify.sanitize(text, {
      ALLOWED_TAGS: [], // 不允许任何HTML标签
      ALLOWED_ATTR: [] // 不允许任何HTML属性
    });

    if (sanitizedText.length > 500) {
      throw new Error('评论内容过长');
    }

    if (!sanitizedText.trim()) {
      throw new Error('评论内容不能为空');
    }

    // 检查敏感词
    const sensitiveWords = ['spam', 'advertisement', 'ad'];
    if (sensitiveWords.some(word => sanitizedText.toLowerCase().includes(word))) {
      throw new Error('评论包含敏感内容');
    }

    return sanitizedText;
  }

  static async getComments(pageId: string): Promise<Comment[]> {
    const response = await fetch(`${API_URL}/comments/${pageId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    });
    return response.json();
  }

  // 添加评论
  static async addComment(comment: Comment): Promise<Comment> {
    try {
      // 检查评论频率
      this.checkCommentRate(comment.visitor.deviceId);

      // 验证和清理评论内容
      comment.text = this.validateContent(comment.text);

      const response = await fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comment),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 更新评论缓存
      const timestamps = this.commentCache.get(comment.visitor.deviceId) || [];
      timestamps.push(Date.now());
      this.commentCache.set(comment.visitor.deviceId, timestamps);

      return await response.json();
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }
}

export default CommentService;