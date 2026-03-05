import { useState, useEffect } from 'react';

const tournamentsData = [ /* тот же массив 3 турниров с 12 командами */ ];

interface Bet {
  id: number;
  tournament: string;
  mode: string;
  prediction: string[];
  amount: number;
  date: string;
  prize?: number;
}

export function Admin() {
  const [bets, setBets] = useState<Bet[]>([]);
  const [selectedTournament, setSelectedTournament] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [realResult, setRealResult] = useState<string[]>([]);
  const [showResultModal, setShowResultModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('userBets');
    if (saved) setBets(JSON.parse(saved));
  }, []);

  const saveBets = (newBets: Bet[]) => {
    localStorage.setItem('userBets', JSON.stringify(newBets));
    setBets(newBets);
  };

  const getBank = (t: string, m: string) => {
    const banks = JSON.parse(localStorage.getItem('tournamentBanks') || '{}');
    return banks[`${t}-${m}`] || 1000;
  };

  const finishMode = (tournament: string, mode: string) => {
    setSelectedTournament(tournament);
    setSelectedMode(mode);
    setRealResult([]);
    setShowResultModal(true);
  };

  const saveRealResult = () => {
    const maxPlaces = parseInt(selectedMode.replace('Top-', ''));
    if (realResult.length !== maxPlaces) {
      alert('Заполни все места!');
      return;
    }

    const currentBets = bets.filter(b => b.tournament === selectedTournament && b.mode === selectedMode);
    const winners = currentBets.filter(bet => 
      bet.prediction.every((team, i) => team === realResult[i])
    );

    let bank = getBank(selectedTournament, selectedMode);
    let newBets = [...bets];

    if (winners.length > 0) {
      const prize = Math.floor(bank / winners.length);
      winners.forEach(winner => {
        const betIndex = newBets.findIndex(b => b.id === winner.id);
        newBets[betIndex].prize = prize;
      });
      alert(`✅ Победителей: ${winners.length}. Каждый получил по ${prize} cryst!`);
      bank = 0;
    } else {
      const carry = Math.floor(bank * 0.5);
      alert(`❌ Победителей нет. 50% банка (${carry} cryst) перенесено на следующий турнир того же режима.`);
      bank = carry;
    }

    // Сохраняем обновлённый банк
    const banks = JSON.parse(localStorage.getItem('tournamentBanks') || '{}');
    banks[`${selectedTournament}-${selectedMode}`] = bank;
    localStorage.setItem('tournamentBanks', JSON.stringify(banks));

    saveBets(newBets);
    setShowResultModal(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Админ-панель</h1>
      
      {tournamentsData.map((t, i) => (
        <div key={i} className="mb-8 bg-zinc-900 rounded-3xl p-5">
          <h2 className="text-xl font-bold mb-3">{t.name}</h2>
          {['Top-1', 'Top-3', 'Top-5'].map((mode) => {
            const bank = getBank(t.name, mode);
            return (
              <div key={mode} className="flex justify-between items-center bg-zinc-800 p-4 rounded-2xl mb-3">
                <div>
                  <div className="text-green-400 font-medium">{mode}</div>
                  <div className="text-sm text-zinc-400">Банк: {bank} cryst</div>
                </div>
                <button
                  onClick={() => finishMode(t.name, mode)}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-2xl text-sm font-medium"
                >
                  Завершить
                </button>
              </div>
            );
          })}
        </div>
      ))}

      {/* Модалка ввода результата */}
      {showResultModal && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="bg-[#171717] w-full max-w-md rounded-3xl p-6">
            <h3 className="text-xl font-bold mb-4">Реальный результат — {selectedMode}</h3>
            {Array.from({ length: parseInt(selectedMode.replace('Top-', '')) }).map((_, i) => (
              <select
                key={i}
                value={realResult[i] || ''}
                onChange={(e) => {
                  const newRes = [...realResult];
                  newRes[i] = e.target.value;
                  setRealResult(newRes);
                }}
                className="w-full bg-zinc-800 p-4 rounded-2xl mb-3 text-white"
              >
                <option value="">Место {i + 1} — выбери команду</option>
                {tournamentsData.find(t => t.name === selectedTournament)?.teams.map(team => (
                  <option key={team.name} value={team.name}>{team.name}</option>
                ))}
              </select>
            ))}
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowResultModal(false)} className="flex-1 py-4 bg-zinc-700 rounded-2xl">Отмена</button>
              <button onClick={saveRealResult} className="flex-1 py-4 bg-green-500 text-black rounded-2xl font-medium">Завершить и раздать призы</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
