// import React, { useState, useEffect } from 'react';
// import { ApiMode, setApiMode } from '../api/api';

// const ApiModeSwitcher: React.FC = () => {
//   const [currentMode, setCurrentMode] = useState<ApiMode | null>(null);
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     // 尝试从本地存储获取当前模式
//     try {
//       const stored = localStorage.getItem('api_mode') as ApiMode | null;
//       setCurrentMode(stored);
//     } catch (e) {
//       console.error('无法读取 API 模式:', e);
//     }
//   }, []);

//   const handleModeChange = (mode: ApiMode) => {
//     setApiMode(mode);
//     setCurrentMode(mode);
//   };

//   // 仅在开发环境或手动查询参数下显示
//   useEffect(() => {
//     const isDev = import.meta.env.DEV === true;
//     const showSwitcher = new URLSearchParams(window.location.search).get('showApiSwitcher') === 'true';
//     setIsVisible(isDev || showSwitcher);
//   }, []);

//   if (!isVisible) return null;

//   return (
//     <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg z-50 text-sm">
//       <div className="font-bold mb-1 text-black dark:text-white">API 模式:</div>
//       <div className="flex flex-col space-y-1">
//         <button
//           onClick={() => handleModeChange(ApiMode.LOCAL)}
//           className={`px-2 py-1 rounded ${
//             currentMode === ApiMode.LOCAL
//               ? 'bg-blue-500 text-white'
//               : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'
//           }`}
//         >
//           本地 API
//         </button>
//         <button
//           onClick={() => handleModeChange(ApiMode.PROXY)}
//           className={`px-2 py-1 rounded ${
//             currentMode === ApiMode.PROXY
//               ? 'bg-blue-500 text-white'
//               : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'
//           }`}
//         >
//           代理 API
//         </button>
//         <button
//           onClick={() => handleModeChange(ApiMode.REMOTE)}
//           className={`px-2 py-1 rounded ${
//             currentMode === ApiMode.REMOTE
//               ? 'bg-blue-500 text-white'
//               : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'
//           }`}
//         >
//           远程 API
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ApiModeSwitcher; 