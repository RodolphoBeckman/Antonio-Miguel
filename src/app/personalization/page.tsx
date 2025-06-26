'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { personalizeSoundscape, type PersonalizeSoundscapeOutput } from '@/ai/flows/personalize-soundscape';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Loader2, Wand2, Music, BookOpen, Clock, Heart } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  userBehavioralModel: z.string().min(20, {
    message: 'Por favor, descreva o comportamento com pelo menos 20 caracteres.',
  }),
});

const availableSounds = [
    'Chuva', 'Vento', 'Pássaros', 'Cachorro', 'Gato', 'Vaca',
    'Telefone', 'Carro', 'Relógio', 'Violão', 'Piano', 'Bateria',
    'Risada', 'Choro', 'Surpresa'
];
  
const availableStories = [
    'A Floresta Encantada',
    'O Gato e o Pássaro',
    'O Primeiro Dia de Lia'
];

export default function PersonalizationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PersonalizeSoundscapeOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userBehavioralModel: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const aiResult = await personalizeSoundscape({
          ...values,
          availableSounds,
          availableStories,
      });
      setResult(aiResult);
    } catch (error) {
      console.error('Error personalizing soundscape:', error);
      toast({
        variant: "destructive",
        title: "Erro na Personalização",
        description: "Não foi possível gerar a personalização. Tente novamente.",
      })
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
       <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline text-foreground">Personalização com IA</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Descreva o perfil da criança para a IA criar uma experiência única e adaptada.
        </p>
      </div>
      <Card className="bg-card shadow-lg rounded-2xl">
        <CardContent className="p-8">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
                control={form.control}
                name="userBehavioralModel"
                render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-lg">Modelo Comportamental do Usuário</FormLabel>
                    <FormControl>
                    <Textarea
                        placeholder="Ex: Criança de 5 anos, muito calma, gosta de sons de animais e tem dificuldade com ritmos rápidos. Mostra frustração quando não consegue completar uma tarefa..."
                        className="min-h-[150px] text-base"
                        {...field}
                    />
                    </FormControl>
                    <FormDescription>
                    Forneça detalhes sobre as preferências, estilo de aprendizagem e progresso da criança.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />
            <Button type="submit" disabled={isLoading} size="lg" className="w-full">
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Personalizando...
                    </>
                ) : (
                    <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Gerar Personalização
                    </>
                )}
            </Button>
            </form>
        </Form>
        </CardContent>
      </Card>
      
      {result && (
        <Card className="mt-8 bg-card shadow-lg rounded-2xl animate-in fade-in-50">
            <CardHeader>
                <CardTitle className="text-2xl font-headline text-center">Recomendações da IA</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6 text-lg">
               <div className="p-4 bg-secondary rounded-lg">
                    <h3 className="font-bold flex items-center mb-2"><Music className="mr-2 text-primary"/>Sons Personalizados</h3>
                    <ul className="list-disc list-inside ml-4">{result.personalizedSounds.map(s => <li key={s}>{s}</li>)}</ul>
               </div>
               <div className="p-4 bg-secondary rounded-lg">
                    <h3 className="font-bold flex items-center mb-2"><BookOpen className="mr-2 text-primary"/>Histórias Personalizadas</h3>
                    <ul className="list-disc list-inside ml-4">{result.personalizedStories.map(s => <li key={s}>{s}</li>)}</ul>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                    <h3 className="font-bold flex items-center mb-2"><Clock className="mr-2 text-primary"/>Ritmo de Aprendizagem</h3>
                    <p>{result.learningPace}</p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                    <h3 className="font-bold flex items-center mb-2"><Heart className="mr-2 text-primary"/>Estilo de Incentivo</h3>
                    <p>{result.encouragementStyle}</p>
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
