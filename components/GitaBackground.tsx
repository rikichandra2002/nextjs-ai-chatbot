// src/components/GitaBackground.tsx
'use client';

import React, { useState, useEffect, ReactNode } from 'react';

interface GitaTheme {
  name: string;
  classes: string;
  quote: string;
  chapter: string;
}

interface GitaBackgroundProps {
  children: ReactNode;
  changeInterval?: number; // in milliseconds
}

export function GitaBackground({ 
  children, 
  changeInterval = 30000 // default to 30 seconds
}: GitaBackgroundProps): React.JSX.Element {
  const [currentTheme, setCurrentTheme] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  
  // Gita-inspired themes with descriptions
  const gitaThemes: GitaTheme[] = [
    {
      name: 'Wisdom (Jnana)',
      classes: 'bg-gradient-to-r from-amber-200 to-yellow-400',
      quote: '"The wise see knowledge and action as one."',
      chapter: '- Bhagavad Gita, 5.4',
    },
    {
      name: 'Cosmic Form (Vishwaroop)',
      classes: 'bg-gradient-to-r from-indigo-600 to-blue-400',
      quote: '"I am become Time, the destroyer of worlds."',
      chapter: '- Bhagavad Gita, 11.32',
    },
    {
      name: 'Dharma (Duty)',
      classes: 'bg-gradient-to-r from-green-400 to-emerald-600',
      quote: '"It is better to do one\'s own duty imperfectly than to do another\'s duty perfectly."',
      chapter: '- Bhagavad Gita, 18.47',
    },
    {
      name: 'Karma (Action)',
      classes: 'bg-gradient-to-r from-orange-500 to-rose-500',
      quote: '"You have the right to work, but never to the fruit of work."',
      chapter: '- Bhagavad Gita, 2.47',
    },
    {
      name: 'Devotion (Bhakti)',
      classes: 'bg-gradient-to-r from-pink-400 to-purple-600',
      quote: '"Whoever offers Me with devotion a leaf, a flower, fruit or water, I accept that offering of love."',
      chapter: '- Bhagavad Gita, 9.26',
    },
  ];
  
  // Change background periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      // After a short delay, change the theme and remove transition class
      setTimeout(() => {
        setCurrentTheme((prev) => (prev + 1) % gitaThemes.length);
        
        // Remove transition class after change is complete
        setTimeout(() => {
          setIsTransitioning(false);
        }, 1000);
      }, 500);
    }, changeInterval);
    
    return () => clearInterval(interval);
  }, [changeInterval, gitaThemes.length]);
  
  const currentThemeData = gitaThemes[currentTheme];
  
  return (
    <div 
      className={`min-h-screen transition-all duration-1000 ${
        isTransitioning ? 'opacity-90 scale-105' : 'opacity-100 scale-100'
      } ${currentThemeData.classes}`}
    >
      {/* Floating quote */}
      <div className="absolute bottom-4 right-4 max-w-xs p-4 rounded-lg bg-white/30 dark:bg-black/30 backdrop-blur-sm text-sm">
        <p className="italic">{currentThemeData.quote}</p>
        <p className="text-right mt-1 text-xs opacity-80">{currentThemeData.chapter}</p>
      </div>
      
      {/* Theme name indicator */}
      <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/30 dark:bg-black/30 backdrop-blur-sm text-xs">
        {currentThemeData.name}
      </div>
      
      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export default GitaBackground;