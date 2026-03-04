import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTelegram } from '../hooks/useTelegram';
import { useLocalStorage } from 'use-local-storage';
import { useNavigate } from 'react-router-dom';

const tournaments = [
  { id: 1, name: "BLAST Premier Spring Final 2026", date: "15 марта", prize: "1 000 000$", teams: ['Vitality', 'NAVI', 'G2', 'FaZe', 'Astralis', 'MOUZ', 'Spirit', 'Liquid'] },
  { id: 2, name: "IEM Katowice 2026", date: "22 марта", prize: "1 250 000$", teams: ['Vitality', 'NAVI', 'G2', 'FaZe', 'Astralis', 'MOUZ', 'Spirit', 'Liquid'] },
];

const modes = [
  { name: "Топ-5", places: 5, cost: 100 },
  { name: "Топ-3", places: 3, cost: 100 },
  { name: "Топ-1", places: 1, cost: 100 },
];

export const Tournaments: React.FC = () => {
  const { haptic } = useTelegram();
  const navigate = useNavigate();
  const [predictions, setPredictions] = useLocalStorage<any[]>('cs2_predictions', []);
  const [selectedMode, setSelectedMode] = useState<any>(null);
  const [selectedTournament, setSelectedTournament] = useState<any>(null);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);

  const openModal = (t: any, m: any) => {
    haptic('medium');
    setSelectedTournament(t);
    setSelectedMode(m);
    setSelectedTeams(Array(m.places).fill(''));
  };

  const handleTeamSelect = (place: number, team: string) => {
    const newTeams = [...selectedTeams];
    newTeams[place] = team;
    setSelectedTeams(newTeams);
  };

  const confirmPrediction = () => {
    if (selectedTeams.some(t => !t)) return alert('Выбери все места!');
    haptic('heavy');

    const newPred = {
      id: Date.now(),
      tournament: selectedTournament.name,
      mode: selectedMode.name,
      order: selectedTeams,
      status: 'В процессе',
      bank: Math.floor(Math.random() * 12000) + 3000,
    };

    setPredictions([...predictions, newPred]);
    setSelectedMode(null);
    navigate('/my-bets');
  };

  return (
    <div className="p-5 pb-24">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#00eaff]">Tier-1 Турниры CS2</h1>

      {tournaments.map((t, i) => (
        <motion.div key={t.id} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
          className="bg-[#121a2e] rounded-3xl p-6 mb-6 glow-blue">
          <div className="font-bold text-xl">{t.name}</div>
          <div className="text-[#8ba7c9] mb-5">{t.date} • Приз {t.prize}</div>

          <div className="grid grid-cols-3 gap-3">
            {modes.map(m => (
              <motion.button key={m.name} whileTap={{ scale: 0.92 }} onClick={() => openModal(t, m)}
                className="neon-btn bg-[#1e2a4a] border border-[#00ff9d] py-5 rounded-2xl text-sm font-bold hover:bg-[#00ff9d] hover:text-black">
                {m.name}<br /><span className="opacity-70 text-xs">100 💎</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Модалка выбора команд */}
      {selectedMode && (
        <div className="fixed inset-0 bg-black/80 flex items-end justify-center z-50 pb-10">
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="bg-[#121a2e] w-full max-w-md rounded-t-3xl p-6">
            <h2 className="text-xl font-bold text-center mb-6">Расставь {selectedMode.name}</h2>
            
            {Array.from({ length: selectedMode.places }).map((_, place) => (
              <div key={place} className="mb-4">
                <div className="text-[#00ff9d] font-bold mb-1">{place + 1} место</div>
                <select value={selectedTeams[place]} onChange={e => handleTeamSelect(place, e.target.value)}
                  className="w-full bg-[#1e2a4a] p-4 rounded-2xl text-white">
                  <option value="">Выбери команду</option>
                  {selectedTournament.teams.map((team: string) => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
              </div>
            ))}

            <div className="flex gap-4 mt-8">
              <button onClick={() => setSelectedMode(null)} className="flex-1 py-4 bg-red-600 rounded-2xl font-bold">Отмена</button>
              <button onClick={confirmPrediction} className="flex-1 py-4 bg-[#00ff9d] text-black rounded-2xl font-bold">Подтвердить предикт</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
