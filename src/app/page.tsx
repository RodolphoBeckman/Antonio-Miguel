'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import {
  Ear,
  Hand,
  Sparkles,
  BookOpen,
  Music,
  HelpCircle,
  BrainCircuit,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Module = {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
  iconColor: string;
  cardColor: string;
};

const modules: Module[] = [
    { href: '/sound-discovery', label: 'Descobrindo Sons', icon: Ear, description: 'Explore, ouça e grave um universo de sons.', iconColor: 'text-green-400', cardColor: 'hover:bg-green-500/10' },
    { href: '/tactile-games', label: 'Toque e Movimento', icon: Hand, description: 'Use suas mãos para explorar, desenhar e sentir.', iconColor: 'text-orange-400', cardColor: 'hover:bg-orange-500/10' },
    { href: '/adapted-visuals', label: 'Brilho Mágico', icon: Sparkles, description: 'Atividades visuais com alto contraste para estimular a visão.', iconColor: 'text-yellow-400', cardColor: 'hover:bg-yellow-500/10' },
    { href: '/story-time', label: 'Histórias com Sentidos', icon: BookOpen, description: 'Ouça, sinta e imagine com histórias interativas.', iconColor: 'text-sky-400', cardColor: 'hover:bg-sky-500/10' },
    { href: '/music-time', label: 'Cante com o Som', icon: Music, description: 'Siga o ritmo, cante junto e crie suas melodias.', iconColor: 'text-purple-400', cardColor: 'hover:bg-purple-500/10' },
    { href: '/sound-guesses', label: 'Adivinha com Som', icon: HelpCircle, description: 'Teste sua audição adivinhando os diferentes sons.', iconColor: 'text-red-400', cardColor: 'hover:bg-red-500/10' },
    { href: '/personalization', label: 'Personalização IA', icon: BrainCircuit, description: 'Deixe a IA adaptar as atividades para a criança.', iconColor: 'text-pink-400', cardColor: 'hover:bg-pink-500/10' },
];

export default function DashboardPage() {
    const router = useRouter();

    const handleCardClick = (href: string) => {
        router.push(href);
    }

  return (
    <div className="w-full">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold font-headline text-foreground">Painel de Atividades</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Escolha uma atividade para começar a diversão!
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Card
            key={module.href}
            className={cn(
                "bg-card shadow-lg rounded-2xl flex flex-col overflow-hidden group cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl",
                module.cardColor
            )}
            onClick={() => handleCardClick(module.href)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(module.href)
                }
            }}
            tabIndex={0}
            role="button"
            aria-label={`Ir para ${module.label}`}
          >
            <CardContent className="flex flex-col items-center text-center p-8 flex-grow">
                <div className="p-4 bg-secondary rounded-full mb-4">
                    <module.icon className={cn("w-12 h-12", module.iconColor)} />
                </div>
                <CardTitle className="text-2xl font-bold font-headline text-card-foreground mb-2">{module.label}</CardTitle>
                <p className="text-muted-foreground">{module.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
