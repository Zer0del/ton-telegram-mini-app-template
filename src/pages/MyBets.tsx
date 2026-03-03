import { useEffect, useState } from 'react';

interface Bet {
  id: number;
  tournament: string;
  mode: string;
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
        <div className="text-center py-12 text-gray-400">
          Пока нет ставок<br />Сделай первую на странице Турниры!
        </div>
      )}

      <div className="space-y-4">
        {bets.map((bet) => (
          <div key={bet.id} className="bg-zinc-900 rounded-3xl p-5">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>{bet.date}</span>
              <span className="text-emerald-400">-{bet.amount} cryst</span>
            </div>
            <p className="font-bold text-lg">{bet.tournament}</p>
            <p className="text-emerald-400 text-xl font-medium">{bet.mode}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
