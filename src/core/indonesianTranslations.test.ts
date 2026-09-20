import { describe, it, expect } from 'vitest';
import { translateStepsToIndonesian } from './indonesianTranslations';

describe('indonesianTranslations', () => {
  it('translates common starting positions correctly', () => {
    const steps = [
      'Stand with your feet shoulder-width apart.',
      'Hold a dumbbell in each hand.',
      'Slowly lower the weights back to the starting position.',
    ];

    const translated = translateStepsToIndonesian(steps);
    expect(translated.length).toBe(3);
    expect(translated[0]).toContain('Berdiri dengan kaki dibuka selebar bahu/pinggul');
    expect(translated[1]).toContain('Pegang dumbbell');
    expect(translated[2]).toContain('Turunkan beban kembali ke posisi awal secara perlahan');
  });

  it('translates push-up cues accurately', () => {
    const steps = [
      'Start in a push-up position.',
      'Slowly lower your body until your chest nearly touches the floor.',
      'Push back up to the starting position, fully extending your arms.',
    ];

    const translated = translateStepsToIndonesian(steps);
    expect(translated[0]).toContain('Mulai dari posisi awal push-up');
    expect(translated[1]).toContain('Turunkan tubuh secara perlahan hingga dada hampir menyentuh lantai');
    expect(translated[2]).toContain('Dorong kembali tubuh ke atas');
  });

  it('returns default technique guidance when given empty steps', () => {
    const fallback = translateStepsToIndonesian([]);
    expect(fallback.length).toBe(1);
    expect(fallback[0]).toContain('Lakukan gerakan dengan teknik yang benar');
  });
});
