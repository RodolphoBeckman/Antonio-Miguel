'use client';

import { useSettings } from '@/context/settings-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsPage() {
  const { isCustomAudioEnabled, toggleCustomAudio, isInitialized } = useSettings();

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline text-foreground">Configurações</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Ajuste as funcionalidades do aplicativo de acordo com sua preferência.
        </p>
      </div>

      <Card className="bg-card shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle>Personalização de Áudio</CardTitle>
          <CardDescription>
            Controle a visibilidade das opções para gravar ou fazer upload de áudios personalizados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          { !isInitialized ? (
            <div className="flex items-center space-x-4 p-2">
                <Skeleton className="h-6 w-12 rounded-full" />
                <Skeleton className="h-6 w-64" />
            </div>
          ) : (
            <div className="flex items-center space-x-4 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
              <Switch
                id="custom-audio-switch"
                checked={isCustomAudioEnabled}
                onCheckedChange={toggleCustomAudio}
                aria-label="Ativar ou desativar personalização de áudio"
              />
              <Label htmlFor="custom-audio-switch" className="text-base cursor-pointer">
                Habilitar gravação e upload de sons
              </Label>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
