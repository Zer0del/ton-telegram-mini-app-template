import { useState, useEffect } from 'react';

const tournamentsData = [
  { name: "BLAST Open Rotterdam 2026", date: "18–29 марта", prize: "$1 100 000", status: "LIVE", color: "bg-red-500", teams: [{ name: "Vitality", logo: "https://www.hltv.org/img/static/team/logo/5973.png" }, { name: "Team Spirit", logo: "https://www.hltv.org/img/static/team/logo/7020.png" }, { name: "NaVi", logo: "https://www.hltv.org/img/static/team/logo/6667.png" }, { name: "G2 Esports", logo: "https://www.hltv.org/img/static/team/logo/5995.png" }, { name: "Team Liquid", logo: "https://www.hltv.org/img/static/team/logo/5973.png" }, { name: "FaZe Clan", logo: "https://www.hltv.org/img/static/team/logo/6667.png" }, { name: "MOUZ", logo: "https://www.hltv.org/img/static/team/logo/5000.png" }, { name: "Astralis", logo: "https://www.hltv.org/img/static/team/logo/6665.png" }, { name: "BIG", logo: "https://www.hltv.org/img/static/team/logo/7532.png" }, { name: "3DMAX", logo: "https://www.hltv.org/img/static/team/logo/7020.png" }, { name: "Eternal Fire", logo: "https://www.hltv.org/img/static/team/logo/11251.png" }, { name: "HEROIC", logo: "https://www.hltv.org/img/static/team/logo/7178.png" }] },
  { name: "ESL Pro League Season 23 Finals", date: "13–15 марта", prize: "$275 000", status: "Скоро", color: "bg-yellow-500", teams: [{ name: "Vitality", logo: "https://www.hltv.org/img/static/team/logo/5973.png" }, /* все 12 команд */ ] },
  { name: "PGL Bucharest 2026", date: "3–11 апреля", prize: "$1 250 000", status: "Скоро", color: "bg-yellow-500", teams: [{ name: "Vitality", logo: "https://www.hltv.org/img/static/team/logo/5973.png" }, /* все 12 команд */ ] }
];

interface Bet { id: number; tournament: string; mode: string; prediction: string[]; amount: number; date: string; prize?: number; }

export function Tournaments() {
  const [showBetModal, setShowBetModal] = useState(false);
  const [currentTournament, setCurrentTournament] = useState('');
  const [currentMode, setCurrentMode] = useState('');
  const [prediction, setPrediction] = useState<string[]>([]);
  const [bets, setBets] = useState<Bet[]>([]);

  useEffect(() => { const saved = localStorage.getItem('userBets'); if (saved) setBets(JSON.parse(saved)); }, []);

  const saveBets = (newBets: Bet[]) => { localStorage.setItem('userBets', JSON.stringify(newBets)); setBets(newBets); };

  const openBetModal = (t: string, m: string) => { setCurrentTournament(t); setCurrentMode(m); setPrediction([]); setShowBetModal(true); };

  const currentTournamentData = tournamentsData.find(t => t.name === currentTournament);

  const addTeam = (team: string) => { const max = parseInt(currentMode.replace('Top-', '')); if (prediction.length < max) setPrediction([...prediction, team]); };
  const removeTeam = (i: number) => setPrediction(prediction.filter((_, idx) => idx !== i));
  const hasBet = (t: string, m: string) => bets.some(b => b.tournament === t && b.mode === m);

  const handleConfirmBet = () => {
    if (prediction.length !== parseInt(currentMode.replace('Top-', ''))) return alert('Выбери все места!');
    const newBet: Bet = { id: Date.now(), tournament: currentTournament, mode: currentMode, prediction: [...prediction], amount: 100, date: new Date().toLocaleDateString('ru-RU') };
    saveBets([...bets, newBet]);
    alert('Ставка 100 cryst принята!');
    setShowBetModal(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Турниры CS2</h1>
      {tournamentsData.map((t, i) => (
        <div key={i} className="mb-8 bg-zinc-900 rounded-3xl p-5">
          <h2 className="text-xl font-bold mb-3">{t.name}</h2>
          {['Top-1', 'Top-3', 'Top-5'].map((mode) => {
            const already = hasBet(t.name, mode);
            return (
              <button key={mode} onClick={() => !already && openBetModal(t.name, mode)} disabled={already}
                className={`w-full py-6 rounded-3xl mt-3 text-lg font-medium ${already ? 'bg-zinc-700 text-zinc-500' : 'bg-zinc-800 hover:bg-zinc-700'}`}>
                {mode} • Банк: 1000 {already && '(уже сделано)'}
              </button>
            );
          })}
        </div>
      ))}

      {/* модалка — та же, что раньше */}
      {showBetModal && currentTournamentData && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-end safe-area overflow-hidden">
          <div className="bg-[#171717] w-full max-h-[88vh] rounded-t-3xl overflow-hidden flex flex-col">
            <div className="p-5 border-b text-center">
              <h2 className="text-2xl font-bold">Составь свой {currentMode}</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-6 main-content pb-40">
              {/* твой выбор мест и команды — как раньше */}
            </div>
            <div className="p-4 border-t flex gap-3 pb-8">
              <button onClick={() => setShowBetModal(false)} className="flex-1 py-4 bg-red-500 rounded-2xl">Отмена</button>
              <button onClick={handleConfirmBet} className="flex-1 py-4 bg-green-500 text-black rounded-2xl">Подтвердить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
