import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
// import ApiModeSwitcher from './components/ApiModeSwitcher';

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