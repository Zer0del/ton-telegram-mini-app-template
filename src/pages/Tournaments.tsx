import { useState } from 'react';

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
  prediction: string[]; // например ["Vitality", "NaVi", "G2 Esports"]
  amount: number;
  date: string;
}

export function Tournaments() {
  const [showBetModal, setShowBetModal] = useState(false);
  const [currentTournament, setCurrentTournament] = useState('');
  const [currentMode, setCurrentMode] = useState('');
  const [currentAmount, setCurrentAmount] = useState(0);
  const [prediction, setPrediction] = useState<string[]>([]);

  const openBetModal = (tournamentName: string, mode: string, amount: number) => {
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
    setCurrentAmount(amount);
    setPrediction([]);
    setShowBetModal(true);
  };

  const addTeam = (team: string) => {
    const maxSlots = parseInt(currentMode.replace('Top-', ''));
    if (prediction.length >= maxSlots) return;
    if (prediction.includes(team)) return;
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

    let current = parseInt(localStorage.getItem('crystals') || '1000');
    current -= currentAmount;
    localStorage.setItem('crystals', current.toString());

    const history: Bet[] = JSON.parse(localStorage.getItem('betsHistory') || '[]');
    const newBet: Bet = {
      id: Date.now(),
      tournament: currentTournament,
      mode: currentMode,
      prediction: [...prediction],
      amount: currentAmount,
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
      <h1 className="text-3xl font-black text-center">Турниры CS2</h1>

      {tournamentsData.map((t, i) => (
        <div key={i} className="bg-zinc-900 rounded-3xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold text-xl">{t.name}</p>
              <p className="text-emerald-400 text-sm">{t.date} • {t.prize}</p>
            </div>
            <span className={`${t.color} px-3 py-1 rounded-full text-xs font-bold`}>{t.status}</span>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <button onClick={() => openBetModal(t.name, 'Top-1', 50)} className="bg-zinc-800 hover:bg-zinc-700 py-4 rounded-2xl text-sm">Top-1<br/>50 cryst</button>
            <button onClick={() => openBetModal(t.name, 'Top-3', 100)} className="bg-zinc-800 hover:bg-zinc-700 py-4 rounded-2xl text-sm">Top-3<br/>100 cryst</button>
            <button onClick={() => openBetModal(t.name, 'Top-5', 200)} className="bg-zinc-800 hover:bg-zinc-700 py-4 rounded-2xl text-sm">Top-5<br/>200 cryst</button>
          </div>
        </div>
      ))}

      {/* Модалка предикта */}
      {showBetModal && currentTournamentData && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-zinc-900 rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black text-center mb-2">Составь свой {currentMode}</h2>
            <p className="text-center text-emerald-400 mb-6">{currentTournament}</p>

            {/* Мой топ */}
            <div className="mb-8">
              <p className="uppercase text-xs text-gray-400 mb-3">Мой топ {currentMode.replace('Top-', '')}</p>
              <div className="space-y-2">
                {Array.from({ length: parseInt(currentMode.replace('Top-', '')) }).map((_, i) => (
                  <div key={i} className="bg-zinc-800 rounded-2xl px-4 py-3 flex items-center justify-between">
                    <span className="text-emerald-400 font-bold">#{i + 1}</span>
                    <span className="flex-1 text-center font-medium">{prediction[i] || '— выбери команду'}</span>
                    {prediction[i] && (
                      <button onClick={() => removeTeam(i)} className="text-red-400 text-xl">✕</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Пул команд */}
            <div>
              <p className="uppercase text-xs text-gray-400 mb-3">Все команды турнира</p>
              <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                {currentTournamentData.teams
                  .filter(team => !prediction.includes(team))
                  .map(team => (
                    <button
                      key={team}
                      onClick={() => addTeam(team)}
                      className="bg-zinc-800 hover:bg-zinc-700 py-3 rounded-2xl text-sm transition-colors"
                    >
                      {team}
                    </button>
                  ))}
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button onClick={() => setShowBetModal(false)} className="flex-1 py-4 bg-zinc-800 rounded-2xl text-lg">Отмена</button>
              <button 
                onClick={confirmBet}
                disabled={prediction.length !== parseInt(currentMode.replace('Top-', ''))}
                className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-700 rounded-2xl text-lg font-bold transition-colors"
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
