import { useEffect, useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import type { Skill } from '../../../types';
import profileService from '../../../services/profileService';
import { useLanguage } from '../../../context/LanguageContext';


export default function Skills(props:any) {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const [skills, setSkills] = useState<Skill[]>([]);
  
  // 加载数据
  useEffect(() => { 
    console.log(language);
    
    profileService.getProfile(language).then((profile) => {
      setSkills(profile.skills);
      console.log(profile);
    });
  }, [language]);
  
  return (
    <section className={`min-w-[200px] py-16 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`} id="skills">
      <div className="container px-6">
        <h2 className={`text-3xl font-bold mb-8 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>🖱️ {props.title}</h2>
        <div className="grid sm:grid-cols-1  gap-3">
          {skills.map((item) => (
              
            <div key={item.name} 
                 className={`w-full p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
              
              <div className="flex justify-between mb-2">
                <div className={` font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{item.name} 
                </div>
               
              </div>
              
             
            </div>
              
          ))}
        </div>
      </div>
    </section>
  );
}