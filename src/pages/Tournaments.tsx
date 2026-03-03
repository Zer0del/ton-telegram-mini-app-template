import { useState } from 'react';

const tournaments = [
  { name: "BLAST Open Rotterdam 2026", date: "18–29 марта", prize: "$1 100 000", status: "LIVE", color: "bg-red-500" },
  { name: "ESL Pro League Season 23 Finals", date: "13–15 марта", prize: "$275 000", status: "Скоро", color: "bg-yellow-500" },
  { name: "PGL Bucharest 2026", date: "3–11 апреля", prize: "$1 250 000", status: "Скоро", color: "bg-yellow-500" }
];

interface Bet {
  id: number;
  tournament: string;
  mode: string;
  amount: number;
  date: string;
}

export function Tournaments() {
  const [showModal, setShowModal] = useState(false);
  const [selectedBet, setSelectedBet] = useState({ tournament: '', mode: '', amount: 0 });

  const openBet = (tournament: string, mode: string, amount: number) => {
    const currentCrystals = parseInt(localStorage.getItem('crystals') || '1000');
    if (currentCrystals < amount) {
      alert('❌ Недостаточно кристалликов!');
      return;
    }

    // Проверка: уже есть ставка на этот турнир + режим?
    const history: Bet[] = JSON.parse(localStorage.getItem('betsHistory') || '[]');
    const alreadyPlaced = history.some(b => 
      b.tournament === tournament && b.mode === mode
    );

    if (alreadyPlaced) {
      alert(`❌ Вы уже сделали ставку на ${mode} в турнире ${tournament}`);
      return;
    }

    setSelectedBet({ tournament, mode, amount });
    setShowModal(true);
  };

  const confirmBet = () => {
    let current = parseInt(localStorage.getItem('crystals') || '1000');
    current -= selectedBet.amount;
    localStorage.setItem('crystals', current.toString());

    const history: Bet[] = JSON.parse(localStorage.getItem('betsHistory') || '[]');
    const newBet: Bet = {
      id: Date.now(),
      tournament: selectedBet.tournament,
      mode: selectedBet.mode,
      amount: selectedBet.amount,
      date: new Date().toLocaleString('ru-RU')
    };
    history.unshift(newBet);
    localStorage.setItem('betsHistory', JSON.stringify(history));

    alert(`✅ Ставка размещена!\n\n${selectedBet.mode} за ${selectedBet.amount} cryst\nТурнир: ${selectedBet.tournament}\n\nБаланс обновлён!`);
    setShowModal(false);
  };

  return (
    <div className="p-4 pb-24 space-y-6">
      <h1 className="text-3xl font-black text-center">Турниры CS2</h1>

      {tournaments.map((t, i) => (
        <div key={i} className="bg-zinc-900 rounded-3xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold text-xl">{t.name}</p>
              <p className="text-emerald-400 text-sm">{t.date} • {t.prize}</p>
            </div>
            <span className={`${t.color} px-3 py-1 rounded-full text-xs font-bold`}>{t.status}</span>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3">
            <button onClick={() => openBet(t.name, 'Top-1', 50)} className="bg-zinc-800 hover:bg-zinc-700 py-4 rounded-2xl text-sm">Top-1<br/>50 cryst</button>
            <button onClick={() => openBet(t.name, 'Top-3', 100)} className="bg-zinc-800 hover:bg-zinc-700 py-4 rounded-2xl text-sm">Top-3<br/>100 cryst</button>
            <button onClick={() => openBet(t.name, 'Top-5', 200)} className="bg-zinc-800 hover:bg-zinc-700 py-4 rounded-2xl text-sm">Top-5<br/>200 cryst</button>
          </div>
        </div>
      ))}

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-3xl p-8 w-full max-w-sm text-center">
            <h3 className="text-2xl font-bold mb-6">Подтвердить ставку?</h3>
            <p className="text-xl mb-8">
              {selectedBet.mode} за {selectedBet.amount} cryst<br />
              <span className="text-emerald-400">{selectedBet.tournament}</span>
            </p>
            <div className="flex gap-4">
              <button onClick={() => setShowModal(false)} className="flex-1 py-4 bg-zinc-800 rounded-2xl text-lg">Отмена</button>
              <button onClick={confirmBet} className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 rounded-2xl text-lg font-bold">Да, ставлю!</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
