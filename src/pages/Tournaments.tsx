import { useState, useEffect } from 'react';

const tournamentsData = [ /* тот же массив с 3 турнирами и 12 командами — оставил как в предыдущей версии */ ];

interface Bet {
  id: number;
  tournament: string;
  mode: string;
  prediction: string[];
  amount: number;
  date: string;
  prize?: number; // добавлено для выигрышей
}

export function Tournaments() {
  const [showBetModal, setShowBetModal] = useState(false);
  const [currentTournament, setCurrentTournament] = useState('');
  const [currentMode, setCurrentMode] = useState('');
  const [prediction, setPrediction] = useState<string[]>([]);
  const [bets, setBets] = useState<Bet[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('userBets');
    if (saved) setBets(JSON.parse(saved));
  }, []);

  const saveBets = (newBets: Bet[]) => {
    localStorage.setItem('userBets', JSON.stringify(newBets));
    setBets(newBets);
  };

  // Получить/обновить банк режима
  const getBank = (tournament: string, mode: string) => {
    const banks = JSON.parse(localStorage.getItem('tournamentBanks') || '{}');
    return banks[`${tournament}-${mode}`] || 1000;
  };

  const addToBank = (tournament: string, mode: string, amount: number) => {
    const banks = JSON.parse(localStorage.getItem('tournamentBanks') || '{}');
    const key = `${tournament}-${mode}`;
    banks[key] = (banks[key] || 1000) + amount;
    localStorage.setItem('tournamentBanks', JSON.stringify(banks));
  };

  const openBetModal = (tournament: string, mode: string) => {
    setCurrentTournament(tournament);
    setCurrentMode(mode);
    setPrediction([]);
    setShowBetModal(true);
  };

  const currentTournamentData = tournamentsData.find(t => t.name === currentTournament);

  const addTeam = (teamName: string) => {
    const max = parseInt(currentMode.replace('Top-', ''));
    if (prediction.length < max && !prediction.includes(teamName)) {
      setPrediction([...prediction, teamName]);
    }
  };

  const removeTeam = (index: number) => setPrediction(prediction.filter((_, i) => i !== index));

  const hasBet = (tournament: string, mode: string) => bets.some(b => b.tournament === tournament && b.mode === mode);

  const handleConfirmBet = () => {
    if (prediction.length !== parseInt(currentMode.replace('Top-', ''))) {
      alert('Выбери все места!');
      return;
    }
    const newBet: Bet = { id: Date.now(), tournament: currentTournament, mode: currentMode, prediction: [...prediction], amount: 100, date: new Date().toLocaleDateString('ru-RU') };
    const newBets = [...bets, newBet];
    saveBets(newBets);
    addToBank(currentTournament, currentMode, 100); // добавляем в банк
    alert(`Ставка 100 кристаликов принята! Банк увеличен`);
    setShowBetModal(false);
    setPrediction([]);
  };

  return (
    <> {/* весь остальной код модалки и турниров — точно как в предыдущей версии, только в кнопке банка теперь динамический */}
      {/* ... (кнопки режимов с getBank(t.name, mode)) ... */}
      {/* модалка без изменений */}
    </>
  );
}
