import { NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const navItems = [
  { path: '/', label: 'Home', exact: true },
  { path: '/blog', label: 'Blog' },
  { path: '/projects', label: 'Project' },
  { path: '/thoughts', label: 'Message' },
];

export default function Navigation() {
  const { theme } = useTheme();
  const location = useLocation();

  // Calculate the position and width for the active background
  const getActiveStyles = () => {
    const activeIndex = navItems.findIndex(item => 
      item.path === '/' 
        ? location.pathname === '/'  // 首页精确匹配
        : location.pathname.startsWith(item.path)  // 其他页面前缀匹配
    );
    
    return {
      transform: `translateX(${activeIndex * 117}%)`,
      width: '96px', // Fixed width for each item
    };
  };

  return (
    <div className="absolute left-1/2 transform -translate-x-1/2">
      <nav className={`relative px-2 py-2 rounded-full ${
        theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100/50'
      } backdrop-blur-md`}>
        {/* Active background indicator */}
        <div
          className={`absolute left-2 top-2 h-[calc(100%-16px)] rounded-full transition-all duration-300 ease-in-out ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}
          style={getActiveStyles()}
        />

        {/* Navigation items */}
        <div className="relative flex items-center space-x-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={() => {
                // 检查当前路径是否匹配
                const isPathActive = item.path === '/' 
                  ? location.pathname === '/'  // 首页精确匹配
                  : location.pathname.startsWith(item.path);  // 其他页面前缀匹配

                return `
                  relative z-10 flex justify-center w-24 px-6 py-1.5 text-sm font-medium transition-colors duration-200 
                  ${theme === 'dark'
                    ? isPathActive
                      ? 'text-white'
                      : 'text-gray-400 hover:text-gray-200'
                    : isPathActive
                      ? 'text-gray-900'
                      : 'text-gray-600 hover:text-gray-800'
                  }
                `;
              }}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}