'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Leaf,
  Cat,
  Car,
  Music,
  Smile,
  Volume2,
  X,
  Loader2,
  Square,
} from 'lucide-react';
import type { Icon as LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { synthesizeSpeech } from '@/ai/flows/synthesize-speech';

type Sound = {
  name: string;
  description: string;
};

type Category = {
  name: string;
  icon: LucideIcon;
  sounds: Sound[];
  cardColor: string;
  color: string;
  textColor: string;
  iconColor: string;
};

const soundData: Category[] = [
  {
    name: 'Natureza',
    icon: Leaf,
    cardColor: 'bg-green-50 dark:bg-green-900/30',
    color: 'bg-green-100 dark:bg-green-900/60',
    textColor: 'text-green-900 dark:text-green-200',
    iconColor: 'text-green-600 dark:text-green-400',
    sounds: [
      { name: 'Chuva', description: 'O som calmante da chuva caindo.' },
      { name: 'Vento', description: 'O som do vento soprando suavemente.' },
      { name: 'Pássaros', description: 'O canto alegre dos pássaros pela manhã.' },
    ],
  },
  {
    name: 'Animais',
    icon: Cat,
    cardColor: 'bg-orange-50 dark:bg-orange-900/30',
    color: 'bg-orange-100 dark:bg-orange-900/60',
    textColor: 'text-orange-900 dark:text-orange-200',
    iconColor: 'text-orange-600 dark:text-orange-400',
    sounds: [
      { name: 'Cachorro', description: 'O latido amigável de um cachorro.' },
      { name: 'Gato', description: 'O miado suave de um gato.' },
      { name: 'Vaca', description: 'O mugido de uma vaca no pasto.' },
    ],
  },
  {
    name: 'Objetos',
    icon: Car,
    cardColor: 'bg-sky-50 dark:bg-sky-900/30',
    color: 'bg-sky-100 dark:bg-sky-900/60',
    textColor: 'text-sky-900 dark:text-sky-200',
    iconColor: 'text-sky-600 dark:text-sky-400',
    sounds: [
      { name: 'Telefone', description: 'O som de um telefone antigo tocando.' },
      { name: 'Carro', description: 'O som de um carro passando na rua.' },
      { name: 'Relógio', description: 'O tique-taque de um relógio de parede.' },
    ],
  },
  {
    name: 'Instrumentos',
    icon: Music,
    cardColor: 'bg-purple-50 dark:bg-purple-900/30',
    color: 'bg-purple-100 dark:bg-purple-900/60',
    textColor: 'text-purple-900 dark:text-purple-200',
    iconColor: 'text-purple-600 dark:text-purple-400',
    sounds: [
      { name: 'Violão', description: 'O som das cordas de um violão.' },
      { name: 'Piano', description: 'Uma melodia suave tocada no piano.' },
      { name: 'Bateria', description: 'O ritmo contagiante de uma bateria.' },
    ],
  },
  {
    name: 'Emoções',
    icon: Smile,
    cardColor: 'bg-yellow-50 dark:bg-yellow-900/30',
    color: 'bg-yellow-100 dark:bg-yellow-900/60',
    textColor: 'text-yellow-900 dark:text-yellow-200',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    sounds: [
      { name: 'Risada', description: 'O som de uma criança rindo feliz.' },
      { name: 'Choro', description: 'O som de um bebê chorando.' },
      { name: 'Surpresa', description: 'Um som de espanto e surpresa.' },
    ],
  },
];

export default function SoundDiscoveryPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [loadingSound, setLoadingSound] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioCache, setAudioCache] = useState<Record<string, string>>({});


  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleClearSelection = () => {
    setSelectedCategory(null);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayingSound(null);
  };

  const playSound = async (soundName: string, soundDescription: string) => {
    if (audioRef.current && playingSound === soundName) {
      audioRef.current.pause();
      setPlayingSound(null);
      return;
    }

    setLoadingSound(soundName);
    setPlayingSound(null);

    try {
      let audioDataUri = audioCache[soundName];
      if (!audioDataUri) {
        const result = await synthesizeSpeech(`${soundName}. ${soundDescription}`);
        audioDataUri = result.audioDataUri;
        setAudioCache((prev) => ({ ...prev, [soundName]: audioDataUri }));
      }

      if (audioRef.current) {
        audioRef.current.src = audioDataUri;
        audioRef.current.play().catch((e) => console.error("Error playing audio:", e));
        setPlayingSound(soundName);
      }
    } catch (error) {
      console.error('Error synthesizing speech:', error);
    } finally {
      setLoadingSound(null);
    }
  };

  return (
    <div className="w-full">
      <audio ref={audioRef} onEnded={() => setPlayingSound(null)} />
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-headline text-foreground">Descobrindo Sons</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Explore um mundo de sons! Toque em uma categoria para começar a ouvir.
        </p>
      </div>

      {selectedCategory ? (
        <Card className={cn("shadow-lg rounded-2xl animate-in fade-in-50", selectedCategory.color)}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <selectedCategory.icon className={cn("w-8 h-8", selectedCategory.iconColor)} />
              <CardTitle className={cn("text-3xl font-headline", selectedCategory.textColor)}>{selectedCategory.name}</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClearSelection} aria-label="Fechar categoria" className={cn(selectedCategory.textColor, "hover:bg-black/10")}>
              <X className="w-6 h-6" />
            </Button>
          </CardHeader>
          <CardContent>
            <p className={cn("mb-6", selectedCategory.textColor, "opacity-80")}>Toque em uma linha para ouvir o som e aprender sobre ele.</p>
            <div className="space-y-4">
              {selectedCategory.sounds.map((sound) => (
                <button
                  key={sound.name}
                  onClick={() => playSound(sound.name, sound.description)}
                  className="w-full flex items-center justify-between p-4 bg-background/50 dark:bg-background/20 rounded-xl text-left transition-all duration-200 ease-in-out transform hover:scale-[1.02] hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
                  aria-label={`Tocar som de ${sound.name}`}
                  disabled={loadingSound !== null}
                >
                  <div>
                    <h3 className={cn("text-xl font-semibold", selectedCategory.textColor)}>{sound.name}</h3>
                    <p className={cn(selectedCategory.textColor, "opacity-70")}>{sound.description}</p>
                  </div>
                  {loadingSound === sound.name ? (
                    <Loader2 className={cn("w-8 h-8 flex-shrink-0 animate-spin", selectedCategory.iconColor)} />
                  ) : playingSound === sound.name ? (
                    <Square className={cn("w-8 h-8 flex-shrink-0", selectedCategory.iconColor)} />
                  ) : (
                    <Volume2 className={cn("w-8 h-8 flex-shrink-0", selectedCategory.iconColor)} />
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {soundData.map((category) => (
            <Card
              key={category.name}
              className={cn(
                  "shadow-lg rounded-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:shadow-xl hover:brightness-105",
                  category.cardColor
              )}
              onClick={() => handleSelectCategory(category)}
              onKeyDown={(e) => e.key === 'Enter' && handleSelectCategory(category)}
              tabIndex={0}
              role="button"
              aria-label={`Abrir categoria de sons: ${category.name}`}
            >
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <category.icon className={cn("w-16 h-16 mb-4", category.iconColor)} />
                <h2 className={cn("text-2xl font-bold font-headline", category.textColor)}>
                  {category.name}
                </h2>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
