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
import { Auth0Provider } from '@auth0/auth0-react';
import { auth0Config } from './config/auth0';
import { useEffect } from 'react';
// import ApiModeSwitcher from './components/ApiModeSwitcher';

// 回调处理组件
const AuthCallback = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // 处理完认证后重定向到首页或其他页面
    navigate('/');
  }, []);

  return <div>Authenticating...</div>;
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