import { useState } from 'react';

const tournamentsData = [
  {
    name: "BLAST Open Rotterdam 2026",
    date: "18–29 марта",
    prize: "$1 100 000",
    status: "LIVE",
    color: "bg-red-500",
    teams: [
      { name: "Vitality", logo: "https://img-cdn.hltv.org/teamlogo/yeXBldn9w8LZCgdElAenPs.png?ixlib=java-2.1.0&w=50&s=15eaba0b75250065d20162d2cb05e3e6" },
      { name: "Team Spirit", logo: "https://img-cdn.hltv.org/teamlogo/ywdn4tmAvXfllLeV2SkkvF.png?ixlib=java-2.1.0&w=50&s=9c70c7fbb048348f70f686acd2369c58" },
      { name: "NaVi", logo: "https://img-cdn.hltv.org/teamlogo/9iMirAi7ArBLNU8p3kqUTZ.svg?ixlib=java-2.1.0&s=4dd8635be16122656093ae9884675d0c" },
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
    teams: [] // можешь заполнить позже
  },
  {
    name: "PGL Bucharest 2026",
    date: "3–11 апреля",
    prize: "$1 250 000",
    status: "Скоро",
    color: "bg-yellow-500",
    teams: [] // можешь заполнить позже
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

  const openBetModal = (tournament: string, mode: string) => {
    setCurrentTournament(tournament);
    setCurrentMode(mode);
    setPrediction([]);
    setShowBetModal(true);
  };

  const getPoolAmount = () => 1000;

  const currentTournamentData = tournamentsData.find(t => t.name === currentTournament);

  const addTeam = (teamName: string) => {
    if (prediction.length < parseInt(currentMode.replace('Top-', ''))) {
      setPrediction([...prediction, teamName]);
    }
  };

  const removeTeam = (index: number) => {
    setPrediction(prediction.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Турниры CS2</h1>
        {tournamentsData.map((t, i) => (
          <div key={i} className="mb-6">
            <div className={`p-4 rounded-2xl ${t.color} text-white mb-2`}>
              <h2 className="text-xl font-semibold">{t.name}</h2>
            </div>
            <div className="bg-zinc-900 p-4 rounded-2xl">
              <p className="text-gray-300">{t.date} • {t.prize}</p>
              <p className="text-sm text-gray-400 mt-1">{t.status}</p>
              {['Top-1', 'Top-3', 'Top-5'].map((mode, idx) => (
                <button
                  key={idx}
                  onClick={() => openBetModal(t.name, mode)}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 py-7 rounded-3xl transition-all active:scale-[0.97] mt-3"
                >
                  {mode} • Банк: {getPoolAmount()}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* ИСПРАВЛЕННАЯ МОДАЛКА — кнопки больше НЕ обрезаются */}
        {showBetModal && currentTournamentData && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-end safe-area overflow-hidden">
            <div className="bg-[#171717] w-full max-h-[88vh] rounded-t-3xl overflow-hidden flex flex-col">
              
              {/* Заголовок */}
              <div className="p-5 border-b border-zinc-800 text-center">
                <h2 className="text-2xl font-bold text-white">Составь свой {currentMode}</h2>
                <p className="text-zinc-400 mt-1">{currentTournament}</p>
              </div>

              {/* Скролл с большим запасом снизу */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6 main-content pb-40">
                <h3 className="text-green-400 font-semibold text-lg">МОЙ ТОП {currentMode.replace('Top-', '')}</h3>
                <div className="space-y-3">
                  {Array.from({ length: parseInt(currentMode.replace('Top-', '')) }).map((_, i) => (
                    <div key={i} className="bg-zinc-900 rounded-2xl p-4 flex items-center justify-between">
                      <div>
                        <span className="text-green-400 font-bold">Место {i + 1}</span>
                        <div className="text-white text-lg mt-1">
                          {prediction[i] || 'Выбери команду'}
                        </div>
                      </div>
                      {prediction[i] && (
                        <button onClick={() => removeTeam(i)} className="text-red-400 text-3xl">✕</button>
                      )}
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
                        className="bg-zinc-800 hover:bg-zinc-700 p-4 rounded-2xl flex items-center gap-4 transition-all active:scale-95"
                      >
                        <img src={team.logo} alt="" className="w-10 h-10 rounded-full" />
                        <span className="text-white text-lg">{team.name}</span>
                      </button>
                    ))}
                </div>
              </div>

              {/* Кнопки снизу — теперь с запасом под навигацию */}
              <div className="p-4 border-t border-zinc-800 flex gap-3 bg-[#171717] pb-8">
                <button 
                  onClick={() => setShowBetModal(false)} 
                  className="flex-1 py-4 bg-red-500 rounded-2xl text-lg font-medium"
                >
                  Отмена
                </button>
                <button 
                  onClick={() => { /* сюда позже добавим сохранение ставки */ alert('Ставка 100 кристаликов принята!'); setShowBetModal(false); }}
                  className="flex-1 py-4 bg-green-500 rounded-2xl text-lg font-medium text-black"
                >
                  Подтвердить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
