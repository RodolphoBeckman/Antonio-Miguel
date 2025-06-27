'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { synthesizeSpeech } from '@/ai/flows/synthesize-speech';
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
    cardColor: 'bg-green-50 dark:bg-green-900/30',
    color: 'bg-green-100 dark:bg-green-900/60',
    textColor: 'text-green-900 dark:text-green-200',
    iconColor: 'text-green-600 dark:text-green-400',
    sounds: [
      { name: 'Chuva', description: 'O som calmante da chuva caindo.', soundPrompt: 'O som de chuva suave e relaxante, com gotas de água caindo.' },
      { name: 'Vento', description: 'O som do vento soprando suavemente.', soundPrompt: 'O som do vento assobiando suavemente entre as árvores.' },
      { name: 'Pássaros', description: 'O canto alegre dos pássaros pela manhã.', soundPrompt: 'O som de vários pássaros cantando alegremente em uma floresta.' },
    ],
  },
  {
    name: 'Animais',
    icon: Cat,
    cardColor: 'bg-orange-50 dark:bg-orange-900/30',
    color: 'bg-orange-100 dark:bg-orange-900/60',
    textColor: 'text-orange-900 dark:text-orange-200',
    iconColor: 'text-orange-600 dark:text-orange-400',
    sounds: [
      { name: 'Cachorro', description: 'O latido amigável de um cachorro.', soundPrompt: 'O som de um cachorro grande latindo de forma amigável.' },
      { name: 'Gato', description: 'O miado suave de um gato.', soundPrompt: 'O som de um gato doméstico miando de forma suave.' },
      { name: 'Vaca', description: 'O mugido de uma vaca no pasto.', soundPrompt: 'O som de uma vaca mugindo em um pasto distante.' },
    ],
  },
  {
    name: 'Objetos',
    icon: Car,
    cardColor: 'bg-sky-50 dark:bg-sky-900/30',
    color: 'bg-sky-100 dark:bg-sky-900/60',
    textColor: 'text-sky-900 dark:text-sky-200',
    iconColor: 'text-sky-600 dark:text-sky-400',
    sounds: [
      { name: 'Telefone', description: 'O som de um telefone antigo tocando.', soundPrompt: 'O som de um telefone de disco antigo tocando repetidamente.' },
      { name: 'Carro', description: 'O som de um carro passando na rua.', soundPrompt: 'O som de um motor de carro acelerando e passando rapidamente.' },
      { name: 'Relógio', description: 'O tique-taque de um relógio de parede.', soundPrompt: 'O som contínuo e ritmado de um relógio de parede antigo.' },
    ],
  },
  {
    name: 'Instrumentos',
    icon: Music,
    cardColor: 'bg-purple-50 dark:bg-purple-900/30',
    color: 'bg-purple-100 dark:bg-purple-900/60',
    textColor: 'text-purple-900 dark:text-purple-200',
    iconColor: 'text-purple-600 dark:text-purple-400',
    sounds: [
      { name: 'Violão', description: 'O som das cordas de um violão.', soundPrompt: 'Um dedilhado suave e melódico com um violão acústico.' },
      { name: 'Piano', description: 'Uma melodia suave tocada no piano.', soundPrompt: 'Uma melodia calma, bonita e inspiradora tocada no piano.' },
      { name: 'Bateria', description: 'O ritmo contagiante de uma bateria.', soundPrompt: 'Uma batida de bateria animada, com pratos e tambores, bem contagiante.' },
    ],
  },
  {
    name: 'Emoções',
    icon: Smile,
    cardColor: 'bg-yellow-50 dark:bg-yellow-900/30',
    color: 'bg-yellow-100 dark:bg-yellow-900/60',
    textColor: 'text-yellow-900 dark:text-yellow-200',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
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
  const { isCustomAudioEnabled, isInitialized } = useSettings();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [loadingSound, setLoadingSound] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioCache, setAudioCache] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const [customAudio, setCustomAudio] = useState<Record<string, string>>({});
  const [recordingStatus, setRecordingStatus] = useState<{ soundName: string | null, isRecording: boolean }>({ soundName: null, isRecording: false });
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadTarget, setUploadTarget] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedCache = localStorage.getItem('audioCache');
      if (storedCache) {
        setAudioCache(JSON.parse(storedCache));
      }
      const storedCustomAudio = localStorage.getItem('customAudio');
      if (storedCustomAudio) {
        setCustomAudio(JSON.parse(storedCustomAudio));
      }
    } catch (error) {
      console.error("Failed to load cache from localStorage", error);
      localStorage.removeItem('audioCache');
      localStorage.removeItem('customAudio');
    }
  }, []);

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

    const customAudioUrl = customAudio[soundName];
    if (isCustomAudioEnabled && customAudioUrl) {
      if (audioRef.current) {
        audioRef.current.src = customAudioUrl;
        audioRef.current.play().catch((e) => console.error('Error playing custom audio:', e));
        setPlayingSound(soundName);
      }
      return;
    }
    
    try {
      let audioDataUri = audioCache[soundName];

      if (!audioDataUri) {
        setLoadingSound(soundName);
        const result = await synthesizeSpeech(soundPrompt);
        audioDataUri = result.audioDataUri;
        const newCache = { ...audioCache, [soundName]: audioDataUri };
        setAudioCache(newCache);
        try {
            localStorage.setItem('audioCache', JSON.stringify(newCache));
        } catch (e) {
            console.warn("Could not save audio cache to localStorage. Storage might be full.", e);
            toast({
              variant: "destructive",
              title: "Erro de Armazenamento",
              description: "Não foi possível salvar o som. O armazenamento pode estar cheio.",
            });
        }
      }

      if (audioRef.current && audioDataUri) {
        audioRef.current.src = audioDataUri;
        audioRef.current.play().catch((e) => console.error('Error playing AI audio:', e));
        setPlayingSound(soundName);
      }
    } catch (error) {
      console.error('Error synthesizing speech:', error);
      toast({
        variant: "destructive",
        title: "Erro ao Tocar Som",
        description: "Não foi possível gerar o áudio. Tente novamente.",
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
            const newCustomAudio = { ...customAudio, [soundName]: audioUrl };
            setCustomAudio(newCustomAudio);
            try {
              localStorage.setItem('customAudio', JSON.stringify(newCustomAudio));
            } catch (e) {
              console.warn("Could not save custom audio to localStorage.", e);
            }
            stream.getTracks().forEach(track => track.stop());
            toast({ title: "Gravação Salva!", description: "Seu áudio foi salvo com sucesso."});
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

  const handleUploadClick = (e: React.MouseEvent, soundName: string) => {
    e.stopPropagation();
    setUploadTarget(soundName);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadTarget) {
      if (file.type.startsWith('audio/')) {
        const audioUrl = await blobToBase64(file);
        const newCustomAudio = { ...customAudio, [uploadTarget]: audioUrl };
        setCustomAudio(newCustomAudio);
        try {
          localStorage.setItem('customAudio', JSON.stringify(newCustomAudio));
        } catch (e) {
          console.warn("Could not save custom audio to localStorage.", e);
        }
        toast({
          title: "Upload Concluído!",
          description: "Seu áudio foi carregado com sucesso.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Arquivo Inválido",
          description: "Por favor, selecione um arquivo de áudio.",
        });
      }
    }
    if (e.target) e.target.value = '';
    setUploadTarget(null);
  };
  
  if (!isInitialized) {
    return (
        <div className="w-full">
            <div className="mb-8">
                <Skeleton className="h-10 w-3/4 mb-3" />
                <Skeleton className="h-6 w-1/2" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-48 w-full rounded-2xl" />
                ))}
            </div>
        </div>
    );
  }

  const mainDescription = isCustomAudioEnabled
    ? 'Explore um mundo de sons! Toque para ouvir, grave sua voz ou envie um áudio personalizado.'
    : 'Explore um mundo de sons! Toque em uma categoria para começar.';

  const categoryDescription = isCustomAudioEnabled
    ? 'Toque na linha para ouvir, no microfone para gravar, ou na nuvem para enviar um áudio.'
    : 'Toque em uma linha para ouvir o som correspondente.';

  return (
    <div className="w-full">
      <audio ref={audioRef} onEnded={() => setPlayingSound(null)} />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="audio/*"
      />
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-headline text-foreground">Descobrindo Sons</h1>
        <p className="text-lg text-muted-foreground mt-2">
          {mainDescription}
        </p>
      </div>

      {selectedCategory ? (
        <Card className={cn("shadow-lg rounded-2xl animate-in fade-in-50", selectedCategory.cardColor)}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <selectedCategory.icon className={cn("w-8 h-8", selectedCategory.iconColor)} />
              <CardTitle className={cn("text-3xl font-headline", selectedCategory.textColor)}>{selectedCategory.name}</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClearSelection} aria-label="Fechar categoria" className={cn(selectedCategory.textColor, "hover:bg-black/10")}>
              <X className="w-6 h-6" />
            </Button>
          </CardHeader>
          <CardContent>
            <p className={cn("mb-6", selectedCategory.textColor, "opacity-80")}>{categoryDescription}</p>
            <div className="space-y-4">
              {selectedCategory.sounds.map((sound) => {
                const isDisabled = loadingSound !== null || (recordingStatus.isRecording && recordingStatus.soundName !== sound.name);
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
                      "w-full flex items-center justify-between p-4 rounded-xl text-left transition-all duration-200 ease-in-out transform",
                      selectedCategory.color,
                      "focus:outline-none",
                      isDisabled
                        ? "opacity-50 cursor-wait"
                        : "cursor-pointer hover:scale-[1.02] hover:shadow-lg active:scale-95 focus:ring-2 focus:ring-offset-2 focus:ring-ring"
                    )}
                  >
                    <div>
                      <h3 className={cn("text-xl font-semibold", selectedCategory.textColor)}>{sound.name}</h3>
                      <p className={cn(selectedCategory.textColor, "opacity-70")}>{sound.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {isCustomAudioEnabled && (
                        <>
                          <button
                            onClick={(e) => handleRecordClick(e, sound.name)}
                            className={cn(
                              "p-2 rounded-full transition-colors disabled:opacity-50",
                              recordingStatus.soundName === sound.name ? "bg-red-500/20" : "hover:bg-black/10"
                            )}
                            aria-label={recordingStatus.isRecording && recordingStatus.soundName === sound.name ? `Parar gravação de ${sound.name}` : `Gravar som para ${sound.name}`}
                            disabled={loadingSound !== null || (recordingStatus.isRecording && recordingStatus.soundName !== sound.name)}
                          >
                            {recordingStatus.isRecording && recordingStatus.soundName === sound.name ? (
                              <StopCircle className="w-6 h-6 text-red-600 animate-pulse" />
                            ) : (
                              <Mic className={cn("w-6 h-6", selectedCategory.iconColor)} />
                            )}
                          </button>

                          <button
                            onClick={(e) => handleUploadClick(e, sound.name)}
                            className="p-2 rounded-full transition-colors hover:bg-black/10 disabled:opacity-50"
                            aria-label={`Fazer upload de som para ${sound.name}`}
                            disabled={loadingSound !== null || recordingStatus.isRecording}
                          >
                            <Upload className={cn("w-6 h-6", selectedCategory.iconColor)} />
                          </button>
                        </>
                      )}

                      {loadingSound === sound.name ? (
                        <Loader2 className={cn("w-8 h-8 flex-shrink-0 animate-spin", selectedCategory.iconColor)} />
                      ) : playingSound === sound.name ? (
                        <Square className={cn("w-8 h-8 flex-shrink-0", selectedCategory.iconColor)} />
                      ) : (
                        <Volume2 className={cn("w-8 h-8 flex-shrink-0", selectedCategory.iconColor)} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {soundData.map((category) => (
            <Card
              key={category.name}
              className={cn(
                  "shadow-lg rounded-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:shadow-xl hover:brightness-105",
                  category.cardColor
              )}
              onClick={() => handleSelectCategory(category)}
              onKeyDown={(e) => e.key === 'Enter' && handleSelectCategory(category)}
              tabIndex={0}
              role="button"
              aria-label={`Abrir categoria de sons: ${category.name}`}
            >
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <category.icon className={cn("w-16 h-16 mb-4", category.iconColor)} />
                <h2 className={cn("text-2xl font-bold font-headline", category.textColor)}>
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
