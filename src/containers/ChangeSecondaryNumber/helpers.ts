export const isNotNumbersOnly = (text: string): boolean => {
  const numRegex = /^\d+$/;

  return numRegex.test(text);
};
