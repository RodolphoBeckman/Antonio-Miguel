'use client';
import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

type Question = {
  soundHint: string;
  options: string[];
  correctAnswer: string;
};

const questions: Question[] = [
  { soundHint: 'Miau...', options: ['Cachorro', 'Gato', 'Pássaro'], correctAnswer: 'Gato' },
  { soundHint: 'Vrummm!', options: ['Carro', 'Bicicleta', 'Avião'], correctAnswer: 'Carro' },
  { soundHint: 'Glub glub!', options: ['Leão', 'Peixe', 'Elefante'], correctAnswer: 'Peixe' },
  { soundHint: 'Atchim!', options: ['Espirro', 'Tosse', 'Risada'], correctAnswer: 'Espirro' },
];

export default function SoundGuessesPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const currentQuestion = useMemo(() => questions[currentQuestionIndex], [currentQuestionIndex]);

  const handleAnswer = (option: string) => {
    if (selectedAnswer) return; // Prevent answering twice
    setSelectedAnswer(option);
    setIsCorrect(option === currentQuestion.correctAnswer);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
  };

  const isFinished = selectedAnswer !== null;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline text-foreground">Adivinha com Som</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Ouça o som e adivinhe o que é. Vamos lá!
        </p>
      </div>

      <Card className="bg-card shadow-lg rounded-2xl">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground mb-2">Que som é este?</p>
          <div className="flex justify-center items-center gap-4 mb-8">
            <Button size="icon" className="w-16 h-16 rounded-full">
              <Volume2 className="w-8 h-8" />
            </Button>
            <p className="text-3xl font-bold font-mono text-primary">{currentQuestion.soundHint}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-8">
            {currentQuestion.options.map((option) => (
              <Button
                key={option}
                size="lg"
                variant={selectedAnswer === option ? (isCorrect ? 'default' : 'destructive') : 'secondary'}
                className={cn(
                    "text-xl h-16 w-full justify-between",
                    isFinished && selectedAnswer !== option && "opacity-50"
                )}
                onClick={() => handleAnswer(option)}
                disabled={isFinished}
              >
                {option}
                {selectedAnswer === option && (
                    isCorrect ? <CheckCircle2 className="text-green-300" /> : <XCircle className="text-red-300" />
                )}
              </Button>
            ))}
          </div>

          {isFinished && (
            <div className="flex flex-col items-center animate-in fade-in-50">
                <p className={cn("text-2xl font-bold mb-4", isCorrect ? "text-green-600" : "text-destructive")}>
                    {isCorrect ? 'Você acertou! 🎉' : 'Tente outra vez!'}
                </p>
                <Button onClick={handleNext} size="lg">
                    Próxima Pergunta <RefreshCw className="ml-2" />
                </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
