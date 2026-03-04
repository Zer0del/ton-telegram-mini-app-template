import React from 'react';
import { motion } from 'framer-motion';
import { useTelegram } from '../hooks/useTelegram';
import { useNavigate } from 'react-router-dom';

const tournaments = [
  { id: 1, name: "BLAST Premier Spring Final 2026", date: "15 марта", prize: "1 000 000$" },
  { id: 2, name: "IEM Katowice 2026", date: "22 марта", prize: "1 250 000$" },
];

const modes = [
  { name: "Топ-5", cost: 100, desc: "Угадай все 5 мест" },
  { name: "Топ-3", cost: 100, desc: "Угадай 1–3 места" },
  { name: "Топ-1", cost: 100, desc: "Угадай победителя" },
];

export const Tournaments: React.FC = () => {
  const { haptic } = useTelegram();
  const navigate = useNavigate();

  const handleBet = (tournament: any, mode: any) => {
    haptic('heavy');
    alert(`Ставка 100 кристаликов на ${mode.name} в ${tournament.name}\nБанк формируется!`);
    // Здесь потом будет модальное окно с выбором команд
  };

  return (
    <div className="p-5 pb-24">
      <h1 className="text-3xl font-bold mb-8 text-center neon-text">Tier-1 Турниры CS2</h1>

      {tournaments.map((t, index) => (
        <motion.div 
          key={t.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-[#121a2e] rounded-3xl p-6 mb-6 glow-blue"
        >
          <div className="font-bold text-xl mb-1">{t.name}</div>
          <div className="text-[#8ba7c9] mb-4">{t.date} • Призовой фонд {t.prize}</div>

          <div className="grid grid-cols-3 gap-3">
            {modes.map(mode => (
              <motion.button
                key={mode.name}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleBet(t, mode)}
                className="neon-btn bg-[#1e2a4a] hover:bg-[#00ff9d] hover:text-black border border-[#00ff9d] py-4 rounded-2xl text-sm font-bold transition-all"
              >
                {mode.name}<br />
                <span className="text-xs opacity-70">100 💎</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
