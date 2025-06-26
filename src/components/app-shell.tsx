'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  Ear,
  Hand,
  Sparkles,
  BookOpen,
  Music,
  HelpCircle,
  BrainCircuit,
  Waves,
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

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent className="p-4 bg-background">
          <SidebarHeader className="p-0 mb-4">
            <Link href="/" className="flex items-center gap-2" aria-label="Página inicial do Antonio Miguel">
              <div className="bg-primary p-2 rounded-lg">
                <Waves className="text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold font-headline text-foreground">
                Antonio Miguel
              </h1>
            </Link>
          </SidebarHeader>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  className="justify-start"
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:hidden">
          <SidebarTrigger />
          <h1 className="text-lg font-bold font-headline text-foreground">
            Antonio Miguel
          </h1>
        </header>
        <main className="flex-1 p-4 sm:p-6 md:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
