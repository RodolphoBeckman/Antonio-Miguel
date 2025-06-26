'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import type { Icon as LucideIcon } from 'lucide-react';

type Sound = {
  name: string;
  description: string;
};

type Category = {
  name: string;
  icon: LucideIcon;
  sounds: Sound[];
};

const soundData: Category[] = [
  {
    name: 'Natureza',
    icon: Leaf,
    sounds: [
      { name: 'Chuva', description: 'O som calmante da chuva caindo.' },
      { name: 'Vento', description: 'O som do vento soprando suavemente.' },
      { name: 'Pássaros', description: 'O canto alegre dos pássaros pela manhã.' },
    ],
  },
  {
    name: 'Animais',
    icon: Cat,
    sounds: [
      { name: 'Cachorro', description: 'O latido amigável de um cachorro.' },
      { name: 'Gato', description: 'O miado suave de um gato.' },
      { name: 'Vaca', description: 'O mugido de uma vaca no pasto.' },
    ],
  },
  {
    name: 'Objetos',
    icon: Car,
    sounds: [
      { name: 'Telefone', description: 'O som de um telefone antigo tocando.' },
      { name: 'Carro', description: 'O som de um carro passando na rua.' },
      { name: 'Relógio', description: 'O tique-taque de um relógio de parede.' },
    ],
  },
  {
    name: 'Instrumentos',
    icon: Music,
    sounds: [
      { name: 'Violão', description: 'O som das cordas de um violão.' },
      { name: 'Piano', description: 'Uma melodia suave tocada no piano.' },
      { name: 'Bateria', description: 'O ritmo contagiante de uma bateria.' },
    ],
  },
  {
    name: 'Emoções',
    icon: Smile,
    sounds: [
      { name: 'Risada', description: 'O som de uma criança rindo feliz.' },
      { name: 'Choro', description: 'O som de um bebê chorando.' },
      { name: 'Surpresa', description: 'Um som de espanto e surpresa.' },
    ],
  },
];

export default function SoundDiscoveryPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleClearSelection = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-headline text-foreground">Descobrindo Sons</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Explore um mundo de sons! Toque em uma categoria para começar a ouvir.
        </p>
      </div>

      {selectedCategory ? (
        <Card className="bg-card shadow-lg rounded-2xl animate-in fade-in-50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <selectedCategory.icon className="w-8 h-8 text-primary" />
              <CardTitle className="text-3xl font-headline">{selectedCategory.name}</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClearSelection} aria-label="Fechar categoria">
              <X className="w-6 h-6" />
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">Toque nos botões para ouvir os sons e aprender sobre eles.</p>
            <div className="space-y-4">
              {selectedCategory.sounds.map((sound) => (
                <div key={sound.name} className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                  <div>
                    <h3 className="text-xl font-semibold text-secondary-foreground">{sound.name}</h3>
                    <p className="text-muted-foreground">{sound.description}</p>
                  </div>
                  <Button size="lg" aria-label={`Tocar som de ${sound.name}`}>
                    <Volume2 className="w-6 h-6" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {soundData.map((category) => (
            <Card
              key={category.name}
              className="bg-card shadow-lg rounded-2xl hover:bg-secondary transition-colors cursor-pointer transform hover:-translate-y-1 duration-300"
              onClick={() => handleSelectCategory(category)}
              onKeyDown={(e) => e.key === 'Enter' && handleSelectCategory(category)}
              tabIndex={0}
              role="button"
              aria-label={`Abrir categoria de sons: ${category.name}`}
            >
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <category.icon className="w-16 h-16 mb-4 text-primary" />
                <h2 className="text-2xl font-bold font-headline text-card-foreground">
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
