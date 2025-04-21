import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { useTheme } from '../context/ThemeContext';


const Admin = () => {
  const navigate = useNavigate();
  const { currentUser } = useAppSelector(state => state.user);
  const { theme } = useTheme();

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  return (
    <div className="container mx-auto px-6 py-8 mt-20">
      <h1 className={`text-2xl font-bold mb-6 ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        Admin Dashboard
      </h1>
      {/* 添加管理功能 */}
    </div>
  );
};

export default Admin; 