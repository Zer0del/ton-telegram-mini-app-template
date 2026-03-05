import { useState, useEffect } from 'react';
import { useCrystals } from '../hooks/useCrystals';

const tournamentsData = [
  {
    name: "BLAST Open Rotterdam 2026",
    date: "18–29 марта",
    prize: "$1 100 000",
    status: "LIVE",
    color: "bg-red-500",
    teams: [
      { name: "Vitality", logo: "https://www.hltv.org/img/static/team/logo/5973.png" },
      { name: "Team Spirit", logo: "https://www.hltv.org/img/static/team/logo/7020.png" },
      { name: "NaVi", logo: "https://www.hltv.org/img/static/team/logo/6667.png" },
      { name: "G2 Esports", logo: "https://www.hltv.org/img/static/team/logo/5995.png" },
      { name: "Team Liquid", logo: "https://www.hltv.org/img/static/team/logo/5973.png" },
      { name: "FaZe Clan", logo: "https://www.hltv.org/img/static/team/logo/6667.png" },
      { name: "MOUZ", logo: "https://www.hltv.org/img/static/team/logo/5000.png" },
      { name: "Astralis", logo: "https://www.hltv.org/img/static/team/logo/6665.png" },
      { name: "BIG", logo: "https://www.hltv.org/img/static/team/logo/7532.png" },
      { name: "3DMAX", logo: "https://www.hltv.org/img/static/team/logo/7020.png" },
      { name: "Eternal Fire", logo: "https://www.hltv.org/img/static/team/logo/11251.png" },
      { name: "HEROIC", logo: "https://www.hltv.org/img/static/team/logo/7178.png" }
    ]
  },
  {
    name: "ESL Pro League Season 23 Finals",
    date: "13–15 марта",
    prize: "$275 000",
    status: "Скоро",
    color: "bg-yellow-500",
    teams: [
      { name: "Vitality", logo: "https://www.hltv.org/img/static/team/logo/5973.png" },
      { name: "Team Spirit", logo: "https://www.hltv.org/img/static/team/logo/7020.png" },
      { name: "NaVi", logo: "https://www.hltv.org/img/static/team/logo/6667.png" },
      { name: "G2 Esports", logo: "https://www.hltv.org/img/static/team/logo/5995.png" },
      { name: "Team Liquid", logo: "https://www.hltv.org/img/static/team/logo/5973.png" },
      { name: "FaZe Clan", logo: "https://www.hltv.org/img/static/team/logo/6667.png" },
      { name: "MOUZ", logo: "https://www.hltv.org/img/static/team/logo/5000.png" },
      { name: "Astralis", logo: "https://www.hltv.org/img/static/team/logo/6665.png" },
      { name: "BIG", logo: "https://www.hltv.org/img/static/team/logo/7532.png" },
      { name: "3DMAX", logo: "https://www.hltv.org/img/static/team/logo/7020.png" },
      { name: "Eternal Fire", logo: "https://www.hltv.org/img/static/team/logo/11251.png" },
      { name: "HEROIC", logo: "https://www.hltv.org/img/static/team/logo/7178.png" }
    ]
  },
  {
    name: "PGL Bucharest 2026",
    date: "3–11 апреля",
    prize: "$1 250 000",
    status: "Скоро",
    color: "bg-yellow-500",
    teams: [
      { name: "Vitality", logo: "https://www.hltv.org/img/static/team/logo/5973.png" },
      { name: "Team Spirit", logo: "https://www.hltv.org/img/static/team/logo/7020.png" },
      { name: "NaVi", logo: "https://www.hltv.org/img/static/team/logo/6667.png" },
      { name: "G2 Esports", logo: "https://www.hltv.org/img/static/team/logo/5995.png" },
      { name: "Team Liquid", logo: "https://www.hltv.org/img/static/team/logo/5973.png" },
      { name: "FaZe Clan", logo: "https://www.hltv.org/img/static/team/logo/6667.png" },
      { name: "MOUZ", logo: "https://www.hltv.org/img/static/team/logo/5000.png" },
      { name: "Astralis", logo: "https://www.hltv.org/img/static/team/logo/6665.png" },
      { name: "BIG", logo: "https://www.hltv.org/img/static/team/logo/7532.png" },
      { name: "3DMAX", logo: "https://www.hltv.org/img/static/team/logo/7020.png" },
      { name: "Eternal Fire", logo: "https://www.hltv.org/img/static/team/logo/11251.png" },
      { name: "HEROIC", logo: "https://www.hltv.org/img/static/team/logo/7178.png" }
    ]
  }
];

interface Bet {
  id: number;
  tournament: string;
  mode: string;
  prediction: string[];
  amount: number;
  date: string;
}

