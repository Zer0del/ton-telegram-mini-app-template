import { useState, useEffect } from 'react';

export const useCrystals = () => {
  const [crystals, setCrystals] = useState(1240);

  useEffect(() => {
    const saved = localStorage.getItem('cs2_crystals');
    if (saved) setCrystals(parseInt(saved));
  }, []);

  const updateCrystals = (newAmount: number) => {
    setCrystals(newAmount);
    localStorage.setItem('cs2_crystals', newAmount.toString());
  };

  const resetCrystals = () => {
    updateCrystals(500); // после сброса даём 500 кристаликов для теста
  };

  return { crystals, updateCrystals, resetCrystals };
};
