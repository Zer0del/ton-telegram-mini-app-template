import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTelegram } from '../hooks/useTelegram';
import { useNavigate } from 'react-router-dom';

const tournaments = [
  { id: 1, name: "BLAST Premier Spring Final 2026", date: "15 марта", prize: "1 000 000$", teams: ['Vitality', 'NAVI', 'G2', 'FaZe', 'Astralis', 'MOUZ', 'Spirit', 'Liquid'] },
];

const modes = [
  { name: "Топ-5", places: 5 },
  { name: "Топ-3", places: 3 },
  { name: "Топ-1", places: 1 },
];

export const Tournaments: React.FC = () => {
  const { haptic } = useTelegram();
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState<any[]>([]);
  const [selectedMode, setSelectedMode] = useState<any>(null);
  const [selectedTournament, setSelectedTournament] = useState<any>(null);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);

  // Загружаем предикты
  useEffect(() => {
    const saved = localStorage.getItem('cs2_predictions');
    if (saved) setPredictions(JSON.parse(saved));
  }, []);

  const savePredictions = (newPreds: any[]) => {
    localStorage.setItem('cs2_predictions', JSON.stringify(newPreds));
    setPredictions(newPreds);
  };

  // Проверка: есть ли уже предикт на этот турнир + режим
  const hasPrediction = (tournamentName: string, modeName: string) => {
    return predictions.some(p => p.tournament === tournamentName && p.mode === modeName);
  };

  const openModal = (t: any, m: any) => {
    if (hasPrediction(t.name, m.name)) {
      haptic('medium');
      alert(`У тебя уже есть предикт на режим "${m.name}" для этого турнира!`);
      return;
    }
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
    // Проверка на дубликаты
    const uniqueTeams = new Set(selectedTeams);
    if (uniqueTeams.size !== selectedTeams.length) {
      alert('Нельзя ставить одну команду на разные места!');
      return;
    }
    if (selectedTeams.some(t => !t)) {
      alert('Выбери все места!');
      return;
    }

    haptic('heavy');

    const newPred = {
      id: Date.now(),
      tournament: selectedTournament.name,
      mode: selectedMode.name,
      order: [...selectedTeams], // копия
      status: 'В процессе',
      bank: Math.floor(Math.random() * 12000) + 3000,
    };

    savePredictions([...predictions, newPred]);
    setSelectedMode(null);
    navigate('/my-bets');
  };

  return (
    <div className="p-5 pb-24">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#00eaff]">Tier-1 Турниры CS2</h1>

      {tournaments.map(t => (
        <motion.div key={t.id} className="bg-[#121a2e] rounded-3xl p-6 mb-6 glow-blue">
          <div className="font-bold text-xl">{t.name}</div>
          <div className="text-[#8ba7c9] mb-5">{t.date} • Приз {t.prize}</div>

          <div className="grid grid-cols-3 gap-3">
            {modes.map(m => {
              const alreadyHas = hasPrediction(t.name, m.name);
              return (
                <motion.button 
                  key={m.name}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openModal(t, m)}
                  disabled={alreadyHas}
                  className={`py-6 rounded-2xl font-bold transition-all ${alreadyHas 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                    : 'bg-[#1e2a4a] border border-[#00ff9d] hover:bg-[#00ff9d] hover:text-black'}`}
                >
                  {m.name}<br />
                  <span className="text-xs opacity-70">100 💎</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      ))}

      {/* Модалка */}
      {selectedMode && (
        <div className="fixed inset-0 bg-black/90 flex items-end z-50">
          <div className="bg-[#121a2e] w-full rounded-t-3xl p-6">
            <h2 className="text-xl font-bold text-center mb-6">Расставь {selectedMode.name}</h2>
            
            {Array.from({ length: selectedMode.places }).map((_, i) => (
              <div key={i} className="mb-4">
                <div className="text-[#00ff9d] mb-2">Место {i+1}</div>
                <select 
                  value={selectedTeams[i]} 
                  onChange={e => handleTeamSelect(i, e.target.value)}
                  className="w-full p-4 bg-[#1e2a4a] rounded-2xl text-white"
                >
                  <option value="">Выбери команду</option>
                  {selectedTournament.teams
                    .filter((team: string) => !selectedTeams.includes(team) || selectedTeams[i] === team)
                    .map((team: string) => (
                      <option key={team} value={team}>{team}</option>
                    ))}
                </select>
              </div>
            ))}

            <div className="flex gap-3 mt-8">
              <button onClick={() => setSelectedMode(null)} className="flex-1 py-4 bg-red-600 rounded-2xl font-bold">Отмена</button>
              <button onClick={confirmPrediction} className="flex-1 py-4 bg-[#00ff9d] text-black rounded-2xl font-bold">Подтвердить предикт</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
