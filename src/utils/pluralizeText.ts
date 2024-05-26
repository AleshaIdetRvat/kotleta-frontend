/**
 * ---
 * # Пример:
 * const responsesPluralized = pluralize(
 *   responsesCount,
 *   ['отклик', 'отклика', 'откликов'],
 * );
 */
export const pluralize = (count: number, words: string[]) => {
  const cases = [2, 0, 1, 1, 1, 2];
  return words[
    count % 100 > 4 && count % 100 < 20 ? 2 : cases[Math.min(count % 10, 5)]
  ];
};
