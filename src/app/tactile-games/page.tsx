import { FeatureCard } from '@/components/feature-card';
import { Button } from '@/components/ui/button';
import { Move, Waves } from 'lucide-react';

function TouchTheSoundGame() {
  return (
    <div className="p-4 bg-secondary rounded-xl">
      <p className="text-center text-muted-foreground mb-4">Toque nos círculos para sentir a vibração e ouvir o som.</p>
      <div className="grid grid-cols-3 gap-4 h-64">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="flex items-center justify-center">
            <button
              className="w-20 h-20 bg-primary rounded-full text-primary-foreground flex items-center justify-center shadow-lg transform active:scale-95 transition-transform focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label={`Ponto de toque ${i + 1}`}
            >
              <Waves className="w-8 h-8" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TactileGamesPage() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-headline text-foreground">Toque e Movimento</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Use suas mãos para explorar, desenhar e sentir o mundo.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <FeatureCard
          title="Desenho no Ar"
          description="Siga as instruções para desenhar formas no ar com seus dedos e braços."
          icon={Move}
        >
          <div className="space-y-4 text-center p-6 bg-secondary rounded-xl">
            <p className="text-lg font-semibold text-secondary-foreground">Instrução atual:</p>
            <p className="text-2xl font-bold text-primary">"Desenhe um círculo grande na sua frente"</p>
            <Button size="lg">Próxima Instrução</Button>
          </div>
        </FeatureCard>
        <FeatureCard
          title="Toque o Som"
          description="Toque nos pontos da tela para sentir a vibração e descobrir onde o som está."
          icon={Waves}
        >
          <TouchTheSoundGame />
        </FeatureCard>
      </div>
    </div>
  );
}
