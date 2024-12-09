import { useEffect, useState } from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function AnimatedText({ text, className = '', delay = 0 }: AnimatedTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex === text.length) return;

    const timeout = setTimeout(() => {
      setDisplayedText(prev => prev + text[currentIndex]);
      setCurrentIndex(prev => prev + 1);
    }, 100 + delay);

    return () => clearTimeout(timeout);
  }, [currentIndex, text, delay]);

  return (
    <span className={`${className} inline-block`}>
      {displayedText}
      <span className="animate-blink">|</span>
    </span>
  );
}