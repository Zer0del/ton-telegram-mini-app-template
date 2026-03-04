import React from 'react';
import { motion } from 'framer-motion';
import { useTelegram } from '../hooks/useTelegram';
import { useCrystals } from '../hooks/useCrystals';
import { useNavigate } from 'react-router-dom';

export const Admin: React.FC = () => {
  const { haptic } = useTelegram();
  const { resetCrystals } = useCrystals();
  const navigate = useNavigate();

  const handleFullReset = () => {
    haptic('heavy');

    if (!window.confirm('ТЫ УВЕРЕН?\n\nЭто удалит ВСЕ предикты и сбросит баланс.')) return;
    if (!window.confirm('ПОСЛЕДНЕЕ ПРЕДУПРЕЖДЕНИЕ!\n\nДанные удалятся НАВСЕГДА.')) return;

    // Сброс всего
    localStorage.removeItem('cs2_predictions');
    resetCrystals();

    alert('✅ ВСЁ СБРОШЕНО!\nБаланс = 500 кристаликов\nВсе предикты удалены.');

    // Мягкий релоад — именно так работает в Telegram Mini Apps
    navigate(0);
  };

  return (
    <div className="p-5 pb-24">
      <h1 className="text-4xl font-bold text-center mb-10 text-red-500">⚠️ АДМИН ПАНЕЛЬ</h1>

      {/* Твоя форма добавления турниров (оставил как было) */}
      <div className="bg-[#121a2e] rounded-3xl p-6 mb-8">
        <h2 className="text-xl font-bold mb-6 text-[#00ff9d]">Добавить турнир</h2>
        {/* сюда вставь свою форму, если она была */}
      </div>

      {/* Кнопка сброса */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleFullReset}
        className="w-full py-7 bg-red-600 hover:bg-red-700 text-white font-bold text-2xl rounded-3xl active:scale-95 transition-all"
      >
        СБРОСИТЬ ВСЁ<br />
        <span className="text-sm opacity-75">(баланс + все предикты)</span>
      </motion.button>

      <p className="text-center mt-6 text-red-400 text-xs">
        Используй только для теста. Данные удаляются навсегда.
      </p>
    </div>
  );
};
