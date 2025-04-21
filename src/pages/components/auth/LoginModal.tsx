import React, { useState, useEffect } from 'react';
// import { useAppDispatch, useAppSelector } from '../../../store/hooks';
// import { loginAdmin } from '../../../store/slices/userSlice';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth0 } from '@auth0/auth0-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  // const [username, setUsername] = useState('');
  // const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  // const dispatch = useAppDispatch();
  // const { loading, error } = useAppSelector(state => state.user);
  const { theme, toggleTheme } = useTheme();
  const { loginWithRedirect, user, isAuthenticated } = useAuth0();

  // Handle body scroll lock and modal visibility
  useEffect(() => {
    if (isOpen) {
      // 获取当前滚动位置
      const scrollY = window.scrollY;
      // 获取滚动条宽度
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      // 保存原始 padding
      const originalPadding = window.getComputedStyle(document.body).getPropertyValue('padding-right');
      
      // 固定body在当前位置
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      // 添加右侧 padding 以防止页面抖动
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      // 添加延迟显示
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 600);

      return () => {
        // 清理定时器
        clearTimeout(timer);
        // 恢复body定位
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.paddingRight = originalPadding;
        // 恢复滚动位置
        window.scrollTo(0, scrollY);
        // 重置显示状态
        setIsVisible(false);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (isAuthenticated && user?.sub) {
      // 验证是否是指定的 GitHub 账号
      if (user.nickname === 'Anakin2555') {
        onSuccess();
        onClose();
      }
    }
  }, [isAuthenticated, user]);

  if (!isOpen) return null;

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     await dispatch(loginAdmin({ username, password })).unwrap();
  //     onSuccess();
  //     onClose();
  //   } catch (err) {
  //     // Error handling is now managed by Redux
  //     console.error('Login failed:', err);
  //   }
  // };

  const handleGitHubLogin = () => {
    loginWithRedirect();
  };

  return (
    <div 
      className={`fixed inset-0 bg-black transition-opacity duration-200 z-50 
        ${isVisible ? 'bg-opacity-50' : 'bg-opacity-0'}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
          ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
          rounded-lg p-8 max-w-md w-full m-4 transition-all duration-200
          ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        onClick={e => e.stopPropagation()}
      >
        <h2 className={`text-2xl font-bold mb-6 
          ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Admin Login
        </h2>
        
        {/* <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className={`block text-sm font-bold mb-2
              ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none
                ${theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'}`}
              required
              placeholder="Enter your username"
            />
          </div>

          <div className="mb-6">
            <label className={`block text-sm font-bold mb-2
              ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none
                ${theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'}`}
              required
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="mb-4 text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 hover:text-gray-800 disabled:opacity-50
                ${theme === 'dark' 
                  ? 'text-gray-400 hover:text-gray-300' 
                  : 'text-gray-600 hover:text-gray-800'}`}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form> */}

        <div className="flex justify-center mt-4">
          <button
            onClick={handleGitHubLogin}
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385c.6.105.825-.255.825-.57c0-.285-.015-1.23-.015-2.235c-3.015.555-3.795-.735-4.035-1.41c-.135-.345-.72-1.41-1.23-1.695c-.42-.225-1.02-.78-.015-.795c.945-.015 1.62.87 1.845 1.23c1.08 1.815 2.805 1.305 3.495.99c.105-.78.42-1.305.765-1.605c-2.67-.3-5.46-1.335-5.46-5.925c0-1.305.465-2.385 1.23-3.225c-.12-.3-.54-1.53.12-3.18c0 0 1.005-.315 3.3 1.23c.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23c.66 1.65.24 2.88.12 3.18c.765.84 1.23 1.905 1.23 3.225c0 4.605-2.805 5.625-5.475 5.925c.435.375.81 1.095.81 2.22c0 1.605-.015 2.895-.015 3.3c0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            Sign in with GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal; 