export const timesTheRaceIsRun = 20;

export const oneRaceAfterAnother = async <Item, Answer>(items: Item[], race: (item: Item) => Promise<Answer>): Promise<Answer[]> => {
  const answers: Answer[] = [];
  for (const item of items) {
    answers.push(await race(item));
  }
  return answers;
};
