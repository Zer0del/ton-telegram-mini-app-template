import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const mockBets = [
  { id: 1, match: 'Vitality vs NAVI', bet: 'Vitality победа', amount: 500, win: 950, status: 'win' },
  { id: 2, match: 'G2 vs FaZe', bet: 'FaZe победа', amount: 300, win: 0, status: 'lose' },
  { id: 3, match: 'Astralis vs MOUZ', bet: 'Astralis +1.5', amount: 750, win: 1425, status: 'win' },
];

export const MyBets: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 pb-24"> {/* pb-24 чтобы не залезало под меню */}
      <h1 className="text-2xl font-bold mb-6 text-center">История ставок</h1>
      
      <div className="space-y-4">
        {mockBets.map((bet, i) => (
          <motion.div
            key={bet.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[var(--tg-theme-secondary-bg-color)] rounded-3xl p-6"
          >
            <div className="flex justify-between mb-3">
              <div>
                <div className="font-bold text-lg">{bet.match}</div>
                <div className="text-sm opacity-70">{bet.bet}</div>
              </div>
              <div className={`px-4 py-1 rounded-full text-xs font-bold ${bet.status === 'win' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                {bet.status === 'win' ? `+${bet.win} TON` : 'Проигрыш'}
              </div>
            </div>
            <div className="text-sm">Ставка: {bet.amount} TON</div>
          </motion.div>
        ))}
      </div>

      <button 
        onClick={() => navigate('/tournaments')}
        className="mt-8 w-full py-4 bg-blue-600 rounded-2xl font-bold text-lg"
      >
        Сделать новую ставку →
      </button>
    </div>
  );
};
