'use client';
import { FeatureCard } from '@/components/feature-card';
import { Button } from '@/components/ui/button';
import { Palette, TrendingUp } from 'lucide-react';
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

function FollowTheLightGame() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="p-4 bg-secondary rounded-xl text-center">
      <div className={cn("relative w-full h-64 bg-black rounded-lg overflow-hidden my-4 flex items-center justify-center text-background", isPlaying ? '' : 'p-4')}>
        {isPlaying ? (
           <div className="absolute w-12 h-12 bg-yellow-300 rounded-full shadow-[0_0_20px_10px_rgba(253,244,152,0.7)] animate-light-follow" />
        ) : (
          <p>O jogo aparecerá aqui.</p>
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

  const handlePaint = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    
    const isTouchEvent = 'touches' in e;
    
    if (isTouchEvent && e.touches.length === 0) return;
    if (!isTouchEvent && e.buttons !== 1) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    const x = isTouchEvent ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = isTouchEvent ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    const dot = document.createElement('div');
    dot.className = 'paint-dot';
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    dot.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 70%)`;
    
    canvas.appendChild(dot);
  };
  
  return (
    <div className="p-4 bg-secondary rounded-xl text-center">
       <p className="text-center text-muted-foreground mb-4">Pinte com cores neon sobre o fundo preto.</p>
       <div 
         ref={canvasRef}
         onMouseMove={handlePaint}
         onTouchMove={handlePaint}
         className="relative w-full h-64 bg-black rounded-lg cursor-crosshair overflow-hidden"
         aria-label="Área de pintura neon"
       >
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
  )
}

export default function AdaptedVisualsPage() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-headline text-foreground">Brilho Mágico</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Atividades visuais com alto contraste para estimular a visão.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
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
