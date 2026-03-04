import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti'; // Добавь в deps: npm i react-confetti
import { useLocalStorage } from 'use-local-storage';
import { useNavigate } from 'react-router-dom';

export const MyBets: React.FC = () => {
  const navigate = useNavigate();
  const [predictions] = useLocalStorage<any[]>('cs2_predictions', []);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Mock: если угадал — confetti
    if (predictions.some(p => p.status === 'Выиграл')) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [predictions]);

  return (
    <div className="p-5 pb-24">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      <h1 className="text-3xl font-bold mb-8 text-center text-[#00eaff]">Мои предикты</h1>

      {predictions.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 opacity-60"
        >
          Пока нет предиктов. <br />
          <button onClick={() => navigate('/tournaments')} className="mt-4 px-6 py-3 bg-[#00ff9d] text-black rounded-xl font-bold">Сделать первый!</button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {predictions.map((pred, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#121a2e] rounded-3xl p-6 glow-green"
            >
              <div className="font-bold text-xl mb-2">{pred.tournament}</div>
              <div className="text-[#8ba7c9] mb-4">Режим: {pred.mode} • Банк: {pred.bank} 💎</div>
              <div className="text-sm mb-3">Твой прогноз:</div>
              <div className="space-y-2">
                {pred.order.map((team: string, i: number) => (
                  <div key={i} className="bg-[#1e2a4a] p-3 rounded-xl flex items-center gap-2">
                    <span className="font-bold text-[#00ff9d]">{i + 1} место:</span> {team}
                  </div>
                ))}
              </div>
              <div className={`mt-4 text-center font-bold ${pred.status === 'Выиграл' ? 'text-[#00ff9d]' : 'text-yellow-400'}`}>
                Статус: {pred.status}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
