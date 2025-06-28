'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Leaf,
  Cat,
  Car,
  Music,
  Smile,
  Volume2,
  X,
  Loader2,
  Square,
  Mic,
  StopCircle,
  Upload,
} from 'lucide-react';
import type { Icon as LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { useSettings } from '@/context/settings-context';
import { Skeleton } from '@/components/ui/skeleton';

type Sound = {
  name: string;
  description: string;
  soundPrompt: string;
};

type Category = {
  name: string;
  icon: LucideIcon;
  sounds: Sound[];
  cardColor: string;
  color: string;
  textColor: string;
  iconColor: string;
};

const soundData: Category[] = [
  {
    name: 'Natureza',
    icon: Leaf,
    cardColor: 'bg-green-500/10',
    color: 'bg-green-500/20',
    textColor: 'text-green-300',
    iconColor: 'text-green-400',
    sounds: [
      { name: 'Chuva', description: 'O som calmante da chuva caindo.', soundPrompt: 'O som de chuva suave e relaxante, com gotas de água caindo.' },
      { name: 'Vento', description: 'O som do vento soprando suavemente.', soundPrompt: 'O som do vento assobiando suavemente entre as árvores.' },
      { name: 'Pássaros', description: 'O canto alegre dos pássaros pela manhã.', soundPrompt: 'O som de vários pássaros cantando alegremente em uma floresta.' },
    ],
  },
  {
    name: 'Animais',
    icon: Cat,
    cardColor: 'bg-orange-500/10',
    color: 'bg-orange-500/20',
    textColor: 'text-orange-300',
    iconColor: 'text-orange-400',
    sounds: [
      { name: 'Cachorro', description: 'O latido amigável de um cachorro.', soundPrompt: 'O som de um cachorro grande latindo de forma amigável.' },
      { name: 'Gato', description: 'O miado suave de um gato.', soundPrompt: 'O som de um gato doméstico miando de forma suave.' },
      { name: 'Vaca', description: 'O mugido de uma vaca no pasto.', soundPrompt: 'O som de uma vaca mugindo em um pasto distante.' },
    ],
  },
  {
    name: 'Objetos',
    icon: Car,
    cardColor: 'bg-sky-500/10',
    color: 'bg-sky-500/20',
    textColor: 'text-sky-300',
    iconColor: 'text-sky-400',
    sounds: [
      { name: 'Telefone', description: 'O som de um telefone antigo tocando.', soundPrompt: 'O som de um telefone de disco antigo tocando repetidamente.' },
      { name: 'Carro', description: 'O som de um carro passando na rua.', soundPrompt: 'O som de um motor de carro acelerando e passando rapidamente.' },
      { name: 'Relógio', description: 'O tique-taque de um relógio de parede.', soundPrompt: 'O som contínuo e ritmado de um relógio de parede antigo.' },
    ],
  },
  {
    name: 'Instrumentos',
    icon: Music,
    cardColor: 'bg-purple-500/10',
    color: 'bg-purple-500/20',
    textColor: 'text-purple-300',
    iconColor: 'text-purple-400',
    sounds: [
      { name: 'Violão', description: 'O som das cordas de um violão.', soundPrompt: 'Um dedilhado suave e melódico com um violão acústico.' },
      { name: 'Piano', description: 'Uma melodia suave tocada no piano.', soundPrompt: 'Uma melodia calma, bonita e inspiradora tocada no piano.' },
      { name: 'Bateria', description: 'O ritmo contagiante de uma bateria.', soundPrompt: 'Uma batida de bateria animada, com pratos e tambores, bem contagiante.' },
    ],
  },
  {
    name: 'Emoções',
    icon: Smile,
    cardColor: 'bg-yellow-500/10',
    color: 'bg-yellow-500/20',
    textColor: 'text-yellow-300',
    iconColor: 'text-yellow-400',
    sounds: [
      { name: 'Risada', description: 'O som de uma criança rindo feliz.', soundPrompt: 'Uma criança dando uma gargalhada alta e contagiante.' },
      { name: 'Choro', description: 'O som de um bebê chorando.', soundPrompt: 'O som de um bebê chorando, procurando por atenção.' },
      { name: 'Surpresa', description: 'Um som de espanto e surpresa.', soundPrompt: 'Um som agudo e rápido de surpresa, como um grito de espanto.' },
    ],
  },
];

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
};

