import { useTheme } from '../../context/ThemeContext';

const skills = [
  { name: 'Web Development (Vue、React)', level: 90 },
  { name: 'Android Development', level: 85 },
  {name: 'UI / UX Design', level: 75},
  { name: 'Machine Learning', level: 80 },
  { name: 'HCI / Interaction Design', level: 75},

];

export default function Skills() {
  const { theme } = useTheme();

  return (
    <section className={`py-16 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`} id="skills">
      <div className="container px-6">
        <h2 className={`text-3xl font-bold mb-8 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>🖱️ Skills</h2>
        <div className="grid sm:grid-cols-1  gap-3">
          {skills.map((skill) => (
              
            <div key={skill.name} 
                 className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
              
              <div className="flex justify-between mb-2">
                <span className={`font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{skill.name}
                </span>
                {/*<span className={*/}
                {/*  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'*/}
                {/*  }>{skill.level}%*/}
                {/*</span>*/}
              </div>
              
              {/*<div className={`w-full rounded-full h-2.5 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>*/}
              {/*  <div*/}
              {/*    className="bg-blue-600 h-2.5 rounded-full"*/}
              {/*    style={{ width: `${skill.level}%` }}>*/}
              {/*  </div>*/}
              {/*</div>*/}
            </div>
              
          ))}
        </div>
      </div>
    </section>
  );
}