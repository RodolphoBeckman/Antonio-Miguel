'use client';
import { FeatureCard } from '@/components/feature-card';
import { Button } from '@/components/ui/button';
import { Palette, TrendingUp, X, Trash2 } from 'lucide-react';
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const [drawingSound, setDrawingSound] = useState<string | null>(null);
  const [isLoadingSound, setIsLoadingSound] = useState(false);
  const { toast } = useToast();
  const [selectedColor, setSelectedColor] = useState(neonColors[0]);

  useEffect(() => {
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

  useEffect(() => {
    if (isFullScreen && canvasRef.current) {
        const canvas = canvasRef.current;
        if (typeof window !== 'undefined') {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;

            const context = canvas.getContext("2d");
            if(context) {
              context.scale(dpr, dpr);
              context.lineCap = "round";
              context.lineJoin = "round";
              context.strokeStyle = selectedColor;
              context.lineWidth = 10;
              context.shadowColor = selectedColor;
              context.shadowBlur = 10;
              contextRef.current = context;
            }
        }
    }
  }, [isFullScreen]);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = selectedColor;
      contextRef.current.shadowColor = selectedColor;
    }
  }, [selectedColor]);

  const getCoords = (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>): { x: number, y: number } | null => {
      if ('touches' in e && e.touches.length > 0) {
          return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      if ('clientX' in e) {
          return { x: e.clientX, y: e.clientY };
      }
      return null;
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      const coords = getCoords(e);
      if (!coords || !contextRef.current) return;
      e.preventDefault();

      contextRef.current.beginPath();
      contextRef.current.moveTo(coords.x, coords.y);
      setIsDrawing(true);

      if (audioRef.current && drawingSound) {
        audioRef.current.loop = true;
        audioRef.current.play().catch(err => console.error("Audio play failed:", err));
      }
  };

  const stopDrawing = () => {
      if (!contextRef.current) return;
      contextRef.current.closePath();
      setIsDrawing(false);

      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.loop = false;
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;
      const coords = getCoords(e);
      if (!coords || !contextRef.current) return;
      e.preventDefault();
      
      contextRef.current.lineTo(coords.x, coords.y);
      contextRef.current.stroke();
  };

  const clearCanvas = () => {
    if (canvasRef.current && contextRef.current) {
        contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }

  const openFullScreen = () => {
    setIsFullScreen(true);
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
    clearCanvas();
    stopDrawing();
  };

  if (isFullScreen) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center animate-in fade-in-20">
        <audio ref={audioRef} src={drawingSound ?? undefined} />
        <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onMouseMove={draw}
            onTouchStart={startDrawing}
            onTouchEnd={stopDrawing}
            onTouchCancel={stopDrawing}
            onTouchMove={draw}
            className="absolute top-0 left-0 w-full h-full cursor-crosshair"
            aria-label="Área de pintura neon em tela cheia"
        />
        <Button onClick={closeFullScreen} variant="secondary" className="absolute top-4 right-4 z-10">
          <X className="mr-2" /> Fechar
        </Button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900/60 backdrop-blur-sm p-2 rounded-full flex items-center gap-3 shadow-lg z-10">
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
          <div className="w-px h-10 bg-white/30 mx-1"></div>
           <button
            onClick={(e) => {
                e.stopPropagation();
                clearCanvas();
            }}
            className="w-12 h-12 rounded-full border-4 border-transparent hover:border-destructive transition-colors flex items-center justify-center text-white hover:text-destructive"
            aria-label="Limpar desenho"
          >
            <Trash2 className="w-7 h-7" />
          </button>
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
