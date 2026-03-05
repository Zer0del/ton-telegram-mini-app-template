import { useState, useEffect } from 'react';

const tournamentsData = [
  { name: "BLAST Open Rotterdam 2026", date: "18–29 марта", prize: "$1 100 000", status: "LIVE", color: "bg-red-500",
    teams: [{ name: "Vitality", logo: "https://www.hltv.org/img/static/team/logo/5973.png" }, { name: "Team Spirit", logo: "https://www.hltv.org/img/static/team/logo/7020.png" }, { name: "NaVi", logo: "https://www.hltv.org/img/static/team/logo/6667.png" }, { name: "G2 Esports", logo: "https://www.hltv.org/img/static/team/logo/5995.png" }, { name: "Team Liquid", logo: "https://www.hltv.org/img/static/team/logo/5973.png" }, { name: "FaZe Clan", logo: "https://www.hltv.org/img/static/team/logo/6667.png" }, { name: "MOUZ", logo: "https://www.hltv.org/img/static/team/logo/5000.png" }, { name: "Astralis", logo: "https://www.hltv.org/img/static/team/logo/6665.png" }, { name: "BIG", logo: "https://www.hltv.org/img/static/team/logo/7532.png" }, { name: "3DMAX", logo: "https://www.hltv.org/img/static/team/logo/7020.png" }, { name: "Eternal Fire", logo: "https://www.hltv.org/img/static/team/logo/11251.png" }, { name: "HEROIC", logo: "https://www.hltv.org/img/static/team/logo/7178.png" }] },
  { name: "ESL Pro League Season 23 Finals", date: "13–15 марта", prize: "$275 000", status: "Скоро", color: "bg-yellow-500", teams: [/* те же 12 команд */] },
  { name: "PGL Bucharest 2026", date: "3–11 апреля", prize: "$1 250 000", status: "Скоро", color: "bg-yellow-500", teams: [/* те же 12 команд */] }
];

interface Bet { id: number; tournament: string; mode: string; prediction: string[]; amount: number; date: string; }

export function Tournaments() {
  const [showBetModal, setShowBetModal] = useState(false);
  const [currentTournament, setCurrentTournament] = useState('');
  const [currentMode, setCurrentMode] = useState('');
  const [prediction, setPrediction] = useState<string[]>([]);

  const openBetModal = (t: string, m: string) => {
    setCurrentTournament(t);
    setCurrentMode(m);
    setPrediction([]);
    setShowBetModal(true);
  };

  const currentTournamentData = tournamentsData.find(t => t.name === currentTournament);

  const addTeam = (team: string) => {
    const max = parseInt(currentMode.replace('Top-', ''));
    if (prediction.length < max && !prediction.includes(team)) setPrediction([...prediction, team]);
  };

  const removeTeam = (i: number) => setPrediction(prediction.filter((_, idx) => idx !== i));

  const handleConfirmBet = () => {
    if (prediction.length !== parseInt(currentMode.replace('Top-', ''))) return alert('Выбери все места!');
    alert(`Ставка 100 кристаликов принята на ${currentMode}!`);
    setShowBetModal(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Турниры CS2</h1>
      {tournamentsData.map((t, i) => (
        <div key={i} className="mb-8 bg-zinc-900 rounded-3xl p-5">
          <h2 className="text-xl font-bold">{t.name}</h2>
          {['Top-1', 'Top-3', 'Top-5'].map(mode => (
            <button key={mode} onClick={() => openBetModal(t.name, mode)}
              className="w-full bg-zinc-800 hover:bg-zinc-700 py-7 rounded-3xl mt-3 text-lg font-medium">
              {mode} • Банк: 1000
            </button>
          ))}
        </div>
      ))}

      {/* ПОЛНАЯ МОДАЛКА — теперь точно открывается */}
      {showBetModal && currentTournamentData && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-end safe-area overflow-hidden">
          <div className="bg-[#171717] w-full max-h-[88vh] rounded-t-3xl overflow-hidden flex flex-col">
            <div className="p-5 border-b text-center">
              <h2 className="text-2xl font-bold text-white">Составь свой {currentMode}</h2>
              <p className="text-zinc-400">{currentTournament}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6 main-content pb-40">
              <h3 className="text-green-400 font-semibold text-lg">МОЙ ТОП {currentMode.replace('Top-', '')}</h3>
              <div className="space-y-3">
                {Array.from({ length: parseInt(currentMode.replace('Top-', '')) }).map((_, i) => (
                  <div key={i} className="bg-zinc-900 rounded-2xl p-4 flex justify-between items-center">
                    <div>
                      <span className="text-green-400 font-bold">Место {i+1}</span>
                      <div className="text-white text-lg mt-1">{prediction[i] || 'Выбери команду'}</div>
                    </div>
                    {prediction[i] && <button onClick={() => removeTeam(i)} className="text-red-400 text-3xl">✕</button>}
                  </div>
                ))}
              </div>

              <h3 className="text-green-400 font-semibold text-lg mt-8">КОМАНДЫ ТУРНИРА</h3>
              <div className="grid grid-cols-1 gap-3">
                {currentTournamentData.teams
                  .filter(team => !prediction.includes(team.name))
                  .map((team, idx) => (
                    <button key={idx} onClick={() => addTeam(team.name)}
                      className="bg-zinc-800 hover:bg-zinc-700 p-4 rounded-2xl flex items-center gap-4 active:scale-95">
                      <img src={team.logo} className="w-10 h-10 rounded-full" />
                      <span className="text-white text-lg">{team.name}</span>
                    </button>
                  ))}
              </div>
            </div>

            <div className="p-4 border-t flex gap-3 bg-[#171717] pb-8">
              <button onClick={() => setShowBetModal(false)} className="flex-1 py-4 bg-red-500 rounded-2xl text-lg">Отмена</button>
              <button onClick={handleConfirmBet} className="flex-1 py-4 bg-green-500 text-black rounded-2xl text-lg">Подтвердить (100 cryst)</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
