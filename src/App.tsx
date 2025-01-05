import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Blog from './pages/Blog';
import Thoughts from './pages/Thoughts';
import Detail from './pages/Detail';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen transition-colors duration-300 dark:bg-gray-900">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<Detail />} />
              <Route path="/thoughts" element={<Thoughts />} />
              <Route path="/projects/:id" element={<Detail />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;