export default function SoundDiscoveryPage() {
  const { isCustomAudioEnabled, isInitialized, loadSound, setSound } = useSettings();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [loadingSound, setLoadingSound] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const [recordingStatus, setRecordingStatus] = useState<{ soundName: string | null, isRecording: boolean }>({ soundName: null, isRecording: false });
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayingSound(null);
  };

  const handleClearSelection = () => {
    setSelectedCategory(null);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayingSound(null);
  };

  const playSound = async (soundName: string, soundPrompt: string) => {
    if (audioRef.current && playingSound === soundName) {
      audioRef.current.pause();
      setPlayingSound(null);
      return;
    }

    setPlayingSound(null);
    setLoadingSound(soundName);

    try {
      const soundKey = `discovery-${soundName.toLowerCase().replace(/\s/g, '-')}`;
      const audioDataUri = await loadSound(soundKey, soundPrompt);
      if (audioRef.current && audioDataUri) {
        audioRef.current.src = audioDataUri;
        audioRef.current.play().catch((e) => console.error('Error playing audio:', e));
        setPlayingSound(soundName);
      }
    } catch (error) {
      console.error('Error loading or playing sound:', error);
      toast({
        variant: "destructive",
        title: "Erro ao Tocar Som",
        description: "Não foi possível gerar ou reproduzir o áudio. Tente novamente.",
      })
    } finally {
      setLoadingSound(null);
    }
  };

  const startRecording = async (soundName: string) => {
    if (recordingStatus.isRecording) {
      stopRecording();
      return;
    }
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
            const soundKey = `discovery-${soundName.toLowerCase().replace(/\s/g, '-')}`;
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
        setRecordingStatus({ soundName: soundName, isRecording: true });

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
        setRecordingStatus({ soundName: null, isRecording: false });
    }
  };

  const handleRecordClick = (e: React.MouseEvent, soundName: string) => {
    e.stopPropagation();
    if (recordingStatus.isRecording && recordingStatus.soundName === soundName) {
      stopRecording();
    } else {
      startRecording(soundName);
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, soundName: string) => {
    const file = e.target.files?.[0];
    if (file && soundName) {
      if (file.type.startsWith('audio/')) {
        try {
          const audioUrl = await blobToBase64(file);
          const soundKey = `discovery-${soundName.toLowerCase().replace(/\s/g, '-')}`;
          setSound(soundKey, audioUrl);
          toast({
            title: "Upload Concluído!",
            description: "Seu áudio foi carregado com sucesso.",
          });
        } catch (e) {
          console.warn("Could not save custom audio.", e);
          toast({
            variant: "destructive",
            title: "Erro de Armazenamento",
            description: "Não foi possível salvar o arquivo de áudio. O armazenamento pode estar cheio.",
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Arquivo Inválido",
          description: "Por favor, selecione um arquivo de áudio.",
        });
      }
    }
    if (e.target) e.target.value = '';
  };
  
  if (!isInitialized) {
    return (
        <div className="w-full">
            <div className="mb-8 text-center">
                <Skeleton className="h-10 w-3/4 mx-auto" />
                <Skeleton className="h-7 w-1/2 mx-auto mt-3" />
            </div>
            <div className="flex flex-col gap-4">
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-2xl" />
                ))}
            </div>
        </div>
    );
  }

  const mainDescription = isCustomAudioEnabled
    ? 'Explore um mundo de sons! Toque para ouvir, grave sua voz ou envie um áudio personalizado.'
    : 'Explore um mundo de sons! Toque em uma categoria para começar.';

  return (
    <div className="w-full">
      <audio ref={audioRef} onEnded={() => setPlayingSound(null)} />
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold font-headline text-foreground">Descobrindo Sons</h1>
        <p className="text-xl text-muted-foreground mt-2">
          {mainDescription}
        </p>
      </div>

      {selectedCategory ? (
        <div className="animate-in fade-in-50">
            <CardHeader className="flex flex-row items-center justify-between p-0 mb-6">
                <div className="flex items-center gap-4">
                <div className={cn("p-3 rounded-xl", selectedCategory.color)}>
                    <selectedCategory.icon className={cn("w-8 h-8", selectedCategory.iconColor)} />
                </div>
                <CardTitle className={cn("text-3xl font-bold", selectedCategory.textColor)}>{selectedCategory.name}</CardTitle>
                </div>
                <Button variant="ghost" size="icon" onClick={handleClearSelection} aria-label="Fechar categoria" className="text-muted-foreground hover:bg-white/10 rounded-full">
                <X className="w-8 h-8" />
                </Button>
            </CardHeader>
            <div className="space-y-4">
              {selectedCategory.sounds.map((sound) => {
                const isDisabled = loadingSound !== null || (recordingStatus.isRecording && recordingStatus.soundName !== sound.name);
                const isUploadDisabled = loadingSound !== null || recordingStatus.isRecording;
                const uploadInputId = `upload-input-${sound.name.replace(/\s/g, '-')}`;

                return (
                  <div
                    key={sound.name}
                    role="button"
                    tabIndex={isDisabled ? -1 : 0}
                    aria-disabled={isDisabled}
                    aria-label={`Tocar som de ${sound.name}`}
                    onClick={() => {
                      if (isDisabled) return;
                      playSound(sound.name, sound.soundPrompt);
                    }}
                    onKeyDown={(e) => {
                      if ((e.key === 'Enter' || e.key === ' ') && !isDisabled) {
                        e.preventDefault();
                        playSound(sound.name, sound.soundPrompt);
                      }
                    }}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-2xl text-left transition-all duration-200 ease-in-out transform",
                      selectedCategory.color,
                      "focus:outline-none",
                      isDisabled
                        ? "opacity-50 cursor-wait"
                        : "cursor-pointer hover:scale-[1.02] hover:shadow-lg active:scale-95 focus:ring-2 focus:ring-offset-2 focus:ring-ring"
                    )}
                  >
                    <div>
                      <h3 className={cn("text-2xl font-bold", selectedCategory.textColor)}>{sound.name}</h3>
                      <p className={cn(selectedCategory.textColor, "opacity-70 text-lg")}>{sound.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {isCustomAudioEnabled && (
                        <>
                          <button
                            onClick={(e) => handleRecordClick(e, sound.name)}
                            className={cn(
                              "p-3 rounded-full transition-colors disabled:opacity-50",
                              recordingStatus.soundName === sound.name ? "bg-red-500/30 animate-pulse" : "hover:bg-white/10"
                            )}
                            aria-label={recordingStatus.isRecording && recordingStatus.soundName === sound.name ? `Parar gravação de ${sound.name}` : `Gravar som para ${sound.name}`}
                            disabled={loadingSound !== null || (recordingStatus.isRecording && recordingStatus.soundName !== sound.name)}
                          >
                            {recordingStatus.isRecording && recordingStatus.soundName === sound.name ? (
                              <StopCircle className="w-8 h-8 text-red-400" />
                            ) : (
                              <Mic className={cn("w-8 h-8", selectedCategory.iconColor)} />
                            )}
                          </button>

                          <label
                            htmlFor={isUploadDisabled ? undefined : uploadInputId}
                            className={cn(
                                "p-3 rounded-full transition-colors",
                                isUploadDisabled
                                ? "opacity-50"
                                : "cursor-pointer hover:bg-white/10"
                            )}
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Fazer upload de som para ${sound.name}`}
                          >
                            <Upload className={cn("w-8 h-8", selectedCategory.iconColor)} />
                             <input
                                id={uploadInputId}
                                type="file"
                                className="hidden"
                                accept="audio/*"
                                onChange={(e) => handleFileChange(e, sound.name)}
                                disabled={isUploadDisabled}
                                onClick={(e) => e.stopPropagation()}
                              />
                          </label>
                        </>
                      )}

                      {loadingSound === sound.name ? (
                        <Loader2 className={cn("w-10 h-10 flex-shrink-0 animate-spin", selectedCategory.iconColor)} />
                      ) : playingSound === sound.name ? (
                        <Square className={cn("w-10 h-10 flex-shrink-0", selectedCategory.iconColor)} />
                      ) : (
                        <Volume2 className={cn("w-10 h-10 flex-shrink-0", selectedCategory.iconColor)} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {soundData.map((category) => (
            <Card
              key={category.name}
              className={cn(
                  "shadow-lg rounded-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:shadow-xl hover:brightness-110",
                  category.cardColor
              )}
              onClick={() => handleSelectCategory(category)}
              onKeyDown={(e) => e.key === 'Enter' && handleSelectCategory(category)}
              tabIndex={0}
              role="button"
              aria-label={`Abrir categoria de sons: ${category.name}`}
            >
              <CardContent className="flex items-center gap-6 p-6">
                <category.icon className={cn("w-16 h-16", category.iconColor)} />
                <h2 className={cn("text-3xl font-bold", category.textColor)}>
                  {category.name}
                </h2>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
