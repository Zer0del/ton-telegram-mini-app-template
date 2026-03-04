import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTelegram } from '../hooks/useTelegram';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'; // Добавь в deps: npm i react-beautiful-dnd
import { useLocalStorage } from 'use-local-storage';
import { useNavigate } from 'react-router-dom';

const tournaments = [
  { id: 1, name: "BLAST Premier Spring Final 2026", date: "15 марта", prize: "1 000 000$", teams: ['Vitality', 'NAVI', 'G2', 'FaZe', 'Astralis', 'MOUZ', 'Spirit', 'Liquid'] },
  { id: 2, name: "IEM Katowice 2026", date: "22 марта", prize: "1 250 000$", teams: ['Vitality', 'NAVI', 'G2', 'FaZe', 'Astralis', 'MOUZ', 'Spirit', 'Liquid'] },
];

const modes = [
  { name: "Топ-5", places: 5, cost: 100, desc: "Угадай все 5 мест" },
  { name: "Топ-3", places: 3, cost: 100, desc: "Угадай 1–3 места" },
  { name: "Топ-1", places: 1, cost: 100, desc: "Угадай победителя" },
];

export const Tournaments: React.FC = () => {
  const { haptic } = useTelegram();
  const navigate = useNavigate();
  const [predictions, setPredictions] = useLocalStorage<any[]>('cs2_predictions', []);
  const [selectedMode, setSelectedMode] = useState<any>(null);
  const [selectedTournament, setSelectedTournament] = useState<any>(null);
  const [predictionOrder, setPredictionOrder] = useState<string[]>([]);

  const openModal = (tournament: any, mode: any) => {
    haptic('medium');
    setSelectedTournament(tournament);
    setSelectedMode(mode);
    setPredictionOrder(tournament.teams.slice(0, mode.places)); // Начальный порядок
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const newOrder = Array.from(predictionOrder);
    const [moved] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, moved);
    setPredictionOrder(newOrder);
  };

  const confirmPrediction = () => {
    haptic('heavy');
    const newPrediction = {
      tournament: selectedTournament.name,
      mode: selectedMode.name,
      order: predictionOrder,
      status: 'В процессе',
      bank: Math.floor(Math.random() * 10000) + 5000, // Mock банка
    };
    setPredictions([...predictions, newPrediction]);
    setSelectedMode(null);
    navigate('/my-bets');
  };

  return (
    <div className="p-5 pb-24">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#00eaff]">Tier-1 Турниры CS2</h1>

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
                onClick={() => openModal(t, mode)}
                className="neon-btn bg-[#1e2a4a] hover:bg-[#00ff9d] hover:text-black border border-[#00ff9d] py-4 rounded-2xl text-sm font-bold transition-all"
              >
                {mode.name}<br />
                <span className="text-xs opacity-70">100 💎</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Модалка */}
      <AnimatePresence>
        {selectedMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#121a2e] rounded-3xl p-6 w-11/12 max-w-md"
            >
              <h2 className="text-xl font-bold mb-4 text-center">Расставь команды для {selectedMode.name}</h2>
              <p className="text-center mb-4 opacity-70">Перетаскивай команды на места</p>

              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="predictions">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                      {predictionOrder.map((team, index) => (
                        <Draggable key={team} draggableId={team} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-[#1e2a4a] p-4 rounded-xl flex items-center gap-2 glow-green"
                            >
                              <span className="font-bold text-[#00ff9d]">{index + 1} место:</span>
                              {team}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              <div className="flex gap-4 mt-6">
                <button onClick={() => setSelectedMode(null)} className="flex-1 py-3 bg-red-600 rounded-xl font-bold">Отмена</button>
                <button onClick={confirmPrediction} className="flex-1 py-3 bg-[#00ff9d] text-black rounded-xl font-bold">Подтвердить (100 💎)</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
