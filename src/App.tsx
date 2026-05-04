import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, X, ChevronRight, ChevronLeft, Plus, Trash2, Loader2, Palette } from 'lucide-react';
import { BACKGROUND_COLORS, DEFAULT_VERSES, THEMES } from './constants';
import { AppSettings, BibleVerse, UpdateInterval, ThemeType } from './types';
import BackgroundEffect from './components/BackgroundEffect';

export default function App() {
  const [time, setTime] = useState(new Date());
  const [fileVerses, setFileVerses] = useState<BibleVerse[]>(DEFAULT_VERSES);
  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [newVerseText, setNewVerseText] = useState('');
  const [newVerseRef, setNewVerseRef] = useState('');
  
  const [settings, setSettings] = useState<AppSettings>(() => {
    const defaultSettings: AppSettings = {
      backgroundColor: BACKGROUND_COLORS[0].value,
      textColor: BACKGROUND_COLORS[0].text,
      interval: 1,
      customVerses: [],
      theme: 'forest', // 기본 테마를 'forest'로 변경
    };

    const saved = localStorage.getItem('bible-clock-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...defaultSettings, ...parsed };
      } catch (e) {
        console.error('Failed to parse settings', e);
      }
    }
    return defaultSettings;
  });

  // Fetch verses from JSON file
  useEffect(() => {
    const fetchVerses = async () => {
      try {
        const response = await fetch('/verses.json');
        if (!response.ok) throw new Error('Failed to fetch verses');
        const data = await response.json();
        setFileVerses(data);
      } catch (error) {
        console.error('Error loading verses:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVerses();
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('bible-clock-settings', JSON.stringify(settings));
  }, [settings]);

  // Combined verses (file + custom)
  const allVerses = useMemo(() => {
    return [...fileVerses, ...settings.customVerses];
  }, [fileVerses, settings.customVerses]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate verse index based on current time
  const verseIndex = useMemo(() => {
    if (allVerses.length === 0) return 0;
    const totalMinutes = time.getHours() * 60 + time.getMinutes();
    const intervalIndex = Math.floor(totalMinutes / settings.interval);
    return intervalIndex % allVerses.length;
  }, [time, allVerses.length, settings.interval]);

  const currentVerse = allVerses[verseIndex] || { text: '말씀을 불러오는 중입니다...', reference: '' };

  const formatDay = (date: Date) => {
    const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    return days[date.getDay()];
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}시 ${minutes}분`;
  };

  const toggleSettings = () => setShowSettings(!showSettings);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const addCustomVerse = () => {
    if (!newVerseText.trim()) return;
    const newVerse: BibleVerse = {
      text: newVerseText.trim(),
      reference: newVerseRef.trim() || '성경',
    };
    updateSettings({ customVerses: [...settings.customVerses, newVerse] });
    setNewVerseText('');
    setNewVerseRef('');
  };

  const removeCustomVerse = (index: number) => {
    const newCustom = [...settings.customVerses];
    newCustom.splice(index, 1);
    updateSettings({ customVerses: newCustom });
  };

  const currentTheme = THEMES.find(t => t.id === settings.theme) || THEMES[0];

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-black text-white">
        <Loader2 className="w-8 h-8 animate-spin opacity-50" />
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center transition-all duration-1000 overflow-hidden relative p-4 md:p-8"
      style={{ 
        backgroundColor: settings.theme === 'classic' ? settings.backgroundColor : 'transparent',
        color: currentTheme.textColor 
      }}
    >
      {/* Background Image Layer */}
      {settings.theme !== 'classic' && (
        <div className="fixed inset-0 z-[-2]">
          <img 
            src={currentTheme.image} 
            className="w-full h-full object-cover" 
            alt="background"
            referrerPolicy="no-referrer"
          />
          <div 
            className="absolute inset-0" 
            style={{ backgroundColor: currentTheme.overlay }}
          />
        </div>
      )}

      {/* Background Particle Effects */}
      <BackgroundEffect theme={settings.theme} />

      {/* Main Content Container */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center md:items-start justify-center gap-6 md:gap-16 z-10">
        
        {/* Left Side: Date */}
        <div className="flex flex-col items-center md:items-end select-none drop-shadow-lg">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={formatDay(time)}
            className="text-2xl md:text-5xl font-bold mb-1 md:mb-2"
          >
            {formatDay(time)}
          </motion.span>
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            key={time.getDate()}
            className="text-8xl md:text-[15rem] font-black leading-none"
          >
            {time.getDate()}
          </motion.span>
        </div>

        {/* Right Side: Time and Verse */}
        <div className="flex-1 flex flex-col justify-center max-w-2xl w-full text-center md:text-left drop-shadow-md">
          <motion.div 
            className="text-xl md:text-4xl font-medium mb-4 md:mb-8 flex items-center justify-center md:justify-start gap-2"
          >
            <span className="opacity-80">{formatTime(time)}</span>
          </motion.div>

          <div className="relative min-h-[160px] md:min-h-[200px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={verseIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col gap-3 md:gap-6"
              >
                <p className="text-lg md:text-3xl font-medium leading-relaxed tracking-tight">
                  {currentVerse.text}
                </p>
                <p className="text-base md:text-xl opacity-60 text-center md:text-right font-light italic">
                  {currentVerse.reference}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Settings Toggle Button */}
      <button 
        onClick={toggleSettings}
        className="absolute top-4 right-4 md:top-8 md:right-8 p-2 rounded-full hover:bg-white/20 transition-colors z-20 bg-black/10 backdrop-blur-sm"
        aria-label="Settings"
      >
        <Settings className="w-5 h-5 md:w-6 md:h-6 opacity-60 hover:opacity-100 transition-opacity" />
      </button>

      {/* Settings Panel Overlay */}
      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSettings}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full sm:w-96 bg-neutral-900 text-white p-6 md:p-8 shadow-2xl z-40 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold">설정</h2>
                <button onClick={toggleSettings} className="p-1 hover:bg-white/10 rounded">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-10">
                {/* Theme Selection */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium opacity-60 mb-4">
                    <Palette className="w-4 h-4" /> 배경 테마
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {THEMES.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => updateSettings({ theme: theme.id })}
                        className={`py-2 px-3 rounded-md text-sm transition-all ${
                          settings.theme === theme.id 
                            ? 'bg-white text-black font-bold' 
                            : 'bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        {theme.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Background Color Selection (Only for Classic) */}
                {settings.theme === 'classic' && (
                  <div>
                    <label className="block text-sm font-medium opacity-60 mb-4">배경 색상</label>
                    <div className="grid grid-cols-4 gap-3">
                      {BACKGROUND_COLORS.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => updateSettings({ backgroundColor: color.value, textColor: color.text })}
                          className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${
                            settings.backgroundColor === color.value ? 'border-blue-500 scale-110' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Interval Selection */}
                <div>
                  <label className="block text-sm font-medium opacity-60 mb-4">말씀 전환 간격</label>
                  <div className="flex gap-2">
                    {[1, 5].map((interval) => (
                      <button
                        key={interval}
                        onClick={() => updateSettings({ interval: interval as UpdateInterval })}
                        className={`flex-1 py-2 rounded-md border transition-colors ${
                          settings.interval === interval 
                            ? 'bg-white text-black border-white' 
                            : 'bg-transparent border-white/20 hover:border-white/40'
                        }`}
                      >
                        {interval}분
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Verse Management */}
                <div>
                  <label className="block text-sm font-medium opacity-60 mb-4">나만의 말씀 추가</label>
                  <div className="space-y-3">
                    <textarea 
                      value={newVerseText}
                      onChange={(e) => setNewVerseText(e.target.value)}
                      placeholder="말씀 내용을 입력하세요"
                      className="w-full bg-white/5 border border-white/10 rounded-md p-3 text-sm focus:outline-none focus:border-white/30 min-h-[80px]"
                    />
                    <input 
                      type="text"
                      value={newVerseRef}
                      onChange={(e) => setNewVerseRef(e.target.value)}
                      placeholder="장/절 (예: 시편 23:1)"
                      className="w-full bg-white/5 border border-white/10 rounded-md p-3 text-sm focus:outline-none focus:border-white/30"
                    />
                    <button 
                      onClick={addCustomVerse}
                      className="w-full bg-white text-black py-2 rounded-md font-bold hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> 추가하기
                    </button>
                  </div>

                  {settings.customVerses.length > 0 && (
                    <div className="mt-6 space-y-3">
                      <label className="block text-xs font-medium opacity-40 uppercase tracking-wider">추가된 말씀 목록</label>
                      {settings.customVerses.map((v, i) => (
                        <div key={i} className="flex items-start justify-between gap-3 p-3 bg-white/5 rounded-md group">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">{v.text}</p>
                            <p className="text-xs opacity-40">{v.reference}</p>
                          </div>
                          <button 
                            onClick={() => removeCustomVerse(i)}
                            className="p-1 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-400/10 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-12 pb-8">
                <p className="text-xs opacity-40 text-center">
                  Bible Verse Clock v1.3 (Seasonal Themes)
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
