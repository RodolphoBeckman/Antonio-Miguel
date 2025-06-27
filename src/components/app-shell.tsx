'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Ear,
  Hand,
  Sparkles,
  BookOpen,
  Music,
  HelpCircle,
  BrainCircuit,
  Waves,
  Settings,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Descobrindo Sons', icon: Ear },
  { href: '/tactile-games', label: 'Toque e Movimento', icon: Hand },
  { href: '/adapted-visuals', label: 'Brilho Mágico', icon: Sparkles },
  { href: '/story-time', label: 'Histórias com Sentidos', icon: BookOpen },
  { href: '/music-time', label: 'Cante com o Som', icon: Music },
  { href: '/sound-guesses', label: 'Adivinha com Som', icon: HelpCircle },
  { href: '/personalization', label: 'Personalização IA', icon: BrainCircuit },
];

const settingsNavItem = { href: '/settings', label: 'Configurações', icon: Settings };

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-svh w-full bg-background">
      <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-3" aria-label="Página inicial do Antonio Miguel">
          <div className="bg-primary p-2.5 rounded-lg">
            <Waves className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-extrabold font-headline text-foreground">
            Antonio Miguel
          </h1>
        </Link>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-8 w-8" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-2">
            {navItems.map((item) => (
              <DropdownMenuItem key={item.href} asChild className={cn(pathname === item.href && 'bg-secondary focus:bg-secondary/80')}>
                <Link href={item.href}>
                  <item.icon className="mr-2 h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuItem asChild className={cn(pathname === settingsNavItem.href && 'bg-secondary focus:bg-secondary/80')}>
              <Link href={settingsNavItem.href}>
                <settingsNavItem.icon className="mr-2 h-5 w-5" />
                <span>{settingsNavItem.label}</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </header>
      <main className="p-4 sm:p-6 md:p-8">{children}</main>
    </div>
  );
}
