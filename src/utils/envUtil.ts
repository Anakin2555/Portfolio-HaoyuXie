// 环境工具类
class EnvUtil {
  // 检查是否是浏览器环境
  static isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // 获取 Vite 环境变量
  static getViteEnv() {
    return this.isBrowser() ? import.meta.env : null;
  }

  // 检查是否是开发环境
  static isDevelopment(): boolean {
    const viteEnv = this.getViteEnv();
    return viteEnv?.DEV === true || 
           viteEnv?.MODE === 'development' || 
           viteEnv?.VITE_NODE_ENV === 'development';
  }

  // 检查是否是生产环境
  static isProduction(): boolean {
    const viteEnv = this.getViteEnv();
    return viteEnv?.PROD === true || 
           viteEnv?.MODE === 'production';
  }

  // 检查是否是 Vercel 环境
  static isVercel(): boolean {
    const viteEnv = this.getViteEnv();
    return viteEnv?.VITE_VERCEL === '1';
  }

  // 获取当前环境信息
  static getEnvInfo() {
    const viteEnv = this.getViteEnv();
    return {
      isDev: this.isDevelopment(),
      isProd: this.isProduction(),
      isVercel: this.isVercel(),
      dev: viteEnv?.DEV,
      mode: viteEnv?.MODE,
      nodeEnv: viteEnv?.VITE_NODE_ENV,
      vercel: viteEnv?.VITE_VERCEL
    };
  }
}

export default EnvUtil; 