export function Tournaments() {
  const [showBetModal, setShowBetModal] = useState(false);
  const [currentTournament, setCurrentTournament] = useState('');
  const [currentMode, setCurrentMode] = useState('');
  const [prediction, setPrediction] = useState<string[]>([]);
  const [bets, setBets] = useState<Bet[]>([]);

  const { crystals, updateCrystals } = useCrystals(); // ← используем общий хук

  // Загрузка сохранённых ставок
  useEffect(() => {
    const saved = localStorage.getItem('userBets');
    if (saved) setBets(JSON.parse(saved));
  }, []);

  const saveBets = (newBets: Bet[]) => {
    localStorage.setItem('userBets', JSON.stringify(newBets));
    setBets(newBets);
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

  const removeTeam = (index: number) => {
    setPrediction(prediction.filter((_, i) => i !== index));
  };

  const hasBet = (tournament: string, mode: string) => {
    return bets.some(b => b.tournament === tournament && b.mode === mode);
  };

  const handleConfirmBet = () => {
    if (prediction.length !== parseInt(currentMode.replace('Top-', ''))) {
      alert('Выбери все места!');
      return;
    }

    // Проверка и списание баланса
    if (crystals < 100) {
      alert('Недостаточно кристаликов! Нужно минимум 100 cryst.');
      return;
    }

    const newBalance = crystals - 100;
    updateCrystals(newBalance); // ← баланс сразу обновится везде

    const newBet: Bet = {
      id: Date.now(),
      tournament: currentTournament,
      mode: currentMode,
      prediction: [...prediction],
      amount: 100,
      date: new Date().toLocaleDateString('ru-RU')
    };

    const newBets = [...bets, newBet];
    saveBets(newBets);

    alert(`✅ Ставка 100 кристаликов принята! Баланс: ${newBalance}`);
    setShowBetModal(false);
    setPrediction([]);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Турниры CS2</h1>

      {tournamentsData.map((t, i) => (
        <div key={i} className="mb-8 bg-zinc-900 rounded-3xl p-5">
          <h2 className="text-xl font-bold mb-3">{t.name}</h2>
          {['Top-1', 'Top-3', 'Top-5'].map((mode, idx) => {
            const alreadyBet = hasBet(t.name, mode);
            return (
              <button
                key={idx}
                onClick={() => !alreadyBet && openBetModal(t.name, mode)}
                disabled={alreadyBet}
                className={`w-full py-7 rounded-3xl mt-3 text-lg font-medium transition-all ${
                  alreadyBet 
                    ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed' 
                    : 'bg-zinc-800 hover:bg-zinc-700 active:scale-[0.97]'
                }`}
              >
                {mode} • Банк: 1000 {alreadyBet && '(ставка сделана)'}
              </button>
            );
          })}
        </div>
      ))}

      {showBetModal && currentTournamentData && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-end safe-area overflow-hidden">
          <div className="bg-[#171717] w-full max-h-[88vh] rounded-t-3xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-zinc-800 text-center">
              <h2 className="text-2xl font-bold">Составь свой {currentMode}</h2>
              <p className="text-zinc-400 mt-1">{currentTournament}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6 main-content pb-40">
              <h3 className="text-green-400 font-semibold text-lg">МОЙ ТОП {currentMode.replace('Top-', '')}</h3>
              <div className="space-y-3">
                {Array.from({ length: parseInt(currentMode.replace('Top-', '')) }).map((_, i) => (
                  <div key={i} className="bg-zinc-900 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <span className="text-green-400 font-bold">Место {i + 1}</span>
                      <div className="text-white text-lg mt-1">{prediction[i] || 'Выбери команду'}</div>
                    </div>
                    {prediction[i] && <button onClick={() => removeTeam(i)} className="text-red-400 text-3xl">X</button>}
                  </div>
                ))}
              </div>

              <h3 className="text-green-400 font-semibold text-lg mt-8">КОМАНДЫ ТУРНИРА</h3>
              <div className="grid grid-cols-1 gap-3">
                {currentTournamentData.teams
                  .filter(team => !prediction.includes(team.name))
                  .map((team, idx) => (
                    <button
                      key={idx}
                      onClick={() => addTeam(team.name)}
                      className="bg-zinc-800 hover:bg-zinc-700 p-4 rounded-2xl flex items-center gap-4 active:scale-95"
                    >
                      <img src={team.logo} alt="" className="w-10 h-10 rounded-full" />
                      <span className="text-white text-lg">{team.name}</span>
                    </button>
                  ))}
              </div>
            </div>

            <div className="p-4 border-t border-zinc-800 flex gap-3 bg-[#171717] pb-8">
              <button onClick={() => setShowBetModal(false)} className="flex-1 py-4 bg-red-500 rounded-2xl text-lg font-medium">Отмена</button>
              <button onClick={handleConfirmBet} className="flex-1 py-4 bg-green-500 rounded-2xl text-lg font-medium text-black">Подтвердить (100 cryst)</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
