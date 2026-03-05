import { useState, useEffect } from 'react';

export const useCrystals = () => {
  const [crystals, setCrystals] = useState(500);

  // Загрузка баланса при монтировании
  useEffect(() => {
    const saved = localStorage.getItem('crystalBalance');
    if (saved) setCrystals(parseInt(saved));

    // Слушаем изменения из других вкладок/страниц
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'crystalBalance') {
        setCrystals(e.newValue ? parseInt(e.newValue) : 500);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Периодическая проверка (для изменений в той же вкладке)
    const interval = setInterval(() => {
      const saved = localStorage.getItem('crystalBalance');
      if (saved) setCrystals(parseInt(saved));
    }, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const updateCrystals = (newAmount: number) => {
    setCrystals(newAmount);
    localStorage.setItem('crystalBalance', newAmount.toString());
  };

  return { crystals, updateCrystals };
};
