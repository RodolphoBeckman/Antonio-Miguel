'use server';

/**
 * @fileOverview A flow to personalize the soundscape and story selections, learning pace, and encouragement style according to a behavioral model of the user.
 *
 * - personalizeSoundscape - A function that handles the soundscape personalization process.
 * - PersonalizeSoundscapeInput - The input type for the personalizeSoundscape function.
 * - PersonalizeSoundscapeOutput - The return type for the personalizeSoundscape function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizeSoundscapeInputSchema = z.object({
  userBehavioralModel: z
    .string()
    .describe(
      'A description of the user behavioral model, including preferences, learning style, and progress.'
    ),
  availableSounds: z
    .array(z.string())
    .describe('A list of available sound options.'),
  availableStories: z
    .array(z.string())
    .describe('A list of available story options.'),
});
export type PersonalizeSoundscapeInput = z.infer<
  typeof PersonalizeSoundscapeInputSchema
>;

const PersonalizeSoundscapeOutputSchema = z.object({
  personalizedSounds: z
    .array(z.string())
    .describe('A list of personalized sound selections.'),
  personalizedStories: z
    .array(z.string())
    .describe('A list of personalized story selections.'),
  learningPace: z
    .string()
    .describe('The recommended learning pace for the user.'),
  encouragementStyle: z
    .string()
    .describe('The recommended encouragement style for the user.'),
});
export type PersonalizeSoundscapeOutput = z.infer<
  typeof PersonalizeSoundscapeOutputSchema
>;

export async function personalizeSoundscape(
  input: PersonalizeSoundscapeInput
): Promise<PersonalizeSoundscapeOutput> {
  return personalizeSoundscapeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizeSoundscapePrompt',
  input: {schema: PersonalizeSoundscapeInputSchema},
  output: {schema: PersonalizeSoundscapeOutputSchema},
  prompt: `You are an AI therapist specializing in creating personalized soundscapes for children with visual impairments.

  Given the following user behavioral model, available sounds, and available stories, determine the personalized sound selections, personalized story selections, learning pace, and encouragement style that would be most effective for the child.

  User Behavioral Model: {{{userBehavioralModel}}}
  Available Sounds: {{#each availableSounds}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Available Stories: {{#each availableStories}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Please provide the output in JSON format.
  `,
});

const personalizeSoundscapeFlow = ai.defineFlow(
  {
    name: 'personalizeSoundscapeFlow',
    inputSchema: PersonalizeSoundscapeInputSchema,
    outputSchema: PersonalizeSoundscapeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
