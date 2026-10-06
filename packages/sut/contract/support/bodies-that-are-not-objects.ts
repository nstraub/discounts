const bodiesThatAreNotObjects = ['[]', '"25"', '25', 'null'];

export const answersInTurnToBodiesThatAreNotObjects = async <Answer>(send: (body: string) => PromiseLike<Answer>): Promise<Answer[]> => {
  const answers: Answer[] = [];
  for (const body of bodiesThatAreNotObjects) {
    answers.push(await send(body));
  }
  return answers;
};

export const statusesAnsweringBodiesThatAreNotObjects = async (send: (body: string) => PromiseLike<{ status: number }>): Promise<number[]> =>
  (await answersInTurnToBodiesThatAreNotObjects(send)).map((answer) => answer.status);
