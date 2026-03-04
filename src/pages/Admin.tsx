import React from 'react';
import { motion } from 'framer-motion';
import { useTelegram } from '../hooks/useTelegram';
import { useCrystals } from '../hooks/useCrystals';

export const Admin: React.FC = () => {
  const { haptic } = useTelegram();
  const { resetCrystals } = useCrystals();

  const handleFullReset = () => {
    haptic('heavy');

    if (!window.confirm('ТЫ УВЕРЕН?\n\nЭто удалит ВСЕ предикты и сбросит баланс кристаликов.')) return;
    if (!window.confirm('ПОСЛЕДНЕЕ ПРЕДУПРЕЖДЕНИЕ!\n\nДанные будут удалены НАВСЕГДА.')) return;

    // Сброс предиктов
    localStorage.removeItem('cs2_predictions');

    // Сброс баланса
    resetCrystals();

    alert('✅ ВСЁ СБРОШЕНО!\nБаланс = 500 кристаликов\nВсе предикты удалены.');

    window.location.reload();
  };

  return (
    <div className="p-5 pb-24">
      <h1 className="text-4xl font-bold text-center mb-10 text-red-500">⚠️ АДМИН ПАНЕЛЬ</h1>

      {/* Твоя старая форма добавления турниров */}
      <div className="bg-[#121a2e] rounded-3xl p-6 mb-8">
        <h2 className="text-xl font-bold mb-6 text-[#00ff9d]">Добавить турнир</h2>
        {/* Здесь оставь свою форму, если хочешь — я её не трогал */}
        {/* (если хочешь, могу потом обновить под новый стиль) */}
      </div>

      {/* НОВАЯ КНОПКА СБРОСА */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleFullReset}
        className="w-full py-7 bg-red-600 hover:bg-red-700 text-white font-bold text-2xl rounded-3xl glow-red active:scale-95 transition-all"
      >
        СБРОСИТЬ ВСЁ<br />
        <span className="text-sm opacity-75">(баланс + все предикты)</span>
      </motion.button>

      <p className="text-center mt-6 text-red-400 text-xs">
        Используй только для теста. Данные удаляются безвозвратно.
      </p>
    </div>
  );
};
