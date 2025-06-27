'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
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

  const NavLink = ({ href, label, icon: Icon, isSettings = false }: { href: string; label: string; icon: any, isSettings?: boolean }) => (
    <SheetClose asChild>
      <Link href={href}>
        <Button
          variant={pathname === href ? 'secondary' : 'ghost'}
          className="w-full justify-start text-lg h-14"
        >
          <Icon className="mr-4 h-6 w-6" />
          <span>{label}</span>
        </Button>
      </Link>
    </SheetClose>
  );

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
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-8 w-8" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-sm p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-8">
                <div className="bg-primary p-2.5 rounded-lg">
                    <Waves className="h-6 w-6 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-extrabold font-headline text-foreground">
                    Antonio Miguel
                </h2>
            </div>
            <nav className="flex-1 flex flex-col gap-2">
                {navItems.map((item) => (
                    <NavLink key={item.href} {...item} />
                ))}
            </nav>
            <div className="mt-auto">
              <NavLink {...settingsNavItem} isSettings />
            </div>
          </SheetContent>
        </Sheet>
      </header>
      <main className="p-4 sm:p-6 md:p-8">{children}</main>
    </div>
  );
}
