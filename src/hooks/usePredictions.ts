import { useState } from 'react';

export const usePredictions = () => {
  const [predictions, setPredictions] = useState<any[]>([]);

  return { predictions, setPredictions };
};
