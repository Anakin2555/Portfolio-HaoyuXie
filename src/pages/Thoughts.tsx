import { useState,useEffect, useRef } from 'react';
// import Masonry from 'react-masonry-css';
import { thoughts } from '../data/thoughts';
import { ThoughtCard } from '../components/thoughts/ThoughtCard';

export default function Thoughts() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [columns,setColumns]=useState<number>(0);
  const [columnWidth, setColumnWidth] = useState<number>(0);
  const breakpointColumns: { [key: number]: number } = {
    1200: 3,
    700: 2,
    0: 1,
  };
  const toggleExpand = (id: string, expanded: boolean) => {
    setExpandedId(expanded ? id : null);
  };

  const handleResize = () => {
    if (containerRef.current) {
      const width = containerRef.current.clientWidth - 32;
      let columns = 1; // 默认列数

      // 提取并排序断点
      const breakpoints = Object.keys(breakpointColumns).map(Number).sort((a, b) => b - a);
      
      // 根据当前宽度选择列数
      for (const breakpoint of breakpoints) {          
        if (document.documentElement.clientWidth >= breakpoint) {
          setColumns(breakpointColumns[breakpoint]);
          columns=breakpointColumns[breakpoint];
          break;
        }
      }
      console.log(document.documentElement.clientWidth,columns);
      
      setColumnWidth(width / columns); // 根据列数设置列宽
    }
  };

  
  useEffect(() => {
    handleResize(); // 初始化列宽
    window.addEventListener('resize', handleResize); // 监听窗口大小变化

    return () => window.removeEventListener('resize', handleResize); // 清理事件监听
  }, []);


  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Thoughts & Musings
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Personal reflections on technology, career, and life as a developer.
          </p>
        </header>



        {/* 1. Masonry 库实现瀑布流 */}
        {/* <Masonry
          breakpointCols={breakpointColumns}
          className="flex -ml-6 w-auto"
          columnClassName="pl-6"
        >
          {thoughts.map((thought) => (
            <div className="mb-6" key={thought.id}>
              <ThoughtCard
                thought={thought}
                isExpanded={expandedId === thought.id}
                onToggle={toggleExpand}
              />
            </div>
          ))}
        </Masonry> */}


        {/* {2. flex 布局实现瀑布流} */}
        <div ref={containerRef} style={{ display: 'flex', flexDirection: 'row', gap: '16px' }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} style={{ width: `${columnWidth}px` }}>
              {thoughts
                .filter((_, index) => index % columns === colIndex) // 根据列索引分配卡片
                .map((item) => (
                  <div className='mb-4' key={item.id}>
                    <ThoughtCard thought={item} isExpanded={expandedId === item.id} onToggle={toggleExpand} />
                  </div>
                ))}
            </div>
          ))}
        </div>

        {/* <div className='flex flex-row flex-nowrap gap-6 w-[600px]'>
          {['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q'].map((item,index) => (
            <div className={`w-[60px] ${index===2?'shrink':'shrink-0'} bg-white h-8 rounded-lg text-center`}>
              {item}
            </div>
          ))}
        </div> */}

      </div>
    </div>
  );
}