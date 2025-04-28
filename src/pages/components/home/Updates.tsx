import { useEffect, useState } from "react";
import {useTheme} from "../../../context/ThemeContext.tsx";
import { Update } from "../../../types/index.ts";   
import { useLanguage } from "../../../context/LanguageContext.tsx";
import { API_URL } from "../../../utils/api.ts";
export default function Updates(props:any){
    
    const {theme} = useTheme();
    const [updateList, setUpdateList] = useState<Update[]>([]); 
    const {language} = useLanguage();

    // 获取所有更新
    const fetchUpdates = async () => {
        try {
            const response = await fetch(`${API_URL}/updates?lang=${language}`, {
                headers: {
                  'Content-Type': 'application/json',
                },
                mode: 'cors',
              });
            if (!response.ok) {
                throw new Error('Failed to fetch updates');
            }
            const updates = await response.json();
            return updates;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    // 加载数据,切换语言时重新加载
    useEffect(() => {
        fetchUpdates().then((updates)=>{
            const sortedUpdates = updates.sort((a: Update, b: Update) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setUpdateList(sortedUpdates);
        });
    }, [language]);
    
    return(
        <section className={`py-16 ${theme==='dark'}?'bg-gray-900':'bg-white'}`} id="update">

            <div className="container px-6">
                <h2 className={`text-3xl font-bold mb-8 ${theme==='dark'?'text-white':'text-gray-900'}`}
                    >
                    😍 {props.title}
                </h2>

                <div className={`flex flex-col gap-6 ${theme==='dark'?'text-white':'text-gray-900'}`}>
                    {updateList.map((update) => {
                        return (
                            <div 
                                className={`flex flex-col gap-2 p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}
                                key={update.id}>

                                <div className={`flex flex-row justify-start items-center gap-4 font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                    <div className="text-md">
                                        🔵 {update.category}
                                    </div>
                                    <div className="text-sm">
                                        {update.date}
                                    </div>
                                </div>
                                <div>
                                    {update.title}
                                </div>

                            </div>

                        )
                    })}
                    
                </div>


            </div>


        </section>
    )
}