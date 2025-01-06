import { useState, useEffect } from 'react';
import { MessageCircle, Send, Reply } from 'lucide-react';
import { Comment,MessageBoardProps } from '../../types';


export default function MessageBoard({ pageId }: MessageBoardProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [userIp, setUserIp] = useState<string>('');
  const [location, setLocation] = useState<string>('Unknown');

  // 获取用户位置
  useEffect(() => {
    fetch('http://ip-api.com/json/')
      .then(response => response.json())
      .then(data => {
        const locationStr = [data.city, data.regionName, data.country]
          .filter(Boolean)
          .join(', ');
        setLocation(locationStr || 'Unknown');
        setUserIp(data.query); // data.query 包含 IP 地址
      })
      .catch(() => {
        setLocation('Unknown');
        setUserIp('Unknown');
      });
  }, []);

  // 从 localStorage 加载评论
  useEffect(() => {
    const savedComments = localStorage.getItem(`comments-${pageId}`);
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  }, [pageId]);

  // 保存评论到 localStorage
  const saveComments = (newComments: Comment[]) => {
    localStorage.setItem(`comments-${pageId}`, JSON.stringify(newComments));
    setComments(newComments);
  };

  // 添加评论
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      text: newComment,
      timestamp: new Date().toISOString(),
      ip: userIp,
      pageId,
      parentId: replyTo || undefined,
      replies: []
    };

    if (replyTo) {
      // 添加回复
      const updatedComments = comments.map(c => {
        if (c.id === replyTo) {
          return {
            ...c,
            replies: [...(c.replies || []), comment]
          };
        }
        return c;
      });
      saveComments(updatedComments);
    } else {
      // 添加新评论
      saveComments([...comments, comment]);
    }

    setNewComment('');
    setReplyTo(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 text-gray-900 dark:text-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-6 h-6" />
        <h2 className="text-xl font-semibold">Message Board</h2>
      </div>

      {/* 评论输入框 */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={replyTo ? "Write a reply..." : "Write a comment..."}
            className="flex-1 p-3 rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg flex items-center gap-2 border-2 border-blue-500 text-blue-500 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
          >
            <Send size={18} />
            Send
          </button>
        </div>
      </form>

      {/* 评论列表 */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {location}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(comment.timestamp).toLocaleString()}
              </div>
            </div>
            <p className="mb-3">{comment.text}</p>
            <button
              onClick={() => setReplyTo(comment.id)}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <Reply size={16} />
              Reply
            </button>

            {/* 回复列表 */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4 ml-6 space-y-4">
                {comment.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {location}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(reply.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <p>{reply.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 