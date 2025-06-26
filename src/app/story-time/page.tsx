'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookMarked, ChevronsRight, Zap, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

const stories = [
  {
    theme: 'Aventura',
    title: 'A Floresta Encantada',
    image: 'https://placehold.co/600x400.png',
    "data-ai-hint": "enchanted forest",
    content: [
      "Era uma vez, um coelhinho corajoso chamado Fiapo. Ele decidiu explorar a Floresta Encantada.",
      "De repente, Fiapo ouviu um barulho estranho! (Som de galho quebrando) [VIBRAÇÃO CURTA]",
      "Era um esquilo amigável, que ofereceu uma noz mágica. Fiapo aceitou e sentiu uma energia incrível! (Som de brilho mágico) [VIBRAÇÃO LONGA]",
      "Juntos, eles encontraram uma cachoeira cintilante e viveram uma grande aventura.",
    ]
  },
  {
    theme: 'Amizade',
    title: 'O Gato e o Pássaro',
    image: 'https://placehold.co/600x400.png',
    "data-ai-hint": "cat bird",
    content: [
      "Em um telhado ensolarado, vivia um gato chamado Mimo. Ele adorava observar os pássaros.",
      "Um dia, um pequeno pássaro caiu do ninho. (Som de piado triste) [VIBRAÇÃO SUAVE]",
      "Mimo, com cuidado, pegou o passarinho e o levou de volta para sua mãe. (Som de ronronar)",
      "A partir daquele dia, Mimo e a família de pássaros se tornaram grandes amigos.",
    ]
  },
  {
    theme: 'Escola',
    title: 'O Primeiro Dia de Lia',
    image: 'https://placehold.co/600x400.png',
    "data-ai-hint": "school classroom",
    content: [
      "Lia estava animada para seu primeiro dia na escola de sons.",
      "A professora, uma coruja sábia, tocou um sino para começar a aula. (Som de sino) [VIBRAÇÃO MÉDIA]",
      "Lia aprendeu a identificar o som da chuva e do vento, e fez muitos amigos.",
      "No final do dia, ela estava muito feliz e mal podia esperar para voltar no dia seguinte.",
    ]
  }
];

type Story = typeof stories[0];

export default function StoryTimePage() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [storyPage, setStoryPage] = useState(0);

  const handleSelectStory = (story: Story) => {
    setSelectedStory(story);
    setStoryPage(0);
  };

  const handleBackToList = () => {
    setSelectedStory(null);
  };

  const handleNextPage = () => {
    if (selectedStory && storyPage < selectedStory.content.length - 1) {
      setStoryPage(p => p + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (storyPage > 0) {
      setStoryPage(p => p - 1);
    }
  };

  if (selectedStory) {
    return (
      <div className="w-full">
        <Button onClick={handleBackToList} variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2" /> Voltar para Histórias
        </Button>
        <Card className="bg-card shadow-lg rounded-2xl overflow-hidden animate-in fade-in-50">
          <CardContent className="p-8 text-center">
            <h1 className="text-4xl font-bold font-headline mb-2">{selectedStory.title}</h1>
            <p className="text-lg text-muted-foreground mb-8">Página {storyPage + 1} de {selectedStory.content.length}</p>
            <div className="text-2xl/relaxed text-foreground min-h-[10rem] flex items-center justify-center bg-secondary p-6 rounded-xl">
              <p>
                {selectedStory.content[storyPage].split(/(\[.*?\]|\(.*?\))/).map((part, index) => {
                  if (part.startsWith('[VIBRAÇÃO')) {
                    return <Zap key={index} className="inline-block mx-1 text-primary animate-pulse" />;
                  }
                  if (part.startsWith('(Som')) {
                    return <span key={index} className="font-bold text-primary">{part}</span>;
                  }
                  return part;
                })}
              </p>
            </div>
            <div className="flex justify-center gap-4 mt-8">
              <Button onClick={handlePrevPage} disabled={storyPage === 0} size="lg">Anterior</Button>
              <Button onClick={handleNextPage} disabled={storyPage === selectedStory.content.length - 1} size="lg">Próximo</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-headline text-foreground">Histórias com Sentidos</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Escolha uma história para ouvir, sentir e imaginar.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stories.map((story) => (
          <Card
            key={story.title}
            className="bg-card shadow-lg rounded-2xl overflow-hidden group cursor-pointer"
            onClick={() => handleSelectStory(story)}
            onKeyDown={(e) => e.key === 'Enter' && handleSelectStory(story)}
            tabIndex={0}
            aria-label={`Ouvir história: ${story.title}`}
          >
            <div className="overflow-hidden">
              <Image 
                src={story.image}
                alt={story.title}
                width={600}
                height={400}
                data-ai-hint={story['data-ai-hint']}
                className="group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardContent className="p-6">
              <p className="text-primary font-semibold mb-1">{story.theme}</p>
              <h2 className="text-2xl font-bold font-headline text-card-foreground mb-4">{story.title}</h2>
              <Button className="w-full">
                Ouvir História <ChevronsRight className="ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
