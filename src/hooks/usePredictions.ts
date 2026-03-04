import { useLocalStorage } from 'use-local-storage';

export const usePredictions = () => {
  const [predictions, setPredictions] = useLocalStorage<any[]>('cs2_predictions', []);
  return { predictions, setPredictions };
};
