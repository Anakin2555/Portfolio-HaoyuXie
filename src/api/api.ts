// 定义环境变量类型
declare global {
  interface Window {
    env?: {
      NODE_ENV?: string;
      VERCEL?: string;
    }
  }
}

// API 类型
export enum ApiMode {
  LOCAL = 'local',     // 本地开发 API
  PROXY = 'proxy',     // 代理 API
  REMOTE = 'remote'    // 远程 API
}

// 从本地存储获取 API 模式
const getStoredApiMode = (): ApiMode | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem('api_mode');
    return stored as ApiMode || null;
  } catch (e) {
    return null;
  }
};

// 设置 API 模式并保存到本地存储
export const setApiMode = (mode: ApiMode): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('api_mode', mode);
    // 重新加载页面以应用新的 API 地址
    window.location.reload();
  } catch (e) {
    console.error('无法保存 API 模式:', e);
  }
};

// 根据环境动态选择 API URL
const getApiUrl = () => {
  // 检查是否是在浏览器环境
  const isBrowser = typeof window !== 'undefined';
  
  // 直接读取 Vite 环境变量
  const viteEnv = isBrowser ? import.meta.env : null;
  
  // 获取环境变量
  const isDevelopment = viteEnv?.DEV === true || viteEnv?.MODE === 'development' || viteEnv?.VITE_NODE_ENV === 'development';
  const isVercel = viteEnv?.VITE_VERCEL === '1';
  
  // 检查本地存储中的手动设置
  const storedMode = getStoredApiMode();
  
  // 调试信息
  console.log('环境变量:', {
    isDev: isDevelopment,
    isVercel: isVercel,
    dev: viteEnv?.DEV,
    mode: viteEnv?.MODE,
    nodeEnv: viteEnv?.VITE_NODE_ENV,
    vercel: viteEnv?.VITE_VERCEL,
    storedMode
  });

  // 优先使用手动设置的 API 模式
  if (storedMode === ApiMode.LOCAL) {
    console.log('使用手动设置的本地 API');
    return 'http://localhost:3001/api';
  } else if (storedMode === ApiMode.PROXY) {
    console.log('使用手动设置的代理 API');
    return '/api';
  } else if (storedMode === ApiMode.REMOTE) {
    console.log('使用手动设置的远程 API');
    return 'https://api.haoyuxie.xyz';
  }

  // 根据环境自动选择
  if (isDevelopment) {
    // 本地开发环境
    console.log('使用本地开发环境 API');
    return 'http://localhost:3001/api';
  } else if (isVercel) {
    // Vercel 生产环境，使用相对路径通过中间件代理
    console.log('使用 Vercel 代理 API');
    return '/api';
  } else {
    // 其他生产环境，直接连接后端
    console.log('使用生产环境 API');
    return 'http://118.31.186.204:3001/api';
  }
};

export const API_URL = getApiUrl();
