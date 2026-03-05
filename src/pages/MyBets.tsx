import { useState, useEffect } from 'react';

interface Bet {
  id: number;
  tournament: string;
  mode: string;
  prediction: string[];
  amount: number;
  date: string;
  prize?: number; // ← для показа выигрыша
}

export function MyBets() {
  const [bets, setBets] = useState<Bet[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('userBets');
    if (saved) setBets(JSON.parse(saved));
  }, []);

  const resetAllBets = () => {
    if (!confirm('Ты уверен? Все ставки будут удалены безвозвратно.')) return;
    localStorage.removeItem('userBets');
    setBets([]);
    alert('Все ставки сброшены!');
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Мои ставки</h1>
        {bets.length > 0 && (
          <button
            onClick={resetAllBets}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-2xl text-sm font-medium transition-all"
          >
            Сбросить все ставки
          </button>
        )}
      </div>

      {bets.length === 0 && (
        <div className="text-center py-20 text-zinc-400">
          Пока нет ставок<br />Сделай первую на странице «Турниры»
        </div>
      )}

      <div className="space-y-6">
        {bets.map((bet) => (
          <div key={bet.id} className="bg-zinc-900 rounded-3xl p-5">
            <div className="flex justify-between text-sm text-zinc-400 mb-2">
              <span>{bet.date}</span>
              <span className="text-green-400">- {bet.amount} cryst</span>
            </div>
            <h3 className="text-white text-xl font-medium">{bet.tournament}</h3>
            <p className="text-green-400 mt-1">{bet.mode}</p>

            <div className="mt-4">
              <div className="text-xs text-zinc-500 mb-2">ТВОЙ ПРЕДИКТ</div>
              <div className="space-y-2">
                {bet.prediction.map((team, index) => (
                  <div key={index} className="bg-zinc-800 rounded-2xl p-3 flex items-center gap-3">
                    <span className="text-green-400 font-bold w-6">#{index + 1}</span>
                    <span className="text-white">{team}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ← ЭТА СТРОКА УЖЕ ВСТАВЛЕНА */}
            {bet.prize && (
              <div className="text-green-400 text-xl font-bold mt-4 border-t border-zinc-700 pt-4 flex items-center justify-center gap-2">
                🎉 + {bet.prize} cryst (выигрыш!)
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
