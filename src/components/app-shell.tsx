'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Home,
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
  { href: '/', label: 'Painel Principal', icon: Home },
  { href: '/sound-discovery', label: 'Descobrindo Sons', icon: Ear },
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-svh w-full bg-background portrait:hidden md:block">
      <header className="flex h-20 items-center justify-between border-b border-border bg-background px-4">
        <Link href="/" className="flex items-center gap-3" aria-label="Página inicial do Antonio Miguel">
          <div className="bg-primary p-2.5 rounded-lg">
            <Waves className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-extrabold font-headline text-foreground">
            Antonio Miguel
          </h1>
        </Link>
        
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
                <Link href="/" aria-label="Painel Principal">
                    <Home className="h-8 w-8" />
                </Link>
            </Button>
            {!mounted ? (
              <Button variant="ghost" size="icon" disabled>
                <Menu className="h-8 w-8" />
              </Button>
            ) : (
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
            )}
        </div>

      </header>
      <main className="p-4 sm:p-6 md:p-8">{children}</main>
    </div>
  );
}
