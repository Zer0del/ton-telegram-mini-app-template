import { useEffect, useState } from 'react';

interface Bet {
  id: number;
  tournament: string;
  mode: string;
  prediction: string[]; 
  amount: number;
  date: string;
}

export function MyBets() {
  const [bets, setBets] = useState<Bet[]>([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('betsHistory') || '[]');
    setBets(history);
  }, []);

  return (
    <div className="p-4 pb-24">
      <h1 className="text-3xl font-black text-center mb-8">Мои ставки</h1>

      {bets.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          Пока нет ставок<br />
          Сделай первую на странице «Турниры»
        </div>
      )}

      <div className="space-y-6">
        {bets.map((bet) => (
          <div key={bet.id} className="bg-zinc-900 rounded-3xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-emerald-400 text-sm">{bet.date}</p>
                <p className="font-bold text-lg mt-1">{bet.tournament}</p>
              </div>
              <div className="text-right">
                <p className="text-red-400 font-medium">-{bet.amount} cryst</p>
                <p className="text-emerald-400 font-bold">{bet.mode}</p>
              </div>
            </div>

            {/* Полный предикт */}
            <div className="bg-zinc-800 rounded-2xl p-4">
              <p className="text-xs text-gray-400 mb-3">ТВОЙ ПРЕДИКТ</p>
              <div className="space-y-2">
                {bet.prediction.map((team, index) => (
                  <div key={index} className="flex items-center gap-3 bg-zinc-900 rounded-xl px-4 py-2.5">
                    <span className="text-emerald-400 font-black w-6">#{index + 1}</span>
                    <span className="font-medium text-white">{team}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
