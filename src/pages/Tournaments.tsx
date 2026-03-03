import { useState } from 'react';

export function Tournaments() {
  const [showModal, setShowModal] = useState(false);
  const [selectedBet, setSelectedBet] = useState({ tournament: '', mode: '', amount: 0 });

  const openBet = (tournament: string, mode: string, amount: number) => {
    setSelectedBet({ tournament, mode, amount });
    setShowModal(true);
  };

  const confirmBet = () => {
    alert(`✅ Ставка размещена!\n\n${selectedBet.mode} за ${selectedBet.amount} cryst\nТурнир: ${selectedBet.tournament}\n\n(позже здесь будет реальная оплата кристалликами)`);
    setShowModal(false);
  };

  return (
    <div className="p-4 pb-24 space-y-6">
      <h1 className="text-3xl font-black text-center">Турниры CS2</h1>

      {/* Первый турнир */}
      <div className="bg-zinc-900 rounded-3xl p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-bold text-xl">BLAST Premier Spring Final 2026</p>
            <p className="text-emerald-400 text-sm">12–15 марта • $400 000</p>
          </div>
          <span className="bg-red-500 px-3 py-1 rounded-full text-xs font-bold">LIVE</span>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3">
          <button onClick={() => openBet('BLAST Premier Spring Final 2026', 'Top-1', 50)} className="bg-zinc-800 hover:bg-zinc-700 py-4 rounded-2xl text-sm">Top-1<br/>50 cryst</button>
          <button onClick={() => openBet('BLAST Premier Spring Final 2026', 'Top-3', 100)} className="bg-zinc-800 hover:bg-zinc-700 py-4 rounded-2xl text-sm">Top-3<br/>100 cryst</button>
          <button onClick={() => openBet('BLAST Premier Spring Final 2026', 'Top-5', 200)} className="bg-zinc-800 hover:bg-zinc-700 py-4 rounded-2xl text-sm">Top-5<br/>200 cryst</button>
        </div>
      </div>

      {/* Второй турнир */}
      <div className="bg-zinc-900 rounded-3xl p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-bold text-xl">IEM Katowice 2026</p>
            <p className="text-emerald-400 text-sm">20–23 марта • $1 000 000</p>
          </div>
          <span className="bg-yellow-500 px-3 py-1 rounded-full text-xs font-bold">Скоро</span>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3">
          <button onClick={() => openBet('IEM Katowice 2026', 'Top-1', 50)} className="bg-zinc-800 hover:bg-zinc-700 py-4 rounded-2xl text-sm">Top-1<br/>50 cryst</button>
          <button onClick={() => openBet('IEM Katowice 2026', 'Top-3', 100)} className="bg-zinc-800 hover:bg-zinc-700 py-4 rounded-2xl text-sm">Top-3<br/>100 cryst</button>
          <button onClick={() => openBet('IEM Katowice 2026', 'Top-5', 200)} className="bg-zinc-800 hover:bg-zinc-700 py-4 rounded-2xl text-sm">Top-5<br/>200 cryst</button>
        </div>
      </div>

      {/* Модалка подтверждения */}
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
