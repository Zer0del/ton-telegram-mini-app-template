import { useState, useEffect } from 'react';

const tournamentsData = [
  {
    name: "BLAST Open Rotterdam 2026",
    date: "18–29 марта",
    prize: "$1 100 000",
    status: "LIVE",
    color: "bg-red-500",
    teams: [
      { name: "Vitality", logo: "https://liquipedia.net/commons/images/thumb/2/2f/Vitality_CS2_2024.png/300px-Vitality_CS2_2024.png" },
      { name: "Team Spirit", logo: "https://liquipedia.net/commons/images/thumb/0/0a/Team_Spirit_2024.png/300px-Team_Spirit_2024.png" },
      { name: "NaVi", logo: "https://liquipedia.net/commons/images/thumb/5/5a/Natus_Vincere_2024.png/300px-Natus_Vincere_2024.png" },
      { name: "G2 Esports", logo: "https://liquipedia.net/commons/images/thumb/3/3f/G2_Esports_2024.png/300px-G2_Esports_2024.png" },
      { name: "Team Liquid", logo: "https://liquipedia.net/commons/images/thumb/0/0f/Team_Liquid_2024.png/300px-Team_Liquid_2024.png" },
      { name: "FaZe Clan", logo: "https://liquipedia.net/commons/images/thumb/4/4f/FaZe_Clan_2024.png/300px-FaZe_Clan_2024.png" },
      { name: "MOUZ", logo: "https://liquipedia.net/commons/images/thumb/1/1f/MOUZ_2024.png/300px-MOUZ_2024.png" },
      { name: "Astralis", logo: "https://liquipedia.net/commons/images/thumb/8/8f/Astralis_2024.png/300px-Astralis_2024.png" },
      { name: "BIG", logo: "https://liquipedia.net/commons/images/thumb/7/7f/BIG_2024.png/300px-BIG_2024.png" },
      { name: "3DMAX", logo: "https://liquipedia.net/commons/images/thumb/5/5f/3DMAX_2024.png/300px-3DMAX_2024.png" },
      { name: "Eternal Fire", logo: "https://liquipedia.net/commons/images/thumb/9/9f/Eternal_Fire_2024.png/300px-Eternal_Fire_2024.png" },
      { name: "HEROIC", logo: "https://liquipedia.net/commons/images/thumb/2/2f/HEROIC_2024.png/300px-HEROIC_2024.png" }
    ]
  },
  {
    name: "ESL Pro League Season 23 Finals",
    date: "13–15 марта",
    prize: "$275 000",
    status: "Скоро",
    color: "bg-yellow-500",
    teams: [
      { name: "Vitality", logo: "https://liquipedia.net/commons/images/thumb/2/2f/Vitality_CS2_2024.png/300px-Vitality_CS2_2024.png" },
      { name: "Team Spirit", logo: "https://liquipedia.net/commons/images/thumb/0/0a/Team_Spirit_2024.png/300px-Team_Spirit_2024.png" },
      { name: "NaVi", logo: "https://liquipedia.net/commons/images/thumb/5/5a/Natus_Vincere_2024.png/300px-Natus_Vincere_2024.png" },
      { name: "G2 Esports", logo: "https://liquipedia.net/commons/images/thumb/3/3f/G2_Esports_2024.png/300px-G2_Esports_2024.png" },
      { name: "Team Liquid", logo: "https://liquipedia.net/commons/images/thumb/0/0f/Team_Liquid_2024.png/300px-Team_Liquid_2024.png" },
      { name: "FaZe Clan", logo: "https://liquipedia.net/commons/images/thumb/4/4f/FaZe_Clan_2024.png/300px-FaZe_Clan_2024.png" },
      { name: "MOUZ", logo: "https://liquipedia.net/commons/images/thumb/1/1f/MOUZ_2024.png/300px-MOUZ_2024.png" },
      { name: "Astralis", logo: "https://liquipedia.net/commons/images/thumb/8/8f/Astralis_2024.png/300px-Astralis_2024.png" },
      { name: "BIG", logo: "https://liquipedia.net/commons/images/thumb/7/7f/BIG_2024.png/300px-BIG_2024.png" },
      { name: "3DMAX", logo: "https://liquipedia.net/commons/images/thumb/5/5f/3DMAX_2024.png/300px-3DMAX_2024.png" },
      { name: "Eternal Fire", logo: "https://liquipedia.net/commons/images/thumb/9/9f/Eternal_Fire_2024.png/300px-Eternal_Fire_2024.png" },
      { name: "HEROIC", logo: "https://liquipedia.net/commons/images/thumb/2/2f/HEROIC_2024.png/300px-HEROIC_2024.png" }
    ]
  },
  {
    name: "PGL Bucharest 2026",
    date: "3–11 апреля",
    prize: "$1 250 000",
    status: "Скоро",
    color: "bg-yellow-500",
    teams: [
      { name: "Vitality", logo: "https://liquipedia.net/commons/images/thumb/2/2f/Vitality_CS2_2024.png/300px-Vitality_CS2_2024.png" },
      { name: "Team Spirit", logo: "https://liquipedia.net/commons/images/thumb/0/0a/Team_Spirit_2024.png/300px-Team_Spirit_2024.png" },
      { name: "NaVi", logo: "https://liquipedia.net/commons/images/thumb/5/5a/Natus_Vincere_2024.png/300px-Natus_Vincere_2024.png" },
      { name: "G2 Esports", logo: "https://liquipedia.net/commons/images/thumb/3/3f/G2_Esports_2024.png/300px-G2_Esports_2024.png" },
      { name: "Team Liquid", logo: "https://liquipedia.net/commons/images/thumb/0/0f/Team_Liquid_2024.png/300px-Team_Liquid_2024.png" },
      { name: "FaZe Clan", logo: "https://liquipedia.net/commons/images/thumb/4/4f/FaZe_Clan_2024.png/300px-FaZe_Clan_2024.png" },
      { name: "MOUZ", logo: "https://liquipedia.net/commons/images/thumb/1/1f/MOUZ_2024.png/300px-MOUZ_2024.png" },
      { name: "Astralis", logo: "https://liquipedia.net/commons/images/thumb/8/8f/Astralis_2024.png/300px-Astralis_2024.png" },
      { name: "BIG", logo: "https://liquipedia.net/commons/images/thumb/7/7f/BIG_2024.png/300px-BIG_2024.png" },
      { name: "3DMAX", logo: "https://liquipedia.net/commons/images/thumb/5/5f/3DMAX_2024.png/300px-3DMAX_2024.png" },
      { name: "Eternal Fire", logo: "https://liquipedia.net/commons/images/thumb/9/9f/Eternal_Fire_2024.png/300px-Eternal_Fire_2024.png" },
      { name: "HEROIC", logo: "https://liquipedia.net/commons/images/thumb/2/2f/HEROIC_2024.png/300px-HEROIC_2024.png" }
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

      {/* Модалка предикта с логотипами */}
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
                  .filter(team => !prediction.includes(team.name))
                  .map(team => (
                    <button 
                      key={team.name} 
                      onClick={() => addTeam(team.name)}
                      className="bg-zinc-800 hover:bg-zinc-700 p-3 rounded-2xl flex items-center gap-3 transition-colors"
                    >
                      <img src={team.logo} alt={team.name} className="w-8 h-8 object-contain rounded" />
                      <span className="font-medium text-sm">{team.name}</span>
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
