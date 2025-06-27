'use client';
import { FeatureCard } from '@/components/feature-card';
import { Button } from '@/components/ui/button';
import { Palette, TrendingUp, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { synthesizeSpeech } from '@/ai/flows/synthesize-speech';
import { useToast } from '@/hooks/use-toast';

function FollowTheLightGame() {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameSound, setGameSound] = useState<string | null>(null);
  const [isLoadingSound, setIsLoadingSound] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const soundIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!isFullScreen) {
      if (soundIntervalRef.current) {
        clearInterval(soundIntervalRef.current);
        soundIntervalRef.current = null;
      }
      setIsPlaying(false);
      return;
    }

    const generateSound = async () => {
      setIsLoadingSound(true);
      try {
        const cachedSound = localStorage.getItem('followLightSoundCache');
        if (cachedSound) {
          setGameSound(cachedSound);
        } else {
          const result = await synthesizeSpeech("Uma única nota de xilofone, tocada de forma suave e com eco, criando um som mágico.");
          if (result.audioDataUri) {
            setGameSound(result.audioDataUri);
            try {
              localStorage.setItem('followLightSoundCache', result.audioDataUri);
            } catch (error) {
              console.warn('Failed to cache game sound:', error);
            }
          } else {
            throw new Error("Não foi possível gerar o áudio do jogo.");
          }
        }
      } catch (error) {
        console.error('Error generating game sound:', error);
        toast({
          variant: 'destructive',
          title: 'Erro ao carregar som',
          description: 'Não foi possível carregar o som do jogo. Tente novamente.',
        });
      } finally {
        setIsLoadingSound(false);
      }
    };

    generateSound();

    return () => {
      if (soundIntervalRef.current) {
        clearInterval(soundIntervalRef.current);
      }
    };
  }, [isFullScreen, toast]);

  useEffect(() => {
    if (isPlaying && gameSound) {
      soundIntervalRef.current = setInterval(() => {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(err => console.error("Audio play failed:", err));
        }
      }, 2000);
    } else {
      if (soundIntervalRef.current) {
        clearInterval(soundIntervalRef.current);
        soundIntervalRef.current = null;
      }
    }
    return () => {
      if (soundIntervalRef.current) {
        clearInterval(soundIntervalRef.current);
      }
    }
  }, [isPlaying, gameSound]);


  const openFullScreen = () => setIsFullScreen(true);
  const closeFullScreen = () => setIsFullScreen(false);
  const togglePlay = () => setIsPlaying(p => !p);

  if (isFullScreen) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center animate-in fade-in-20">
        <audio ref={audioRef} src={gameSound ?? undefined} />
        
        {isPlaying && (
          <div className="absolute w-16 h-16 bg-yellow-300 rounded-full shadow-[0_0_30px_15px_rgba(253,244,152,0.7)] animate-light-follow" />
        )}

        <div className="absolute top-4 right-4 z-10">
            <Button onClick={closeFullScreen} variant="secondary">
                <X className="mr-2" /> Fechar
            </Button>
        </div>

        <div className="absolute bottom-10 z-10">
            <Button onClick={togglePlay} size="lg" disabled={isLoadingSound}>
                {isLoadingSound ? 'Carregando som...' : (isPlaying ? 'Parar Jogo' : 'Iniciar Jogo')}
            </Button>
        </div>

        <style jsx>{`
          @keyframes light-follow {
            0% { transform: translate(-40vw, -30vh) scale(1); }
            25% { transform: translate(40vw, 30vh) scale(1.2); }
            50% { transform: translate(10vw, -35vh) scale(0.8); }
            75% { transform: translate(-35vw, 20vh) scale(1.1); }
            100% { transform: translate(-40vw, -30vh) scale(1); }
          }
          .animate-light-follow {
            animation: light-follow 8s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="p-4 bg-secondary rounded-xl text-center">
       <div 
         className="relative w-full h-64 bg-black rounded-lg cursor-pointer overflow-hidden flex items-center justify-center group"
         onClick={openFullScreen}
         onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openFullScreen(); }}
         role="button"
         tabIndex={0}
         aria-label="Abrir Seguir a Luz em tela cheia"
       >
         <div className="text-center text-white p-4">
            <TrendingUp size={48} className="mx-auto mb-4 text-primary transition-transform group-hover:scale-110" />
            <p className="font-bold text-xl">Abrir Jogo</p>
            <p className="text-muted-foreground">Toque para começar em tela cheia.</p>
         </div>
       </div>
    </div>
  );
}

const neonColors = [
  'hsl(330, 100%, 70%)',
  'hsl(60, 100%, 70%)',
  'hsl(210, 100%, 70%)',
  'hsl(120, 100%, 70%)',
  'hsl(30, 100%, 70%)',
  'hsl(0, 0%, 100%)',
];

function NeonPainting() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [drawingSound, setDrawingSound] = useState<string | null>(null);
  const [isLoadingSound, setIsLoadingSound] = useState(false);
  const { toast } = useToast();
  const [selectedColor, setSelectedColor] = useState(neonColors[0]);

  useEffect(() => {
    // Only load sound when entering fullscreen mode
    if (!isFullScreen) return;

    const generateSound = async () => {
      setIsLoadingSound(true);
      try {
        const cachedSound = localStorage.getItem('drawingSoundCache');
        if (cachedSound) {
          setDrawingSound(cachedSound);
        } else {
          const result = await synthesizeSpeech("O som de um giz de cera riscando suavemente sobre uma folha de papel.");
          if (result.audioDataUri) {
            setDrawingSound(result.audioDataUri);
            try {
              localStorage.setItem('drawingSoundCache', result.audioDataUri);
            } catch (error) {
              console.warn('Failed to cache drawing sound:', error);
            }
          } else {
            throw new Error("Não foi possível gerar o áudio.");
          }
        }
      } catch (error) {
        console.error('Error generating drawing sound:', error);
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
    
    const isTouchEvent = 'touches' in e;

    if (isTouchEvent) {
        e.preventDefault();
    }
    
    // For mousemove, only draw if the primary button is pressed. Mousedown and touchstart will always draw.
    if (e.type === 'mousemove' && e.buttons !== 1) {
      return;
    }

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    const points = isTouchEvent ? Array.from((e as React.TouchEvent).touches) : [e as React.MouseEvent];

    for (const point of points) {
        const x = point.clientX - rect.left;
        const y = point.clientY - rect.top;

        const dot = document.createElement('div');
        dot.className = 'paint-dot';
        dot.style.left = `${x}px`;
        dot.style.top = `${y}px`;
        dot.style.backgroundColor = selectedColor;
        dot.style.boxShadow = `0 0 10px ${selectedColor}, 0 0 20px ${selectedColor}`;
        
        canvas.appendChild(dot);
    }
    
    if (audioRef.current && drawingSound) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => console.error("Audio play failed:", err));
    }
  };

  const openFullScreen = () => {
    setIsFullScreen(true);
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
    if (canvasRef.current) {
        canvasRef.current.innerHTML = '';
    }
  };

  if (isFullScreen) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center animate-in fade-in-20">
        <audio ref={audioRef} src={drawingSound ?? undefined} />
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
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900/60 backdrop-blur-sm p-2 rounded-full flex gap-3 shadow-lg">
          {neonColors.map((color) => (
            <button
              key={color}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedColor(color);
              }}
              className={cn(
                "w-12 h-12 rounded-full border-4 transition-transform duration-200",
                selectedColor === color ? "border-white scale-110" : "border-transparent hover:scale-105"
              )}
              style={{ 
                backgroundColor: color,
                boxShadow: `0 0 10px ${color}`
              }}
              aria-label={`Selecionar cor ${color}`}
            />
          ))}
        </div>
      </div>
    );
  }

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
