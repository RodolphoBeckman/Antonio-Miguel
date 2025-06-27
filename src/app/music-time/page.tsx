'use client';

import { FeatureCard } from '@/components/feature-card';
import { Button } from '@/components/ui/button';
import { Mic, Repeat } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const sequence = ['red', 'blue', 'yellow', 'green'];
const noteColors: { [key: string]: string } = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  yellow: 'bg-yellow-400',
  green: 'bg-green-500',
};

function RepeatTheSoundGame() {
  const [activeNote, setActiveNote] = useState<string | null>(null);

  const playSequence = () => {
    sequence.forEach((note, index) => {
      setTimeout(() => {
        setActiveNote(note);
        setTimeout(() => setActiveNote(null), 300);
      }, (index + 1) * 500);
    });
  };

  return (
    <div className="p-4 bg-secondary rounded-2xl">
      <div className="flex justify-center gap-4 my-4">
        {sequence.map((color) => (
          <div
            key={color}
            className={cn(
              "w-20 h-20 rounded-full border-4 border-white/50 transition-all duration-200",
              noteColors[color],
              activeNote === color ? 'scale-110 shadow-lg shadow-black/30' : 'opacity-70'
            )}
            aria-label={`Nota ${color}`}
          />
        ))}
      </div>
      <p className="text-center text-muted-foreground text-lg mb-4">
        Ouça a sequência e tente repetir os sons tocando na tela.
      </p>
      <div className="text-center">
        <Button onClick={playSequence} size="lg">
          <Repeat className="mr-2" /> Tocar Sequência
        </Button>
      </div>
    </div>
  );
}

const karaokeLyrics = [
  "Brilha, brilha, estrelinha",
  "Quero ver você brilhar",
  "Lá no alto, lá no céu",
  "Num desenho de cordel"
];

function SingAlongGame() {
    const [currentLine, setCurrentLine] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
  
    useEffect(() => {
      let interval: NodeJS.Timeout | undefined = undefined;
      if (isPlaying) {
        interval = setInterval(() => {
          setCurrentLine(prev => (prev + 1) % karaokeLyrics.length);
        }, 3000);
      }
      return () => {
        if (interval) clearInterval(interval);
      }
    }, [isPlaying]);

    const handlePlay = () => {
        if (!isPlaying) {
            setCurrentLine(0);
        }
        setIsPlaying(!isPlaying);
    }
  
    return (
      <div className="p-6 bg-secondary rounded-2xl text-center">
        <div className="min-h-[8rem] flex items-center justify-center bg-background rounded-xl p-4 mb-4">
           {isPlaying ? (
             <p className="text-4xl font-bold text-primary animate-pulse">{karaokeLyrics[currentLine]}</p>
           ) : (
            <p className="text-2xl text-muted-foreground">Pronto para cantar?</p>
           )}
        </div>
        <p className="text-center text-muted-foreground text-lg mb-4">Cante junto com a melodia e acompanhe a letra falada.</p>
        <Button onClick={handlePlay} size="lg">
          <Mic className="mr-2" /> {isPlaying ? 'Parar de Cantar' : 'Começar a Cantar'}
        </Button>
      </div>
    );
}


export default function MusicTimePage() {
  return (
    <div className="w-full">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold font-headline text-foreground">Cante com o Som</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Vamos fazer música! Siga o ritmo e cante com a gente.
        </p>
      </div>
      <div className="flex flex-col gap-10">
        <FeatureCard
          title="Repita o Som"
          description="Ouça a sequência de notas e repita na ordem correta para treinar sua memória."
          icon={Repeat}
        >
          <RepeatTheSoundGame />
        </FeatureCard>
        <FeatureCard
          title="Cante Junto"
          description="Um karaokê com guia de voz e vibração para você cantar suas músicas favoritas."
          icon={Mic}
        >
          <SingAlongGame />
        </FeatureCard>
      </div>
    </div>
  );
}
