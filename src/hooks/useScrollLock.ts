import { useEffect } from 'react';

export const useScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (isLocked) {
      // 获取滚动条宽度
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      const scrollY = window.scrollY;

      // 添加全局样式
      document.documentElement.style.setProperty('--scrollbar-compensation', `${scrollBarWidth}px`);
      
      // 锁定body和header
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      // 给body和header添加padding补偿
      document.body.style.paddingRight = 'var(--scrollbar-compensation)';
      const header = document.querySelector('header');
      if (header) {
        header.style.paddingRight = 'var(--scrollbar-compensation)';
      }
    } else {
      // 恢复滚动位置
      const scrollY = document.body.style.top;
      
      // 清除所有添加的样式
      document.documentElement.style.removeProperty('--scrollbar-compensation');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      
      // 清除header的padding
      const header = document.querySelector('header');
      if (header) {
        header.style.paddingRight = '';
      }

      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    return () => {
      // Cleanup
      document.documentElement.style.removeProperty('--scrollbar-compensation');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      
      const header = document.querySelector('header');
      if (header) {
        header.style.paddingRight = '';
      }
    };
  }, [isLocked]);
}; 