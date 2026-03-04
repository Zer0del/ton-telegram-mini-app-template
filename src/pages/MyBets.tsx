import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../hooks/useTelegram';

export const MyBets: React.FC = () => {
  const { haptic } = useTelegram();
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('cs2_predictions');
    if (saved) setPredictions(JSON.parse(saved));
  }, []);

  const launchConfetti = () => {
    for (let i = 0; i < 150; i++) {
      const c = document.createElement('div');
      c.style.cssText = `position:fixed;left:${Math.random()*100}vw;top:-10px;width:8px;height:8px;background:hsl(${Math.random()*360},100%,70%);border-radius:50%;z-index:9999;`;
      document.body.appendChild(c);
      c.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: `translateY(${window.innerHeight+100}px) rotate(${Math.random()*720}deg)`, opacity: 0 }], { duration: 2500 }).onfinish = () => c.remove();
    }
  };

  useEffect(() => {
    if (predictions.some(p => p.status === 'Выиграл')) launchConfetti();
  }, [predictions]);

  return (
    <div className="p-5 pb-24">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#00eaff]">Мои предикты</h1>

      {predictions.length === 0 ? (
        <div className="text-center py-20 opacity-60">
          Пока нет предиктов<br />
          <button onClick={() => navigate('/tournaments')} className="mt-6 px-8 py-4 bg-[#00ff9d] text-black rounded-2xl font-bold">Сделать первый</button>
        </div>
      ) : (
        <div className="space-y-6">
          {predictions.map((p, i) => (
            <motion.div key={i} className="bg-[#121a2e] rounded-3xl p-6 glow-green">
              <div className="font-bold text-xl mb-1">{p.tournament}</div>
              <div className="text-[#8ba7c9]">Режим: {p.mode} • Банк: {p.bank} 💎</div>
              <div className="my-5 space-y-2">
                {p.order.map((team: string, idx: number) => (
                  <div key={idx} className="bg-[#1e2a4a] px-5 py-3 rounded-2xl flex items-center gap-3">
                    <span className="text-[#00ff9d] font-bold w-6">{idx + 1}.</span> {team}
                  </div>
                ))}
              </div>
              <div className={`text-center font-bold py-2 rounded-2xl ${p.status === 'Выиграл' ? 'bg-green-600' : 'bg-yellow-500 text-black'}`}>
                {p.status}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
