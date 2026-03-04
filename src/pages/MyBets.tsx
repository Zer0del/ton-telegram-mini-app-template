import React from 'react';
import { motion } from 'framer-motion';
import { useTelegram } from '../hooks/useTelegram';
import { useNavigate } from 'react-router-dom';

const mockBets = [
  { id: 1, match: 'Vitality vs NAVI', bet: 'Vitality победа', amount: 500, win: 950, status: 'win' as const },
  { id: 2, match: 'G2 vs FaZe', bet: 'FaZe победа', amount: 300, win: 0, status: 'lose' as const },
  { id: 3, match: 'Astralis vs MOUZ', bet: 'Astralis +1.5', amount: 750, win: 1425, status: 'win' as const },
];

export const MyBets: React.FC = () => {
  const { haptic } = useTelegram();
  const navigate = useNavigate();

  const handleRepeat = (bet: any) => {
    haptic('medium');
    alert(`Повторяем ставку на ${bet.match} — ${bet.bet}`);
    // Здесь потом будет настоящая логика
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">История ставок</h1>

      <div className="space-y-4">
        {mockBets.map((bet, index) => (
          <motion.div
            key={bet.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[var(--tg-theme-secondary-bg-color)] rounded-2xl p-5 shadow-xl border border-[var(--tg-theme-bg-color)]"
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-semibold text-lg">{bet.match}</p>
                <p className="text-sm opacity-70">{bet.bet}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                bet.status === 'win' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}>
                {bet.status === 'win' ? '✅ Выигрыш' : '❌ Проигрыш'}
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <div>Ставка: <span className="font-bold">{bet.amount} TON</span></div>
              <div>Выплата: <span className="font-bold text-green-400">{bet.win} TON</span></div>
            </div>

            <button
              onClick={() => handleRepeat(bet)}
              className="mt-4 w-full bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] py-3 rounded-xl font-semibold active:scale-95 transition-all"
            >
              Повторить ставку
            </button>
          </motion.div>
        ))}
      </div>

      {mockBets.length === 0 && (
        <div className="text-center py-20 opacity-60">
          Пока нет ставок. Сделай первую на турнирах!
        </div>
      )}

      <button
        onClick={() => navigate('/tournaments')}
        className="mt-8 w-full py-4 bg-blue-600 rounded-2xl font-bold text-lg active:bg-blue-700"
      >
        Сделать новую ставку →
      </button>
    </div>
  );
};
