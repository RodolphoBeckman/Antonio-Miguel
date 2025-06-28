'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { synthesizeSpeech } from '@/ai/flows/synthesize-speech';

type SettingsContextType = {
  isCustomAudioEnabled: boolean;
  toggleCustomAudio: () => void;
  isInitialized: boolean;
  // This state holds both user-uploaded sounds and AI-generated cached sounds.
  // Keys for user sounds are like 'drawing-sound'.
  // Keys for cached sounds are like 'drawing-sound_ai_cache'.
  customSounds: Record<string, string>;
  setSound: (key: string, audioDataUri: string) => void;
  loadSound: (key: string, prompt: string) => Promise<string>;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [isCustomAudioEnabled, setIsCustomAudioEnabled] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [customSounds, setCustomSounds] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const storedAudioEnabled = localStorage.getItem('isCustomAudioEnabled');
      if (storedAudioEnabled !== null) {
        setIsCustomAudioEnabled(JSON.parse(storedAudioEnabled));
      }
      
      const storedCustomSounds = localStorage.getItem('customSounds');
      if (storedCustomSounds) {
        setCustomSounds(JSON.parse(storedCustomSounds));
      } else {
        // Simple migration logic from old cache keys for a better user experience
        const oldCaches: Record<string, string> = {};
        const drawingSound = localStorage.getItem('drawingSoundCache');
        if (drawingSound) oldCaches['drawing-sound_ai_cache'] = drawingSound;
        
        const followLightSound = localStorage.getItem('followLightSoundCache');
        if (followLightSound) oldCaches['follow-light-sound_ai_cache'] = followLightSound;

        const touchGameSound = localStorage.getItem('touchGameSound');
        if (touchGameSound) oldCaches['touch-game-sound_ai_cache'] = touchGameSound;

        const oldCustomAudio = localStorage.getItem('customAudio');
        if (oldCustomAudio) {
            const parsedOld = JSON.parse(oldCustomAudio);
            Object.keys(parsedOld).forEach(name => {
                const key = `discovery-${name.toLowerCase().replace(/\s/g, '-')}`;
                oldCaches[key] = parsedOld[name];
            });
        }
        
        const oldAudioCache = localStorage.getItem('audioCache');
        if (oldAudioCache) {
            const parsedOld = JSON.parse(oldAudioCache);
            Object.keys(parsedOld).forEach(name => {
                const key = `discovery-${name.toLowerCase().replace(/\s/g, '-')}_ai_cache`;
                oldCaches[key] = parsedOld[name];
            });
        }

        if (Object.keys(oldCaches).length > 0) {
            setCustomSounds(oldCaches);
            localStorage.setItem('customSounds', JSON.stringify(oldCaches));
            // Remove old keys to clean up
            localStorage.removeItem('drawingSoundCache');
            localStorage.removeItem('followLightSoundCache');
            localStorage.removeItem('touchGameSound');
            localStorage.removeItem('customAudio');
            localStorage.removeItem('audioCache');
        }
      }
    } catch (error) {
        console.error("Failed to parse settings from localStorage", error);
    }
    setIsInitialized(true);
  }, []);

  const toggleCustomAudio = () => {
    const newValue = !isCustomAudioEnabled;
    setIsCustomAudioEnabled(newValue);
    try {
        localStorage.setItem('isCustomAudioEnabled', JSON.stringify(newValue));
    } catch (error) {
        console.error("Failed to save settings to localStorage", error);
    }
  };

  const setSound = useCallback((key: string, audioDataUri: string) => {
    setCustomSounds(prevSounds => {
        const newSounds = { ...prevSounds, [key]: audioDataUri };
        try {
            localStorage.setItem('customSounds', JSON.stringify(newSounds));
        } catch (e) {
            console.error("Could not save custom audio to localStorage. Storage might be full.", e);
            throw e; // Rethrow to be caught by the component
        }
        return newSounds;
    });
  }, []);

  const loadSound = useCallback(async (key: string, prompt: string): Promise<string> => {
    // 1. Check for user-uploaded custom sound
    if (isCustomAudioEnabled && customSounds[key]) {
      return customSounds[key];
    }

    // 2. Check for AI-generated cached sound
    const cachedSoundKey = `${key}_ai_cache`;
    if (customSounds[cachedSoundKey]) {
        return customSounds[cachedSoundKey];
    }

    // 3. Generate new sound
    const result = await synthesizeSpeech(prompt);
    if (!result.audioDataUri) {
        throw new Error("Não foi possível gerar o áudio a partir do prompt.");
    }
    
    // 4. Cache the new sound
    try {
        setSound(cachedSoundKey, result.audioDataUri);
    } catch (e) {
        console.warn('Failed to cache sound:', e);
    }

    return result.audioDataUri;
  }, [customSounds, isCustomAudioEnabled, setSound]);

  const value = { isCustomAudioEnabled, toggleCustomAudio, isInitialized, customSounds, setSound, loadSound };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
