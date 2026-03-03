import { useState, useEffect } from 'react';

const tournamentsData = [
  {
    name: "BLAST Open Rotterdam 2026",
    date: "18–29 марта",
    prize: "$1 100 000",
    status: "LIVE",
    color: "bg-red-500",
    teams: ["Vitality", "Team Spirit", "NaVi", "G2 Esports", "Team Liquid", "FaZe Clan", "MOUZ", "Astralis", "BIG", "3DMAX", "Eternal Fire", "HEROIC"]
  },
  {
    name: "ESL Pro League Season 23 Finals",
    date: "13–15 марта",
    prize: "$275 000",
    status: "Скоро",
    color: "bg-yellow-500",
    teams: ["Vitality", "Team Spirit", "NaVi", "G2 Esports", "Team Liquid", "FaZe Clan", "MOUZ", "Astralis", "BIG", "3DMAX", "Eternal Fire", "HEROIC"]
  },
  {
    name: "PGL Bucharest 2026",
    date: "3–11 апреля",
    prize: "$1 250 000",
    status: "Скоро",
    color: "bg-yellow-500",
    teams: ["Vitality", "Team Spirit", "NaVi", "G2 Esports", "Team Liquid", "FaZe Clan", "MOUZ", "Astralis", "BIG", "3DMAX", "Eternal Fire", "HEROIC"]
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
  const [pools, setPools] = useState<Record<string, number>>({});

  useEffect(() => {
    const savedPools = JSON.parse(localStorage.getItem('pools') || '{}');
    setPools(savedPools);
  }, []);

  const getPoolKey = (tournament: string, mode: string) => `${tournament}|${mode}`;

  const getPoolAmount = (tournament: string, mode: string) => {
    return pools[getPoolKey(tournament, mode)] || 0;
  };

  const openBetModal = (tournamentName: string, mode: string) => {
    const amount = 100;
    const currentCrystals = parseInt(localStorage.getItem('crystals') || '1000');
    if (currentCrystals < amount) {
      alert('❌ Недостаточно кристалликов!');
      return;
    }

    const history: Bet[] = JSON.parse(localStorage.getItem('betsHistory') || '[]');
    const already = history.some(b => b.tournament === tournamentName && b.mode === mode);
    if (already) {
      alert(`❌ Вы уже поставили на ${mode} в этом турнире`);
      return;
    }

    setCurrentTournament(tournamentName);
    setCurrentMode(mode);
    setPrediction([]);
    setShowBetModal(true);
  };

  const addTeam = (team: string) => {
    const maxSlots = parseInt(currentMode.replace('Top-', ''));
    if (prediction.length >= maxSlots || prediction.includes(team)) return;
    setPrediction([...prediction, team]);
  };

  const removeTeam = (index: number) => {
    const newPred = [...prediction];
    newPred.splice(index, 1);
    setPrediction(newPred);
  };

  const confirmBet = () => {
    const needed = parseInt(currentMode.replace('Top-', ''));
    if (prediction.length !== needed) {
      alert(`Нужно ровно ${needed} команд!`);
      return;
    }

    const amount = 100;
    let current = parseInt(localStorage.getItem('crystals') || '1000');
    current -= amount;
    localStorage.setItem('crystals', current.toString());

    const poolKey = getPoolKey(currentTournament, currentMode);
    const newPools = { ...pools };
    newPools[poolKey] = (newPools[poolKey] || 0) + amount;
    localStorage.setItem('pools', JSON.stringify(newPools));
    setPools(newPools);

    const history: Bet[] = JSON.parse(localStorage.getItem('betsHistory') || '[]');
    const newBet: Bet = {
      id: Date.now(),
      tournament: currentTournament,
      mode: currentMode,
      prediction: [...prediction],
      amount,
      date: new Date().toLocaleString('ru-RU')
    };
    history.unshift(newBet);
    localStorage.setItem('betsHistory', JSON.stringify(history));

    alert(`✅ Ставка размещена!\n\n${currentMode} — ${prediction.join(' → ')}\nТурнир: ${currentTournament}`);
    setShowBetModal(false);
  };

  const currentTournamentData = tournamentsData.find(t => t.name === currentTournament);

  return (
    <div className="p-4 pb-24 space-y-6">
      <h1 className="text-3xl font-black tracking-tight text-center">Турниры CS2</h1>

      {tournamentsData.map((t, i) => (
        <div key={i} className="bg-zinc-900 rounded-3xl p-6">
          <div className="flex justify-between items-start mb-5">
            <div>
              <p className="font-semibold text-xl tracking-tight">{t.name}</p>
              <p className="text-emerald-400 text-sm">{t.date} • {t.prize}</p>
            </div>
            <span className={`${t.color} px-3 py-1 rounded-full text-xs font-semibold`}>{t.status}</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {['Top-1', 'Top-3', 'Top-5'].map((mode, idx) => {
              const bank = getPoolAmount(t.name, mode);
              return (
                <div key={idx} className="relative">
                  <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium shadow">
                    Банк: {bank}
                  </div>
                  <button 
                    onClick={() => openBetModal(t.name, mode)}
                    className="w-full bg-zinc-800 hover:bg-zinc-700 py-7 rounded-3xl transition-all active:scale-[0.97]"
                  >
                    <span className="text-2xl font-semibold tracking-[-0.03em] text-white block">{mode}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Модалка предикта (без изменений) */}
      {showBetModal && currentTournamentData && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-zinc-900 rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold tracking-tighter text-center mb-2">Составь свой {currentMode}</h2>
            <p className="text-center text-emerald-400 mb-6">{currentTournament}</p>

            <div className="mb-8">
              <p className="uppercase text-xs text-gray-400 mb-3 tracking-widest">МОЙ ТОП {currentMode.replace('Top-', '')}</p>
              <div className="space-y-2">
                {Array.from({ length: parseInt(currentMode.replace('Top-', '')) }).map((_, i) => (
                  <div key={i} className="bg-zinc-800 rounded-2xl px-4 py-3.5 flex items-center justify-between">
                    <span className="text-emerald-400 font-semibold w-6">#{i + 1}</span>
                    <span className="flex-1 text-center font-medium text-lg">{prediction[i] || '— выбери команду'}</span>
                    {prediction[i] && <button onClick={() => removeTeam(i)} className="text-red-400 text-2xl">✕</button>}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="uppercase text-xs text-gray-400 mb-3 tracking-widest">КОМАНДЫ ТУРНИРА</p>
              <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                {currentTournamentData.teams
                  .filter(team => !prediction.includes(team))
                  .map(team => (
                    <button key={team} onClick={() => addTeam(team)} className="bg-zinc-800 hover:bg-zinc-700 py-3.5 rounded-2xl text-sm font-medium transition-colors">
                      {team}
                    </button>
                  ))}
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button onClick={() => setShowBetModal(false)} className="flex-1 py-4 bg-zinc-800 rounded-2xl text-lg font-medium">Отмена</button>
              <button 
                onClick={confirmBet}
                disabled={prediction.length !== parseInt(currentMode.replace('Top-', ''))}
                className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-700 rounded-2xl text-lg font-semibold transition-colors"
              >
                Подтвердить ставку
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
