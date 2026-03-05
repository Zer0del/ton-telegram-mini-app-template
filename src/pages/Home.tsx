import React from 'react';
import { motion } from 'framer-motion';
import { useTelegram } from '../hooks/useTelegram';
import { useNavigate } from 'react-router-dom';
import { useCrystals } from '../hooks/useCrystals';

export const Home: React.FC = () => {
  const { haptic } = useTelegram();
  const navigate = useNavigate();
  const { crystals } = useCrystals();

  return (
    <div className="p-5 pb-24 min-h-screen">
      {/* Верхний блок — ОСТАВЛЯЕМ ТОЛЬКО ЕГО (как на твоём скрине) */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <img src="https://www.hltv.org/img/static/cs2_logo.png" alt="CS2" className="w-12 h-12" />
          <div>
            <div className="text-3xl font-black tracking-tighter">CS2</div>
            <div className="text-4xl font-black text-green-400 -mt-3">PREDICT</div>
            <div className="text-xs text-green-400">Top-1 • Top-3 • Top-5</div>
          </div>
        </div>
        <div className="bg-zinc-800 px-5 py-2 rounded-3xl text-sm font-medium flex items-center gap-2">
          UQCm...j9kg
          <span className="text-green-400">▼</span>
        </div>
      </div>

      {/* Баланс кристаликов */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#121a2e] rounded-3xl p-6 glow-green text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3">
          <span className="text-5xl">💎</span>
          <div>
            <div className="text-4xl font-bold text-[#00ff9d]">{crystals}</div>
            <div className="text-[#8ba7c9] -mt-1">Кристалики</div>
          </div>
        </div>
      </motion.div>

      {/* Быстрые действия */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => { haptic('medium'); alert('Покупка за Stars/TON (позже интеграция)'); }}
          className="neon-btn bg-gradient-to-r from-[#00ff9d] to-[#00eaff] text-black font-bold py-6 rounded-3xl glow-green"
        >
          Купить кристалики
        </motion.button>

        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => { haptic('medium'); navigate('/tournaments'); }}
          className="neon-btn border-2 border-[#00ff9d] text-[#00ff9d] font-bold py-6 rounded-3xl"
        >
          Сделать предикт
        </motion.button>
      </div>

      {/* Задания для бесплатных кристаликов */}
      <h2 className="text-xl font-bold mb-4 text-[#00eaff]">Задания за кристалики</h2>
      <div className="space-y-3">
        {[
          "Поделись приложением с другом (+50 Crystal)",
          "Пригласи 3 друзей (+200 Crystal)",
          "Поставь предикт на 3 турнира (+100 Crystal)"
        ].map((task, i) => (
          <motion.div 
            key={i}
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#121a2e] p-5 rounded-2xl flex justify-between items-center"
          >
            <div>{task}</div>
            <button className="px-6 py-2 bg-[#00ff9d] text-black rounded-xl text-sm font-bold">Получить</button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
