'use client';

import React, { useState, useRef } from 'react';
import { useSettings } from '@/context/settings-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Mic, Upload, Waves, Palette, Leaf, Cat, Car, Music as MusicIcon, Smile, StopCircle, Rocket } from 'lucide-react';
import type { Icon as LucideIcon } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button, buttonVariants } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Duplicated from sound-discovery/page.tsx to avoid creating new files.
const soundDiscoveryData: { name: string; icon: LucideIcon; sounds: { name: string; description: string; soundPrompt: string; }[] }[] = [
  {
    name: 'Natureza',
    icon: Leaf,
    sounds: [
      { name: 'Chuva', description: 'O som calmante da chuva caindo.', soundPrompt: 'O som de chuva suave e relaxante, com gotas de água caindo.' },
      { name: 'Vento', description: 'O som do vento soprando suavemente.', soundPrompt: 'O som do vento assobiando suavemente entre as árvores.' },
      { name: 'Pássaros', description: 'O canto alegre dos pássaros pela manhã.', soundPrompt: 'O som de vários pássaros cantando alegremente em uma floresta.' },
    ],
  },
  {
    name: 'Animais',
    icon: Cat,
    sounds: [
      { name: 'Cachorro', description: 'O latido amigável de um cachorro.', soundPrompt: 'O som de um cachorro grande latindo de forma amigável.' },
      { name: 'Gato', description: 'O miado suave de um gato.', soundPrompt: 'O som de um gato doméstico miando de forma suave.' },
      { name: 'Vaca', description: 'O mugido de uma vaca no pasto.', soundPrompt: 'O som de uma vaca mugindo em um pasto distante.' },
    ],
  },
  {
    name: 'Objetos',
    icon: Car,
    sounds: [
      { name: 'Telefone', description: 'O som de um telefone antigo tocando.', soundPrompt: 'O som de um telefone de disco antigo tocando repetidamente.' },
      { name: 'Carro', description: 'O som de um carro passando na rua.', soundPrompt: 'O som de um motor de carro acelerando e passando rapidamente.' },
      { name: 'Relógio', description: 'O tique-taque de um relógio de parede.', soundPrompt: 'O som contínuo e ritmado de um relógio de parede antigo.' },
    ],
  },
  {
    name: 'Instrumentos',
    icon: MusicIcon,
    sounds: [
      { name: 'Violão', description: 'O som das cordas de um violão.', soundPrompt: 'Um dedilhado suave e melódico com um violão acústico.' },
      { name: 'Piano', description: 'Uma melodia suave tocada no piano.', soundPrompt: 'Uma melodia calma, bonita e inspiradora tocada no piano.' },
      { name: 'Bateria', description: 'O ritmo contagiante de uma bateria.', soundPrompt: 'Uma batida de bateria animada, com pratos e tambores, bem contagiante.' },
    ],
  },
  {
    name: 'Emoções',
    icon: Smile,
    sounds: [
      { name: 'Risada', description: 'O som de uma criança rindo feliz.', soundPrompt: 'Uma criança dando uma gargalhada alta e contagiante.' },
      { name: 'Choro', description: 'O som de um bebê chorando.', soundPrompt: 'O som de um bebê chorando, procurando por atenção.' },
      { name: 'Surpresa', description: 'Um som de espanto e surpresa.', soundPrompt: 'Um som agudo e rápido de surpresa, como um grito de espanto.' },
    ],
  },
];


const soundModules = [
    {
        name: 'Jogos Táteis',
        icon: Waves,
        sounds: [
            {
                key: 'touch-game-sound',
                label: 'Som do Toque',
                description: 'O som emitido ao tocar nos círculos na atividade "Toque o Som".',
            }
        ]
    },
    {
        name: 'Brilho Mágico',
        icon: Palette,
        sounds: [
            {
                key: 'follow-light-sound',
                label: 'Som do "Seguir a Luz"',
                description: 'O som que acompanha a luz na atividade "Seguir a Luz".',
            },
            {
                key: 'drawing-sound',
                label: 'Som de "Pintura Neon"',
                description: 'O som emitido ao desenhar na atividade "Pintura Neon".',
            },
            {
                key: 'fireworks-sound',
                label: 'Som de "Fogos de Artifício"',
                description: 'O som de explosão ao tocar na tela na atividade de Fogos de Artifício.',
            }
        ]
    }
];

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

