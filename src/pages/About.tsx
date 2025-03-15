import '../assets/icon/css/fcicon.css'
import { useEffect, useState } from 'react';
import profileService from '../services/profileService';
import type { Profile } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

export default function About() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const {language} = useLanguage();
    const t = translations[language];

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await profileService.getProfile(language);
                console.log(data);
                
                setProfile(data);
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [language]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!profile) {
        return <div>Failed to load profile</div>;
    }

    return (
        <div className="flex flex-col items-center">
            <div className="relative text-[36px] font-bold dark:text-white flex justify-center items-center mt-[100px]">
                {/* SVG moved before title with adjusted positioning */}
                <svg
                    className="absolute left-[-45px] w-[40px] h-[40px] animate-spin-slow"
                    viewBox="0 0 100 100"
                >
                    <defs>
                        <path
                            id="circle"
                            d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                        />
                    </defs>
                    <text className="fill-gray-600 dark:fill-white text-[12px] font-bold tracking-[0.1em]">
                        <textPath href="#circle">
                            • WELCOME TO HAOYU XIE'S WEBSITE • ENJOY YOUR VISIT •
                        </textPath>
                    </text>
                </svg>
                
                {t.section.about.title}
            </div>

            <div className="flex flex-row justify-center w-[800px] gap-[20px]">
                {/* 个人介绍 */}
                <div className="text-md dark:text-white bg-gray-100 dark:bg-gray-800 rounded-[20px] p-6 flex justify-center mt-[30px] w-[500px]">
                    {profile.introduction}
                </div>

                <div className="flex justify-center items-start mt-[30px] relative w-[200px]">
                

                    <img
                        src={'https://raw.githubusercontent.com/anakin2555/pic/master/img/scenery.jpg'}
                        alt="scenery avatar"
                        className="w-full h-auto object-contain rounded-[20px] shadow-lg 
                                 sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl"
                    />
                </div>
            </div>
        
            {/* 经历时间轴 */}
            <div className="max-w-3xl mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold text-center mb-12 dark:text-white">{t.section.about.title2}</h1>
                
                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-200 dark:bg-gray-700"></div>

                    {profile.education.map((edu, index) => (
                        <div key={index} className="relative">
                            {/* Education Experience */}
                            <div className="flex items-center">
                                <div className="w-1/2 pr-8 text-right">
                                    <h3 className="text-xl font-semibold dark:text-white">{edu.degree}</h3>
                                    <p className="text-gray-800 dark:text-white font-bold">🎓{edu.school}</p>
                                    <p className="text-gray-600 dark:text-gray-400">{edu.department}</p>
                                </div>
                                <div className="absolute left-1/2 transform -translate-x-1/2">
                                    <i className="fc-icon-scu fc-icon-zhong text-gray-800 dark:text-white"></i>
                                </div>

                                <div className="w-1/2 pl-10">
                                    <span className="text-gray-600 dark:text-gray-400">{edu.period}</span>
                                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                                        {edu.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}