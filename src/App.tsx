import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import Header from './pages/components/layout/Header';
import Footer from './pages/components/layout/Footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Blogs from './pages/Blogs';
import Detail from './pages/Detail';
import About from './pages/About';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { auth0Config } from './config/auth0';
import { useEffect } from 'react';
import { useAppDispatch } from './store/hooks';
import { setAdminUser } from './store/slices/userSlice';
// import ApiModeSwitcher from './components/ApiModeSwitcher';

// 回调处理组件
const AuthCallback = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // 尝试设置管理员用户
      dispatch(setAdminUser(user))
        .unwrap()
        .then(() => {
          // 成功设置管理员，跳转到管理页面
          navigate('/admin');
        })
        .catch((error) => {
          // 未授权用户，返回首页
          console.error('Authentication failed:', error);
          navigate('/');
        });
    }
  }, [isLoading, isAuthenticated, user, dispatch, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Authenticating...</p>
      </div>
    </div>
  );
};
function App() {
  return (
    <Auth0Provider {...auth0Config}>
      <ThemeProvider>
        <LanguageProvider>
          <Router>
            <div className="flex flex-col min-h-screen transition-colors duration-300 dark:bg-gray-900">
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/blogs" element={<Blogs />} />
                  <Route path="/blogs/:id" element={<Detail />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/projects/:id" element={<Detail />} />
                  <Route path="/callback" element={<AuthCallback />} />
                </Routes>
              </main>
              <Footer />
              {/* <ApiModeSwitcher /> */}
            </div>
          </Router>
        </LanguageProvider>
      </ThemeProvider>
    </Auth0Provider>
  );
}

export default App;