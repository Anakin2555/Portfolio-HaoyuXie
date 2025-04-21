import { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import musicFile from '../../assets/music/Hot Blooded.mp3';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number>();
  const { theme } = useTheme();
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isEnded, setIsEnded] = useState(false);

  const musicFiles = [musicFile];

  // 初始化音频上下文
  useEffect(() => {
    let audio = new Audio(musicFiles[currentTrackIndex]);
    audioRef.current = audio;
    const context = new AudioContext();
    const source = context.createMediaElementSource(audio);
    const analyserNode = context.createAnalyser();
    
    source.connect(analyserNode);
    analyserNode.connect(context.destination);
    
    setAudioContext(context);
    setAnalyser(analyserNode);

    // 处理音频结束事件
    const handleEnded = () => {
      setIsPlaying(false); // 先停止播放状态
      setCurrentTrackIndex(prev => (prev + 1) % musicFiles.length);
      setIsEnded(true);
      
      // 重新添加事件监听，等待用户交互
      document.addEventListener('click', handleInteraction);
      document.addEventListener('scroll', handleInteraction);
      document.addEventListener('touchstart', handleInteraction);
    };

    const startPlayback = async () => {
      try {
        await context.resume();
        const playPromise = Promise.race([
          audio.play(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 1000)
          )
        ]);

        playPromise.then(() => {
          setIsPlaying(true);
          if (canvasRef.current) {
            drawSpectrumWithAnalyser(analyserNode);
          }
        }).catch((error) => {
          console.log('Playback failed:', error);
          setIsPlaying(false);
        });

      } catch (error) {
        console.log('Playback failed:', error);
        setIsPlaying(false);
      }
    };

    const handleInteraction = () => {
      startPlayback();
      // 移除事件监听
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('scroll', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };

    // 初始添加事件监听
    document.addEventListener('click', handleInteraction);
    document.addEventListener('scroll', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);

    // 添加音频结束事件监听
    audio.addEventListener('ended', handleEnded);

    return () => {
      // 清理事件监听
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('scroll', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      audio.removeEventListener('ended', handleEnded);
      context.close();
      audio.remove();
    };
  }, [isEnded]); 


  
  // 监听主题变化
  useEffect(() => {
    // 只要有 analyser 和 canvas 就重新绘制，不管是否正在播放
    if (analyser && canvasRef.current) {
      // 取消现有的动画
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      // 重新开始绘制
      drawSpectrumWithAnalyser(analyser);
    }
  }, [theme]);



  // 绘制频谱图
  const drawSpectrumWithAnalyser = (analyserNode: AnalyserNode) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyserNode.getByteFrequencyData(dataArray); 
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = (canvas.width / bufferLength) * 20;
      let x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        
        ctx.fillStyle = theme === 'dark' 
          ? `rgba(255, 255, 255, ${barHeight/canvas.height})`
          : `rgba(0, 0, 0, ${barHeight/canvas.height})`;
        
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 2.5;
      }
    };
    
    draw();
  };



  // 切换播放状态
  const togglePlay = async () => {
    if (!audioRef.current || !audioContext) return;

    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    if (isPlaying) {
      audioRef.current.pause();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    } else {
      await audioRef.current.play();
      if (analyser) {
        drawSpectrumWithAnalyser(analyser);
      }
    }
    
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex items-center gap-2">
      <canvas
        ref={canvasRef}
        width="60"
        height="24"
        className={`rounded-lg ${isPlaying ? 'opacity-100' : 'opacity-50'}`}
      />
      <button
        onClick={togglePlay}
        // className={`p-2 rounded-full transition-colors ${
        //   theme === 'dark'
        //     ? 'bg-violet-600 hover:bg-violet-700'
        //     : 'bg-indigo-600 hover:bg-indigo-700'
        // }`}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying ? (
          <Pause className={`w-4 h-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`} />
        ) : (
          <Play className={`w-4 h-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`} />
        )}
      </button>
    </div>
  );
} 