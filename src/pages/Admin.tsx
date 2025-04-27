import { useState } from 'react';
import { useAppSelector } from '../store/hooks';
import { useTheme } from '../hooks/useTheme';
import Button from 'antd/es/button';
import Card from 'antd/es/card';
import ProfileAdminPage from './components/admin/ProfileAdmin';

type AdminSection = 'profile' | 'updates' | 'projects' | 'blogs' | 'messages';

export default function Admin() {
  const { currentUser } = useAppSelector(state => state.user);
  const { theme } = useTheme();
  const [currentSection, setCurrentSection] = useState<AdminSection>('profile');

  const renderSection = () => {
    switch (currentSection) {
      case 'profile':
        return <ProfileAdminPage />;
      case 'updates':
        return <div>Updates Management (Coming Soon)</div>;
      case 'projects':
        return <div>Projects Management (Coming Soon)</div>;
      case 'blogs':
        return <div>Blogs Management (Coming Soon)</div>;
      case 'messages':
        return <div>Message Board Management (Coming Soon)</div>;
      default:
        return <ProfileAdminPage />;
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 mt-20">
      <h1 className={`text-2xl font-bold mb-6 ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        Admin Dashboard
      </h1>

      {/* Navigation Buttons */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <Button
          type={currentSection === 'profile' ? 'primary' : 'default'}
          onClick={() => setCurrentSection('profile')}
          className={currentSection === 'profile' ? 'bg-blue-500' : ''}
          block
        >
          Profile
        </Button>
        <Button
          type={currentSection === 'updates' ? 'primary' : 'default'}
          onClick={() => setCurrentSection('updates')}
          className={currentSection === 'updates' ? 'bg-blue-500' : ''}
          block
        >
          Updates
        </Button>
        <Button
          type={currentSection === 'projects' ? 'primary' : 'default'}
          onClick={() => setCurrentSection('projects')}
          className={currentSection === 'projects' ? 'bg-blue-500' : ''}
          block
        >
          Projects
        </Button>
        <Button
          type={currentSection === 'blogs' ? 'primary' : 'default'}
          onClick={() => setCurrentSection('blogs')}
          className={currentSection === 'blogs' ? 'bg-blue-500' : ''}
          block
        >
          Blogs
        </Button>
        <Button
          type={currentSection === 'messages' ? 'primary' : 'default'}
          onClick={() => setCurrentSection('messages')}
          className={currentSection === 'messages' ? 'bg-blue-500' : ''}
          block
        >
          Messages
        </Button>
      </div>

      {/* Content Area */}
      <Card>
        {renderSection()}
      </Card>
    </div>
  );
} 