function AudioManagementControl({ soundKey, label, description }: { soundKey: string, label: string, description?: string }) {
    const { setSound } = useSettings();
    const { toast } = useToast();
    const uploadInputId = `upload-input-settings-${soundKey}`;

    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type.startsWith('audio/')) {
                try {
                    const audioUrl = await blobToBase64(file);
                    setSound(soundKey, audioUrl);
                    toast({ title: "Upload Concluído!", description: `O som para "${label}" foi carregado com sucesso.` });
                } catch(err) {
                    toast({ variant: "destructive", title: "Erro de Armazenamento", description: "Não foi possível salvar o arquivo. O armazenamento pode estar cheio." });
                }
            } else {
                toast({ variant: "destructive", title: "Arquivo Inválido", description: "Por favor, selecione um arquivo de áudio." });
            }
        }
        if(e.target) e.target.value = '';
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            const recorder = new MediaRecorder(stream);
            mediaRecorderRef.current = recorder;
            audioChunksRef.current = [];
    
            recorder.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };
    
            recorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const audioUrl = await blobToBase64(audioBlob);
                try {
                  setSound(soundKey, audioUrl);
                  toast({ title: "Gravação Salva!", description: "Seu áudio foi salvo com sucesso."});
                } catch (e) {
                  console.warn("Could not save custom audio.", e);
                  toast({
                    variant: "destructive",
                    title: "Erro de Armazenamento",
                    description: "Não foi possível salvar sua gravação. O armazenamento pode estar cheio.",
                  });
                }
                stream.getTracks().forEach(track => track.stop());
            };
            
            recorder.start();
            setIsRecording(true);
    
        } catch (err) {
            console.error("Error accessing microphone:", err);
            toast({
                variant: "destructive",
                title: "Acesso ao Microfone Negado",
                description: "Por favor, permita o acesso ao microfone nas configurações do seu navegador.",
            });
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };
    
    const handleRecordClick = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    return (
        <div className="p-4 rounded-lg bg-secondary/50">
            <h4 className="font-bold text-secondary-foreground">{label}</h4>
            {description && <p className="text-sm text-muted-foreground mb-3">{description}</p>}
            <div className="flex items-center gap-2 flex-wrap">
                <label htmlFor={uploadInputId} className={cn(buttonVariants({ variant: 'outline' }), "cursor-pointer")}>
                    <Upload className="mr-2 h-4 w-4" /> Fazer Upload
                </label>
                <input
                    id={uploadInputId}
                    type="file"
                    className="hidden"
                    accept="audio/*"
                    onChange={handleFileChange}
                />
                <Button variant="outline" onClick={handleRecordClick}>
                    {isRecording ? (
                        <>
                           <StopCircle className="mr-2 h-4 w-4 text-red-500 animate-pulse" />
                           Parar Gravação
                        </>
                    ) : (
                        <>
                           <Mic className="mr-2 h-4 w-4" /> Gravar Áudio
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}

export default function SettingsPage() {
  const { isCustomAudioEnabled, toggleCustomAudio, isInitialized } = useSettings();

  if (!isInitialized) {
    return (
        <div className="w-full max-w-2xl mx-auto space-y-8">
             <div className="text-center mb-8">
                <Skeleton className="h-10 w-3/4 mx-auto" />
                <Skeleton className="h-6 w-1/2 mx-auto mt-3" />
            </div>
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline text-foreground">Configurações</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Ajuste as funcionalidades do aplicativo de acordo com sua preferência.
        </p>
      </div>

      <div className="space-y-8">
        <Card className="bg-card shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle>Personalização de Áudio</CardTitle>
            <CardDescription>
              Habilite esta opção para usar sons personalizados que você gravou ou enviou.
            </CardDescription>
          </CardHeader>
          <CardContent>
              <div className="flex items-center space-x-4 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                <Switch
                  id="custom-audio-switch"
                  checked={isCustomAudioEnabled}
                  onCheckedChange={toggleCustomAudio}
                  aria-label="Ativar ou desativar personalização de áudio"
                />
                <Label htmlFor="custom-audio-switch" className="text-base cursor-pointer">
                  Habilitar áudios personalizados
                </Label>
              </div>
          </CardContent>
        </Card>

        {isCustomAudioEnabled && (
            <Card className="bg-card shadow-lg rounded-2xl">
                <CardHeader>
                    <CardTitle>Gerenciar Sons</CardTitle>
                    <CardDescription>
                    Grave um novo áudio ou faça o upload de um arquivo para substituir os sons padrão do aplicativo.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {soundModules.map((module) => (
                            <AccordionItem value={module.name} key={module.name}>
                                <AccordionTrigger className="text-xl hover:no-underline">
                                    <div className="flex items-center gap-3">
                                        <module.icon className="w-6 h-6 text-primary" />
                                        {module.name}
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-4">
                                    {module.sounds.map(sound => (
                                        <AudioManagementControl 
                                            key={sound.key}
                                            soundKey={sound.key}
                                            label={sound.label}
                                            description={sound.description}
                                        />
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                        {soundDiscoveryData.map((category) => (
                             <AccordionItem value={category.name} key={category.name}>
                                <AccordionTrigger className="text-xl hover:no-underline">
                                    <div className="flex items-center gap-3">
                                        <category.icon className="w-6 h-6 text-primary" />
                                        Descobrindo Sons: {category.name}
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-4">
                                    {category.sounds.map(sound => (
                                        <AudioManagementControl 
                                            key={sound.name}
                                            soundKey={`discovery-${sound.name.toLowerCase().replace(/\s/g, '-')}`}
                                            label={sound.name}
                                            description={sound.description}
                                        />
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        )}

        <Card className="bg-card shadow-lg rounded-2xl">
          <CardHeader>
              <CardTitle>Permissões do Navegador</CardTitle>
              <CardDescription>
                  Informações sobre como o aplicativo usa as permissões do seu dispositivo.
              </CardDescription>
          </CardHeader>
          <CardContent>
              <div className="p-4 rounded-lg bg-secondary/50 space-y-2">
                  <h4 className="font-bold text-secondary-foreground flex items-center"><Mic className="inline-block w-5 h-5 mr-2 text-primary"/> Acesso ao Microfone</h4>
                  <p className="text-sm text-muted-foreground">
                      Para usar a função de gravação de áudio, o aplicativo precisa da sua permissão para acessar o microfone. Na primeira vez que você tocar no ícone de gravação, seu navegador irá exibir uma janela para pedir sua autorização.
                  </p>
                  <p className="text-sm text-muted-foreground">
                      Se você negou a permissão acidentalmente, precisará ir até as <strong>configurações do seu navegador ou celular</strong> para permitir o acesso ao microfone para este site.
                  </p>
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
