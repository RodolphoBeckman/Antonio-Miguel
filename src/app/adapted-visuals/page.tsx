'use client';
import { FeatureCard } from '@/components/feature-card';
import { Button } from '@/components/ui/button';
import { Palette, TrendingUp, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { synthesizeSpeech } from '@/ai/flows/synthesize-speech';
import { useToast } from '@/hooks/use-toast';

function FollowTheLightGame() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="p-4 bg-secondary rounded-xl text-center">
      <div className={cn("relative w-full h-64 bg-black rounded-lg overflow-hidden my-4 flex items-center justify-center text-background", isPlaying ? '' : 'p-4')}>
        {isPlaying ? (
           <div className="absolute w-12 h-12 bg-yellow-300 rounded-full shadow-[0_0_20px_10px_rgba(253,244,152,0.7)] animate-light-follow" />
        ) : (
          <p className="text-xl">O jogo aparecerá aqui.</p>
        )}
      </div>
      <Button onClick={() => setIsPlaying(p => !p)} size="lg">
        {isPlaying ? 'Parar Jogo' : 'Iniciar Jogo'}
      </Button>
       <style jsx>{`
        @keyframes light-follow {
          0% { transform: translate(-150px, -80px); }
          25% { transform: translate(150px, 80px); }
          50% { transform: translate(80px, -100px); }
          75% { transform: translate(-120px, 50px); }
          100% { transform: translate(-150px, -80px); }
        }
        .animate-light-follow {
          animation: light-follow 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

function NeonPainting() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [pencilSound, setPencilSound] = useState<string | null>(null);
  const [isLoadingSound, setIsLoadingSound] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Only load sound when entering fullscreen mode
    if (!isFullScreen) return;

    const generateSound = async () => {
      setIsLoadingSound(true);
      try {
        const cachedSound = localStorage.getItem('pencilSound');
        if (cachedSound) {
          setPencilSound(cachedSound);
        } else {
          // A short, crisp sound is better for this interaction
          const result = await synthesizeSpeech("som de clique, como um pop");
          if (result.audioDataUri) {
            setPencilSound(result.audioDataUri);
            localStorage.setItem('pencilSound', result.audioDataUri);
          } else {
            throw new Error("Não foi possível gerar o áudio.");
          }
        }
      } catch (error) {
        console.error('Error generating pencil sound:', error);
        toast({
          variant: 'destructive',
          title: 'Erro ao carregar som',
          description: 'Não foi possível carregar o som de escrita. Tente novamente.',
        });
      } finally {
        setIsLoadingSound(false);
      }
    };

    generateSound();
  }, [isFullScreen, toast]);

  const handlePaint = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    
    e.preventDefault();

    const isTouchEvent = 'touches' in e;
    
    // For mousemove, only draw if the primary button is pressed. Mousedown and touchstart will always draw.
    if (!isTouchEvent && e.type === 'mousemove' && e.buttons !== 1) {
      return;
    }

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Get the points that changed in the event
    const points = isTouchEvent ? Array.from(e.changedTouches) : [e as React.MouseEvent];

    for (const point of points) {
        const x = point.clientX - rect.left;
        const y = point.clientY - rect.top;

        const dot = document.createElement('div');
        dot.className = 'paint-dot';
        dot.style.left = `${x}px`;
        dot.style.top = `${y}px`;
        dot.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 70%)`;
        
        canvas.appendChild(dot);
    }
    
    // Play sound on every paint action. Resetting time allows for rapid playback.
    if (audioRef.current && pencilSound) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => console.error("Audio play failed:", err));
    }
  };

  const openFullScreen = () => {
    setIsFullScreen(true);
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
    // Clear canvas on close to save memory
    if (canvasRef.current) {
        canvasRef.current.innerHTML = '';
    }
  };

  // Fullscreen drawing mode
  if (isFullScreen) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center animate-in fade-in-20">
        <audio ref={audioRef} src={pencilSound ?? undefined} />
        <div 
          ref={canvasRef}
          onMouseDown={handlePaint}
          onMouseMove={handlePaint}
          onTouchStart={handlePaint}
          onTouchMove={handlePaint}
          className="w-full h-full cursor-crosshair"
          aria-label="Área de pintura neon em tela cheia"
        />
        <Button onClick={closeFullScreen} variant="secondary" className="absolute top-4 right-4 z-10">
          <X className="mr-2" /> Fechar
        </Button>
      </div>
    );
  }

  // Placeholder card to launch the fullscreen mode
  return (
    <div className="p-4 bg-secondary rounded-xl text-center">
       <p className="text-center text-muted-foreground mb-4 text-lg">Use o dedo para pintar com cores brilhantes e vibrantes em um fundo escuro.</p>
       <div 
         className="relative w-full h-64 bg-black rounded-lg cursor-pointer overflow-hidden flex items-center justify-center group"
         onClick={openFullScreen}
         onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openFullScreen(); }}
         role="button"
         tabIndex={0}
         aria-label="Abrir Pintura Neon em tela cheia"
       >
         <div className="text-center text-white p-4">
            <Palette size={48} className="mx-auto mb-4 text-primary transition-transform group-hover:scale-110" />
            <p className="font-bold text-xl">Abrir Pintura Neon</p>
            <p className="text-muted-foreground">Toque aqui para começar a desenhar em tela cheia.</p>
         </div>
       </div>
       <style jsx>{`
        .paint-dot {
            position: absolute;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            box-shadow: 0 0 10px currentColor, 0 0 20px currentColor;
        }
       `}</style>
    </div>
  );
}

export default function AdaptedVisualsPage() {
  return (
    <div className="w-full">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold font-headline text-foreground">Brilho Mágico</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Atividades visuais com alto contraste para estimular a visão.
        </p>
      </div>
      <div className="flex flex-col gap-10">
        <FeatureCard
          title="Seguir a Luz"
          description="Siga a luz brilhante com seus olhos enquanto ela se move pela tela."
          icon={TrendingUp}
        >
          <FollowTheLightGame />
        </FeatureCard>
        <FeatureCard
          title="Pintura Neon"
          description="Use o dedo para pintar com cores brilhantes e vibrantes em um fundo escuro."
          icon={Palette}
        >
          <NeonPainting />
        </FeatureCard>
      </div>
    </div>
  );
}
