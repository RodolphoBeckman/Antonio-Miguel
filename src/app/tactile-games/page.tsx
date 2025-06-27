'use client';

import { FeatureCard } from '@/components/feature-card';
import { Button } from '@/components/ui/button';
import { Move, Waves } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { synthesizeSpeech } from '@/ai/flows/synthesize-speech';
import { useToast } from '@/hooks/use-toast';

const drawingInstructions = [
  'Desenhe um círculo grande na sua frente',
  'Agora, desenhe um quadrado bem devagar',
  'Faça uma linha reta para cima e para baixo',
  'Tente desenhar uma estrela no ar',
  'Desenhe uma onda, como as do mar',
];

function AirDrawingGame() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % drawingInstructions.length);
  };

  return (
    <div className="space-y-4 text-center p-6 bg-secondary rounded-2xl">
      <p className="text-xl font-semibold text-secondary-foreground">
        Instrução atual:
      </p>
      <div className="text-3xl font-bold text-primary min-h-[8rem] flex items-center justify-center p-2">
        &quot;{drawingInstructions[currentIndex]}&quot;
      </div>
      <Button onClick={handleNext} size="lg">
        Próxima Instrução
      </Button>
    </div>
  );
}

function TouchTheSoundGame() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [touchSound, setTouchSound] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const generateSound = async () => {
      try {
        const cachedSound = localStorage.getItem('touchGameSound');
        if (cachedSound) {
          setTouchSound(cachedSound);
        } else {
          const result = await synthesizeSpeech("Som de um clique digital curto e agradável.");
          if (result.audioDataUri) {
            setTouchSound(result.audioDataUri);
            try {
              localStorage.setItem('touchGameSound', result.audioDataUri);
            } catch (error) {
              console.warn('Failed to cache touch sound:', error);
            }
          } else {
            throw new Error("Não foi possível gerar o áudio do toque.");
          }
        }
      } catch (error) {
        console.error('Error generating touch sound:', error);
        toast({
          variant: 'destructive',
          title: 'Erro ao gerar som',
          description: 'Não foi possível carregar o som do jogo. Tente recarregar a página.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    generateSound();
  }, [toast]);

  const handleTouch = (index: number) => {
    if (typeof window !== 'undefined' && window.navigator?.vibrate) {
      window.navigator.vibrate(100);
    }
    
    if (audioRef.current && touchSound) {
      audioRef.current.src = touchSound;
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setPlayingIndex(index);
    }
  };

  return (
    <div className="p-4 bg-secondary rounded-2xl">
      <audio ref={audioRef} onEnded={() => setPlayingIndex(null)} />
      <p className="text-center text-muted-foreground mb-4 min-h-[24px] text-lg">
        {isLoading ? "Carregando som..." : "Toque nos círculos para sentir a vibração e ouvir o som."}
      </p>
      <div className="grid grid-cols-3 gap-4 h-64">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="flex items-center justify-center">
            <button
              onClick={() => handleTouch(i)}
              disabled={isLoading || !touchSound}
              className="w-20 h-20 bg-primary rounded-full text-primary-foreground flex items-center justify-center shadow-lg transform active:scale-95 transition-transform focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-wait"
              aria-label={`Ponto de toque ${i + 1}`}
            >
              {playingIndex === i ? (
                <div className="w-full h-full rounded-full bg-white/30 animate-ping-once" />
              ) : (
                <Waves className="w-10 h-10" />
              )}
            </button>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes ping-once {
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        .animate-ping-once {
          animation: ping-once 0.7s cubic-bezier(0, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}

export default function TactileGamesPage() {
  return (
    <div className="w-full">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold font-headline text-foreground">
          Toque e Movimento
        </h1>
        <p className="text-xl text-muted-foreground mt-2">
          Use suas mãos para explorar, desenhar e sentir o mundo.
        </p>
      </div>
      <div className="flex flex-col gap-10">
        <FeatureCard
          title="Desenho no Ar"
          description="Siga as instruções para desenhar formas no ar com seus dedos e braços."
          icon={Move}
        >
          <AirDrawingGame />
        </FeatureCard>
        <FeatureCard
          title="Toque o Som"
          description="Toque nos pontos da tela para sentir a vibração e descobrir onde o som está."
          icon={Waves}
        >
          <TouchTheSoundGame />
        </FeatureCard>
      </div>
    </div>
  );
}
