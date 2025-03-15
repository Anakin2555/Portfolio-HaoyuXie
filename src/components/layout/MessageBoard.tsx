import { useState, useEffect } from 'react';
import { MessageCircle, Send, Reply } from 'lucide-react';
import { Comment, Visitor } from '../../types';
import CommentService from '../../services/commentService';
import VisitorService from '../../services/visitorService';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../data/translations';

export default function MessageBoard({ pageId }: { pageId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  
  // 二级回复的状态，使用Map存储每个父评论的回复内容
  const [replyContents, setReplyContents] = useState<Map<string, string>>(new Map());
  
  // 当前正在回复的评论ID
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {language} = useLanguage();
  const t = translations[language].messageBoard;
  const [visitor, setVisitor] = useState<Visitor>({
    deviceId: '',
    name: '',
    ip: '',
    location: {
      city: '',
      region: '',
      country: '',
      timezone: ''
    },
    userAgent: '',
    lastVisit: ''
  });
  const [error, setError] = useState<string | null>(null);

  // 获取用户位置
  // useEffect(() => {
  //   fetch('http://ip-api.com/json/')
  //     .then(response => response.json())
  //     .then(data => {
  //       const locationStr = [data.city, data.regionName, data.country]
  //         .filter(Boolean)
  //         .join(', ');
  //       setLocation(locationStr || 'Unknown');
  //     })
  //     .catch(() => setLocation('Unknown'));
  // }, []);

  // 获取访客身份
  useEffect(() => {
    const initVisitor = async () => {
      try {
        const visitorData = await VisitorService.getVisitorIdentity();
        setVisitor(visitorData);
      } catch (error) {
        console.error('Failed to get visitor identity:', error);
      }
    };
    
    initVisitor();
  }, []);

  // 加载评论
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await CommentService.getComments(pageId);
        
        // Ensure each comment has the required properties
        const formattedComments: Comment[] = data.map((comment: any) => ({
          id: comment.id || Date.now().toString(),
          text: comment.text,
          timestamp: comment.timestamp || new Date().toISOString(),
          visitor: comment.visitor || visitor,
          pageId: comment.pageId || pageId,
          parentId: comment.parentId || undefined,
          grandParentId: comment.grandParentId || undefined,
          replies: comment.replies || [],
          location: comment.location || 'Unknown'
        }));

        setComments(formattedComments);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    };
    fetchComments();
  }, [pageId]);

  // 处理一级评论提交
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isLoading || !visitor) return;

    setIsLoading(true);
    setError(null);

    try {
      const comment: Comment = {
        id: Date.now().toString(),
        text: newComment,
        timestamp: new Date().toISOString(),
        visitor,
        pageId,
        replies: []
      };

      await CommentService.addComment(comment);
      const updatedComments = await CommentService.getComments(pageId);
      setComments(updatedComments);
      setNewComment('');
    } catch (error) {
      setError(error instanceof Error ? error.message : '评论失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 处理二级评论提交
  const handleReplySubmit = async (e: React.FormEvent, parentId: string, grandParentId: string) => {
    e.preventDefault();
    const replyContent = replyContents.get(parentId);
    if (!replyContent?.trim() || isLoading) return;

    setIsLoading(true);    
    setError(null);

    try {
      const reply: Comment = {
        id: Date.now().toString(),
        text: replyContent,
        timestamp: new Date().toISOString(),
        visitor: visitor,
        pageId,
        parentId,
        grandParentId,
        replies: []
      };

      await CommentService.addComment(reply);
      const updatedComments = await CommentService.getComments(pageId);
      setComments(updatedComments);
      
      // 清空对应的回复输入框
      setReplyContents(prev => {
        const next = new Map(prev);
        next.delete(parentId);
        return next;
      });
      setReplyTo(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : '评论失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 处理回复按钮点击
  const handleReplyClick = (commentId: string) => {
    setReplyTo(commentId);
    // 初始化回复内容（如果还没有）
    if (!replyContents.has(commentId)) {
      setReplyContents(prev => {
        const next = new Map(prev);
        next.set(commentId, '');
        return next;
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 text-gray-900 dark:text-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-6 h-6" />
        <h2 className="text-xl font-semibold">{t.title}</h2>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400">
          {error}
        </div>
      )}

      {/* 一级评论输入框 */}
      <form onSubmit={handleCommentSubmit} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={t.placeholder}
            className="flex-1 p-3 rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 border focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg flex items-center gap-2 border-2 border-blue-500 text-blue-500 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            <Send size={18} />
            {isLoading ? t.sendLoading : t.send}
          </button>
        </div>
      </form>

      {/* 评论列表 */}
      <div className="space-y-6">
        {comments
          .filter(comment => !comment.parentId)
          .map((comment) => (
            <div key={comment.id} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              {/* 一级评论内容 */}
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <svg 
                    className="w-5 h-5" 
                    fill="currentColor"  // 使用 currentColor 继承父元素颜色
                    viewBox="0 0 1024 1024" 
                    version="1.1" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M512.010745 1022.082324c-282.335297 0-511.220241-228.798986-511.220241-511.036046C0.790504 228.798986 229.675448 0 512.010745 0c282.312784 0 511.198751 228.798986 511.198751 511.046279C1023.208473 793.285385 794.322505 1022.082324 512.010745 1022.082324zM512.010745 95.826486c-229.385341 0-415.371242 185.884594-415.371242 415.220816 0 107.22714 41.021276 204.6551 107.802238 278.339286 60.140729-29.092595 38.062897-4.88424 116.77254-37.274952 80.539314-33.089629 99.610672-44.639686 99.610672-44.639686l0.776689-76.29464c0 0-30.169113-22.890336-39.543621-94.683453-18.895349 5.426593-25.108864-21.988804-26.237571-39.429011-1.001817-16.863063-10.926864-69.487607 12.105712-64.739467-4.714372-35.144428-8.094352-66.844407-6.417153-83.633792 5.763261-58.938344 62.97324-120.518864 151.105486-125.017318 103.665011 4.486174 144.737452 66.028832 150.500713 124.9682 1.680269 16.800641-2.028193 48.511877-6.739495 83.594907 23.025413-4.686742 13.028735 47.861054 11.901051 64.726164-1.028423 17.440208-7.394411 44.756343-26.208918 39.34203-9.42158 71.79107-39.593763 94.498234-39.593763 94.498234l0.725524 75.924203c0 0 19.070334 10.788717 99.609649 43.892673 78.70862 32.387641 56.605206 9.609869 116.77561 38.765909 66.75231-73.686233 107.772562-171.101913 107.772562-278.339286C927.356404 281.712103 741.398132 95.826486 512.010745 95.826486z" />
                  </svg>
                  <div>{language === 'en' ? 'Visitor' : '游客'} {comment.visitor.name}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {comment.visitor.location.city}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(comment.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
              <p className="mb-3">{comment.text}</p>
              
              {/* 二级评论按钮 */}
              <button
                onClick={() => handleReplyClick(comment.id)}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <Reply size={16} />
                {t.reply}
              </button>

              {/* 二级评论输入框 */}
              {replyTo === comment.id && (
                <form 
                  onSubmit={(e) => handleReplySubmit(e, comment.id, '')} 
                  className="mt-4 mb-4"
                >
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={replyContents.get(comment.id) || ''}
                      onChange={(e) => {
                        setReplyContents(prev => {
                          const next = new Map(prev);
                          next.set(comment.id, e.target.value);
                          return next;
                        });
                      }}
                      placeholder={t.replyContent}
                      className="flex-1 p-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      className="px-3 py-1 rounded-lg flex items-center gap-2 border-2 border-blue-500 text-blue-500 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50"
                      disabled={isLoading}
                    >
                      <Send size={16} />
                      {isLoading ? t.sendLoading : t.reply}
                    </button>
                  </div>
                </form>
              )}

              {/* 回复列表（每个一级评论下的二级及以上的评论） */}
              <div className="mt-4 ml-6 space-y-4">
                {comments
                  .filter(reply => reply.parentId === comment.id||reply.grandParentId===comment.id)
                  .map((reply) => (
                    <div
                      key={reply.id}
                      className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                          <svg 
                            className="w-5 h-5" 
                            fill="currentColor"  // 使用 currentColor 继承父元素颜色
                            viewBox="0 0 1024 1024" 
                            version="1.1" 
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M512.010745 1022.082324c-282.335297 0-511.220241-228.798986-511.220241-511.036046C0.790504 228.798986 229.675448 0 512.010745 0c282.312784 0 511.198751 228.798986 511.198751 511.046279C1023.208473 793.285385 794.322505 1022.082324 512.010745 1022.082324zM512.010745 95.826486c-229.385341 0-415.371242 185.884594-415.371242 415.220816 0 107.22714 41.021276 204.6551 107.802238 278.339286 60.140729-29.092595 38.062897-4.88424 116.77254-37.274952 80.539314-33.089629 99.610672-44.639686 99.610672-44.639686l0.776689-76.29464c0 0-30.169113-22.890336-39.543621-94.683453-18.895349 5.426593-25.108864-21.988804-26.237571-39.429011-1.001817-16.863063-10.926864-69.487607 12.105712-64.739467-4.714372-35.144428-8.094352-66.844407-6.417153-83.633792 5.763261-58.938344 62.97324-120.518864 151.105486-125.017318 103.665011 4.486174 144.737452 66.028832 150.500713 124.9682 1.680269 16.800641-2.028193 48.511877-6.739495 83.594907 23.025413-4.686742 13.028735 47.861054 11.901051 64.726164-1.028423 17.440208-7.394411 44.756343-26.208918 39.34203-9.42158 71.79107-39.593763 94.498234-39.593763 94.498234l0.725524 75.924203c0 0 19.070334 10.788717 99.609649 43.892673 78.70862 32.387641 56.605206 9.609869 116.77561 38.765909 66.75231-73.686233 107.772562-171.101913 107.772562-278.339286C927.356404 281.712103 741.398132 95.826486 512.010745 95.826486z" />
                          </svg>
                          <div>{language === 'en' ? 'Visitor' : '游客'} {comment.visitor.name}</div>

                          {reply.grandParentId &&
                          <div className='flex items-center gap-2 text-gray-500 dark:text-gray-400'>
                            <div className='text-blue-500'>{language === 'en' ? 'reply to' : '回复'}</div>
                            <div> {comments.find(comment=>comment.id===reply.parentId)?.visitor.name}</div>
                          </div>}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {comment.visitor.location.city}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(comment.timestamp).toLocaleString()}
                          </div>
                        </div>  
                      </div>
                      <p>{reply.text}</p>

                      {/* 四级评论按钮 */}
                      <button
                        onClick={() => handleReplyClick(reply.id)}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Reply size={16} />
                        {t.reply}
                      </button>


                      {/* 四级评论输入框 */}
                      {replyTo === reply.id && (
                        <form 
                          onSubmit={(e) => 
                            reply.grandParentId?
                            handleReplySubmit(e,reply.id||'', reply.grandParentId||'')
                            :
                            handleReplySubmit(e,reply.id||'', reply.parentId||'')} 
                          className="mt-4 mb-4"
                        >
                          <div className="flex gap-4">
                            <input
                              type="text"
                              value={replyContents.get(reply.id) || ''}
                              onChange={(e) => {
                                setReplyContents(prev => {
                                  const next = new Map(prev);
                                  next.set(reply.id, e.target.value);
                                  return next;
                                });
                              }}
                              placeholder={t.replyContent}
                              className="flex-1 p-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              disabled={isLoading}
                            />
                            <button
                              type="submit"
                              className="px-3 py-1 rounded-lg flex items-center gap-2 border-2 border-blue-500 text-blue-500 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50"
                              disabled={isLoading}
                            >
                              <Send size={16} />
                              {isLoading ? t.sendLoading : t.reply}
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}