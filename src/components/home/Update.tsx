import {useTheme} from "../../context/ThemeContext.tsx";

export default function Update(){
    
    const {theme} = useTheme();
    const updateList=[{
        id:1,
        title:"My research paper \"Decomposing and Fusing Intra- and Inter-Sensor Spatio-Temporal Signal for Multi-Sensor Wearable Human Activity Recognition\" has been accepted by AAAI 2025!",
        date:"2024.12.10",
        category:"News"
    },{
        id:2,
        title:"My portfolio website are deployed with vercel.",
        date: "2024.12.9",
        category: "News"
    },{
        id:3,
        title:"The UI of my portfolio are redesigned with bolt.",
        date: "2024.12.8",
        category: "News"
    }]
    
    
    return(
        <section className={`w-[800px] py-16 ${theme==='dark'}?'bg-gray-900':'bg-white'}`} id="update">
            <div className="container px-6">
                <h2 className={`text-3xl font-bold mb-8 ${theme==='dark'?'text-white':'text-gray-900'}`}
                    >
                    😍 Updates
                </h2>

                <div className={`flex flex-col gap-6 ${theme==='dark'?'text-white':'text-gray-900'}`}>
                    {updateList.map((update) => {
                        return (
                            <div
                                className={`flex flex-col gap-2 p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}
                                key={update.id}>

                                <div className={"flex flex-row justify-start items-center gap-4"}>
                                    <div>
                                        🔵 {update.category}
                                    </div>
                                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {update.date}
                                    </div>
                                </div>
                                <div>
                                    <b>{update.title}</b>
                                </div>

                            </div>

                        )
                    })}
                </div>


            </div>


        </section>
    )
}