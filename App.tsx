
import React, { useState, useEffect } from 'react';
import { Moon, Sparkles, BookOpen, Stars, Trash2, Wand2, Info, Loader2, Music, User, Zap } from 'lucide-react';
import { StoryTheme, StoryMood, StoryLength, StoryState, TargetAge, MagicIngredient } from './types';
import { generateStoryText, generateSpeech } from './services/geminiService';
import AudioPlayer from './components/AudioPlayer';

const App: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<StoryTheme>(StoryTheme.SPACE);
  const [selectedMood, setSelectedMood] = useState<StoryMood>(StoryMood.CALM);
  const [selectedLength, setSelectedLength] = useState<StoryLength>(StoryLength.SHORT);
  const [selectedAge, setSelectedAge] = useState<TargetAge>(TargetAge.PRESCHOOL);
  const [selectedIngredients, setSelectedIngredients] = useState<MagicIngredient[]>([]);
  
  const [storyState, setStoryState] = useState<StoryState>({
    title: '',
    content: '',
    isLoading: false
  });

  const [stars, setStars] = useState<{ id: number, x: number, y: number, size: number, duration: string }[]>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 120 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5,
      duration: `${3 + Math.random() * 7}s`
    }));
    setStars(newStars);
  }, []);

  const toggleIngredient = (ingredient: MagicIngredient) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredient) 
        ? prev.filter(i => i !== ingredient) 
        : [...prev, ingredient]
    );
  };

  const handleGenerateStory = async () => {
    setStoryState(prev => ({ ...prev, isLoading: true, error: undefined }));
    
    try {
      const story = await generateStoryText(
        selectedTheme, 
        selectedMood, 
        selectedLength, 
        selectedAge, 
        selectedIngredients
      );
      
      const audio = await generateSpeech(story.content);
      
      setStoryState({
        title: story.title,
        content: story.content,
        audioData: audio,
        isLoading: false
      });
    } catch (err) {
      console.error(err);
      setStoryState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'The dream characters were a bit shy. Let\'s try again!' 
      }));
    }
  };

  const reset = () => {
    setStoryState({ title: '', content: '', isLoading: false });
    setSelectedIngredients([]);
  };

  const loadingMessages = [
    "Gathering stardust...",
    "Waking up the forest spirits...",
    "Consulting with the moon...",
    "Stretching the dragon's wings...",
    "Sprinkling fairy dust...",
    "Painting the dream clouds...",
    "Polishing the crystal ball...",
    "Humming a lullaby..."
  ];
  
  const [loadingMsg, setLoadingMsg] = useState(loadingMessages[0]);

  useEffect(() => {
    let interval: number;
    if (storyState.isLoading) {
      interval = window.setInterval(() => {
        setLoadingMsg(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [storyState.isLoading]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 flex flex-col">
      {stars.map(star => (
        <div 
          key={star.id} 
          className="star" 
          style={{ 
            left: `${star.x}%`, 
            top: `${star.y}%`, 
            width: `${star.size}px`, 
            height: `${star.size}px`,
            '--duration': star.duration
          } as any}
        />
      ))}

      <header className="z-10 pt-8 pb-4 px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-slate-900/50 backdrop-blur-md px-6 py-2 rounded-full border border-slate-800 magical-glow mb-4">
          <Moon className="text-yellow-200 fill-yellow-200" size={20} />
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-200 via-indigo-200 to-blue-200">
            Dreamweaver
          </h1>
          <Stars className="text-yellow-200" size={20} />
        </div>
        <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto">
          Deeply refined stories tailored to every dreamer, every age, and every mood.
        </p>
      </header>

      <main className="z-10 flex-grow px-6 pb-24 flex flex-col items-center max-w-4xl mx-auto w-full">
        
        {!storyState.title && !storyState.isLoading && (
          <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            
            {/* Age Selection */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <User size={18} className="text-pink-400" />
                <h2 className="text-lg font-semibold text-slate-200">Who is the Dreamer?</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.values(TargetAge).map((age) => (
                  <button
                    key={age}
                    onClick={() => setSelectedAge(age)}
                    className={`p-3 rounded-2xl text-xs font-medium transition-all border ${
                      selectedAge === age 
                        ? 'bg-pink-600/30 border-pink-500 text-white magical-glow' 
                        : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </section>

            {/* Theme Selection */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={18} className="text-violet-400" />
                <h2 className="text-lg font-semibold text-slate-200">Adventure Theme</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.values(StoryTheme).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setSelectedTheme(theme)}
                    className={`p-3 rounded-2xl text-xs font-medium transition-all border ${
                      selectedTheme === theme 
                        ? 'bg-violet-600/30 border-violet-500 text-white magical-glow' 
                        : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </section>

            {/* Mood Selection */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Music size={18} className="text-indigo-400" />
                <h2 className="text-lg font-semibold text-slate-200">Story Mood</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.values(StoryMood).map((mood) => (
                  <button
                    key={mood}
                    onClick={() => setSelectedMood(mood)}
                    className={`p-3 rounded-2xl text-xs font-medium transition-all border ${
                      selectedMood === mood 
                        ? 'bg-indigo-600/30 border-indigo-500 text-white magical-glow' 
                        : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </section>

            {/* Magic Ingredients */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={18} className="text-yellow-400" />
                <h2 className="text-lg font-semibold text-slate-200">Magic Ingredients (Optional)</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.values(MagicIngredient).map((ing) => (
                  <button
                    key={ing}
                    onClick={() => toggleIngredient(ing)}
                    className={`p-3 rounded-2xl text-xs font-medium transition-all border ${
                      selectedIngredients.includes(ing) 
                        ? 'bg-yellow-600/30 border-yellow-500 text-white magical-glow' 
                        : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {ing}
                  </button>
                ))}
              </div>
            </section>

            {/* Length Selection */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Info size={18} className="text-blue-400" />
                <h2 className="text-lg font-semibold text-slate-200">Duration</h2>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {Object.values(StoryLength).map((len) => (
                  <button
                    key={len}
                    onClick={() => setSelectedLength(len)}
                    className={`p-3 rounded-2xl text-xs font-medium transition-all border ${
                      selectedLength === len 
                        ? 'bg-blue-600/30 border-blue-500 text-white magical-glow' 
                        : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {len.split(' (')[0]}
                  </button>
                ))}
              </div>
            </section>

            {storyState.error && (
              <div className="p-4 bg-red-900/20 border border-red-800 text-red-300 rounded-2xl text-center text-sm">
                {storyState.error}
              </div>
            )}
            
            <div className="pt-6">
              <button
                onClick={handleGenerateStory}
                className="w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:opacity-90 text-white py-5 rounded-3xl font-bold text-lg shadow-xl shadow-indigo-900/40 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <Wand2 size={24} />
                Weave the Magic
              </button>
            </div>
          </div>
        )}

        {storyState.isLoading && (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6 animate-pulse">
            <div className="relative">
              <Loader2 size={64} className="text-violet-500 animate-spin" />
              <Sparkles className="absolute -top-2 -right-2 text-yellow-300 animate-bounce" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white italic">"{loadingMsg}"</h2>
              <p className="text-slate-400">Blending {selectedTheme} with a touch of {selectedMood}...</p>
            </div>
          </div>
        )}

        {storyState.title && !storyState.isLoading && (
          <div className="w-full animate-in fade-in zoom-in-95 duration-700 space-y-8">
            <div className="flex justify-between items-center">
              <button 
                onClick={reset}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-slate-900/40 px-4 py-2 rounded-xl border border-slate-800"
              >
                <Trash2 size={18} />
                <span>Start Over</span>
              </button>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 bg-slate-900/40 px-4 py-2 rounded-xl border border-slate-800 text-violet-400 mb-2">
                  <BookOpen size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest">{selectedTheme}</span>
                </div>
                <span className="text-[10px] text-slate-500 uppercase tracking-tighter">For {selectedAge}</span>
              </div>
            </div>

            <article className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500" />
              
              <h1 className="text-3xl md:text-4xl font-black text-white mb-8 leading-tight">
                {storyState.title}
              </h1>
              
              <div className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed font-medium">
                {storyState.content.split('\n').map((paragraph, i) => (
                  <p key={i} className="mb-6 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>

            <div className="sticky bottom-8 w-full z-20">
              {storyState.audioData ? (
                <AudioPlayer base64Audio={storyState.audioData} />
              ) : (
                <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-3xl border border-slate-700/50 text-center text-slate-400 italic">
                  Summoning the narrator...
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="z-10 py-6 text-center text-slate-600 text-[10px] uppercase tracking-[0.2em]">
        &copy; {new Date().getFullYear()} Dreamweaver AI &bull; Personalized Sleep Journeys
      </footer>
    </div>
  );
};

export default App;
