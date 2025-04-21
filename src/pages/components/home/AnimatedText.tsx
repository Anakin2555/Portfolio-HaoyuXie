import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';

interface AnimatedTextProps {
  text: string[];
  className?: string;
  delay?: number;
  circulate?: boolean;
}

export default function AnimatedText({ 
  text, 
  className = '', 
  delay = 0,
  circulate = true
}: AnimatedTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [textArrayIndex, setTextArrayIndex] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'waiting' | 'deleting'>('typing');
  const { language } = useLanguage();
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Reset animation when text or language changes
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    setTextArrayIndex(0);
    setPhase('typing');
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, language]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    switch (phase) {
      case 'typing':
        if (currentIndex === text[textArrayIndex].length) {
          if (!circulate && textArrayIndex === text.length - 1) {
            return;
          }
          timeout = setTimeout(() => setPhase('waiting'), 1500);
        } else {
          timeout = setTimeout(() => {
            setDisplayedText(prev => prev + text[textArrayIndex][currentIndex]);
            setCurrentIndex(prev => prev + 1);
          }, delay);
        }
        break;

      case 'waiting':
        timeout = setTimeout(() => setPhase('deleting'), 1000);
        break;

      case 'deleting':
        if (displayedText.length === 0) {
          setPhase('typing');
          setCurrentIndex(0);
          setTextArrayIndex(prev => (prev + 1) % text.length);
        
        } else {
          timeout = setTimeout(() => {
            setDisplayedText(prev => prev.slice(0, -1));
          }, 20);
        }
        break;
    }

    return () => clearTimeout(timeout);
  }, [text, delay, phase, currentIndex, textArrayIndex, displayedText, circulate]);

  return (
    <span className={`${className} inline-block`}>
      {displayedText}
      <span className="animate-blink">|</span>
    </span>
  );
}