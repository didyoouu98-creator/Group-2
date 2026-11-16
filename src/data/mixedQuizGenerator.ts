import { MixedQuizItem, CanadianTaxQuizQuestion, WordPuzzle } from '../types';
import { loadCanadianTaxQuestions } from './canadianTaxQuiz';
import { WORD_PUZZLES, shufflePuzzles } from './wordPuzzles';

/**
 * Generates a mixed Canadian accounting and tax quiz session.
 * Default: 4 alternating questions (1: MCQ, 2: Word Puzzle, 3: MCQ, 4: Word Puzzle)
 */
export function generateMixedQuizSession(totalQuestions: number = 4): MixedQuizItem[] {
  const mcqPool = [...loadCanadianTaxQuestions()].sort(() => 0.5 - Math.random());
  const puzzlePool = shufflePuzzles(WORD_PUZZLES);

  const items: MixedQuizItem[] = [];
  let mcqIdx = 0;
  let puzzleIdx = 0;

  for (let i = 0; i < totalQuestions; i++) {
    // Alternate: even index (0, 2) is MCQ, odd index (1, 3) is Word Puzzle
    const isMcq = i % 2 === 0;

    if (isMcq && mcqIdx < mcqPool.length) {
      const q: CanadianTaxQuizQuestion = mcqPool[mcqIdx++];
      items.push({
        id: `mixed-mcq-${q.id}-${Date.now()}-${i}`,
        type: 'mcq',
        topic: q.topic,
        prompt: q.question,
        options: [...q.options],
        correctIndex: q.correctIndex,
        explanation: q.explanation,
      });
    } else if (puzzleIdx < puzzlePool.length) {
      const p: WordPuzzle = puzzlePool[puzzleIdx++];
      items.push({
        id: `mixed-word-${p.id}-${Date.now()}-${i}`,
        type: 'word_puzzle',
        topic: p.category,
        prompt: p.clue,
        targetWord: p.word.toUpperCase(),
        category: p.category,
        explanation: `Answer: ${p.word}. ${p.clue}`,
      });
    } else if (mcqIdx < mcqPool.length) {
      // Fallback to MCQ if puzzle pool exhausted
      const q = mcqPool[mcqIdx++];
      items.push({
        id: `mixed-mcq-${q.id}-${Date.now()}-${i}`,
        type: 'mcq',
        topic: q.topic,
        prompt: q.question,
        options: [...q.options],
        correctIndex: q.correctIndex,
        explanation: q.explanation,
      });
    }
  }

  return items;
}
