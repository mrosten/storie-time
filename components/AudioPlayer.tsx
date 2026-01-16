
import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import { decodeBase64, decodePCM } from '../services/geminiService';

interface AudioPlayerProps {
  base64Audio: string;
  onEnded?: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ base64Audio, onEnded }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);

  useEffect(() => {
    const initAudio = async () => {
      if (!base64Audio) return;
      
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = ctx;
      
      const decodedData = decodeBase64(base64Audio);
      const audioBuffer = await decodePCM(decodedData, ctx);
      bufferRef.current = audioBuffer;
      
      // Auto-play on load
      play();
    };

    initAudio();

    return () => {
      stop();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [base64Audio]);

  const play = () => {
    if (!audioContextRef.current || !bufferRef.current || isPlaying) return;

    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const source = ctx.createBufferSource();
    source.buffer = bufferRef.current;
    source.connect(ctx.destination);
    
    source.onended = () => {
      if (isPlaying) {
        setIsPlaying(false);
        setProgress(0);
        pausedAtRef.current = 0;
        if (onEnded) onEnded();
      }
    };

    const offset = pausedAtRef.current;
    source.start(0, offset);
    startTimeRef.current = ctx.currentTime - offset;
    sourceNodeRef.current = source;
    setIsPlaying(true);
  };

  const pause = () => {
    if (!isPlaying || !sourceNodeRef.current || !audioContextRef.current) return;
    
    pausedAtRef.current = audioContextRef.current.currentTime - startTimeRef.current;
    sourceNodeRef.current.stop();
    sourceNodeRef.current = null;
    setIsPlaying(false);
  };

  const stop = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current = null;
    }
    pausedAtRef.current = 0;
    setIsPlaying(false);
    setProgress(0);
  };

  useEffect(() => {
    let animationFrame: number;
    const updateProgress = () => {
      if (isPlaying && audioContextRef.current && bufferRef.current) {
        const currentPos = audioContextRef.current.currentTime - startTimeRef.current;
        const duration = bufferRef.current.duration;
        setProgress((currentPos / duration) * 100);
      }
      animationFrame = requestAnimationFrame(updateProgress);
    };
    updateProgress();
    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying]);

  return (
    <div className="w-full bg-slate-800/50 backdrop-blur-md p-6 rounded-3xl border border-slate-700/50 magical-glow flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-violet-500/20 p-3 rounded-full text-violet-400">
            <Volume2 size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">Now Playing</p>
            <h3 className="text-xl font-bold text-white">Narration</h3>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => { stop(); play(); }}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw size={20} />
          </button>
          <button 
            onClick={isPlaying ? pause : play}
            className="w-14 h-14 bg-violet-600 hover:bg-violet-500 rounded-full flex items-center justify-center text-white transition-all transform active:scale-95 shadow-lg shadow-violet-900/40"
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-100 ease-linear"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500 font-medium">
          <span>{Math.floor((pausedAtRef.current || (progress / 100 * (bufferRef.current?.duration || 0))) / 60)}:{(Math.floor((pausedAtRef.current || (progress / 100 * (bufferRef.current?.duration || 0))) % 60)).toString().padStart(2, '0')}</span>
          <span>{bufferRef.current ? `${Math.floor(bufferRef.current.duration / 60)}:${(Math.floor(bufferRef.current.duration % 60)).toString().padStart(2, '0')}` : '0:00'}</span>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
