import React, { createContext, useContext, useState } from 'react';

interface AudioContextType {
  analyser: AnalyserNode | null;
  setAnalyser: (analyser: AnalyserNode) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  return (
    <AudioContext.Provider value={{ analyser, setAnalyser }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
} 