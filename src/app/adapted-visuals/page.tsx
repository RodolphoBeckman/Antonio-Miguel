'use client';
import { FeatureCard } from '@/components/feature-card';
import { Button } from '@/components/ui/button';
import { Palette, TrendingUp, X, Trash2, Rocket } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useSettings } from '@/context/settings-context';
import { useToast } from '@/hooks/use-toast';

function FollowTheLightGame() {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameSound, setGameSound] = useState<string | null>(null);
  const [isLoadingSound, setIsLoadingSound] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const soundIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const { loadSound } = useSettings();

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
        const soundUri = await loadSound(
            'follow-light-sound',
            "Uma única nota de xilofone, tocada de forma suave e com eco, criando um som mágico."
        );
        setGameSound(soundUri);
      } catch (error) {
        console.error('Error loading game sound:', error);
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
  }, [isFullScreen, loadSound, toast]);

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
  const { loadSound } = useSettings();
  const [selectedColor, setSelectedColor] = useState(neonColors[0]);

  useEffect(() => {
    if (!isFullScreen) return;

    const generateSound = async () => {
      setIsLoadingSound(true);
      try {
        const soundUri = await loadSound(
            'drawing-sound',
            "O som de um giz de cera riscando suavemente sobre uma folha de papel."
        );
        setDrawingSound(soundUri);
      } catch (error) {
        console.error('Error loading drawing sound:', error);
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
  }, [isFullScreen, loadSound, toast]);

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
  }, [isFullScreen, selectedColor]);

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
        const context = contextRef.current;
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
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


// Helper for random numbers
const random = (min: number, max: number) => Math.random() * (max - min) + min;

// Particle class for fireworks effect
class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  gravity: number = 0.2;
  friction: number = 0.98;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    const angle = random(0, Math.PI * 2);
    const speed = random(1, 10);
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = 1;
    this.color = color;
  }

  update() {
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 0.02;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

function FireworksGame() {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fireworksSound, setFireworksSound] = useState<string | null>(null);
  const { toast } = useToast();
  const { loadSound } = useSettings();
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    if (!isFullScreen) return;

    const generateSound = async () => {
      try {
        const soundUri = await loadSound(
            'fireworks-sound',
            "O som de fogos de artifício explodindo no céu, com um assobio e uma explosão."
        );
        setFireworksSound(soundUri);
      } catch (error) {
        console.error('Error loading fireworks sound:', error);
        toast({
          variant: 'destructive',
          title: 'Erro ao carregar som',
          description: 'Não foi possível carregar o som dos fogos. Tente novamente.',
        });
      }
    };
    generateSound();
  }, [isFullScreen, loadSound, toast]);

  useEffect(() => {
    if (!isFullScreen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (typeof window !== 'undefined') {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        ctx.scale(dpr, dpr);
    }

    let animationFrameId: number;
    const animate = () => {
        if (ctx) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            
            particlesRef.current.forEach((p, index) => {
                p.update();
                p.draw(ctx);
                if (p.alpha <= 0) {
                    particlesRef.current.splice(index, 1);
                }
            });
        }
        animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
        cancelAnimationFrame(animationFrameId);
        particlesRef.current = [];
    };
  }, [isFullScreen]);

  const createFireworks = (x: number, y: number) => {
    const particleCount = 100;
    const hue = random(0, 360);

    for (let i = 0; i < particleCount; i++) {
        const color = `hsl(${hue}, 100%, 70%)`;
        particlesRef.current.push(new Particle(x, y, color));
    }

    if (fireworksSound) {
        const audio = new Audio(fireworksSound);
        audio.play().catch(err => console.error("Audio play failed:", err));
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    createFireworks(e.clientX, e.clientY);
  };
  
  const handleTouch = (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches.length > 0) {
        e.preventDefault();
        createFireworks(e.touches[0].clientX, e.touches[0].clientY);
      }
  };

  const openFullScreen = () => setIsFullScreen(true);
  const closeFullScreen = () => {
      setIsFullScreen(false);
      particlesRef.current = [];
  };

  if (isFullScreen) {
    return (
      <div 
        className="fixed inset-0 bg-black z-50 cursor-pointer"
        onClick={handleClick}
        onTouchStart={handleTouch}
      >
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" aria-label="Área de fogos de artifício em tela cheia" />
        <Button 
            onClick={(e) => { e.stopPropagation(); closeFullScreen(); }} 
            variant="secondary" 
            className="absolute top-4 right-4 z-10"
        >
          <X className="mr-2" /> Fechar
        </Button>
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
         aria-label="Abrir Fogos de Artifício em tela cheia"
       >
         <div className="text-center text-white p-4">
            <Rocket size={48} className="mx-auto mb-4 text-primary transition-transform group-hover:scale-110" />
            <p className="font-bold text-xl">Abrir Fogos de Artifício</p>
            <p className="text-muted-foreground">Toque para começar a festa de luzes.</p>
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
         <FeatureCard
          title="Fogos de Artifício"
          description="Toque na tela para criar explosões de luz e cor com sons divertidos."
          icon={Rocket}
        >
          <FireworksGame />
        </FeatureCard>
      </div>
    </div>
  );
}
