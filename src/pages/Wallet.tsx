import { useState, useEffect } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';

interface Bet {
  id: number;
  tournament: string;
  mode: string;
  prediction: string[];
  amount: number;
  date: string;
  prize?: number;
}

export function Wallet() {
  const [tonConnectUI] = useTonConnectUI();
  const [balance, setBalance] = useState(0);
  const [bets, setBets] = useState<Bet[]>([]);

  useEffect(() => {
    const savedBets = localStorage.getItem('userBets');
    const savedBalance = localStorage.getItem('crystalBalance') || '500'; // стартовый бонус
    if (savedBets) setBets(JSON.parse(savedBets));
    setBalance(parseInt(savedBalance));
  }, []);

  const saveBalance = (newBalance: number) => {
    localStorage.setItem('crystalBalance', newBalance.toString());
    setBalance(newBalance);
  };

  // Покупка за TON (пример 100 cryst = 0.5 TON)
  const buyWithTON = async () => {
    try {
      await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [{
          address: "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c", // замени на свой кошелёк
          amount: "500000000" // 0.5 TON
        }]
      });
      const newBalance = balance + 100;
      saveBalance(newBalance);
      alert('✅ 100 cryst зачислено!');
    } catch (e) {
      alert('❌ Ошибка покупки');
    }
  };

  // Вывод выигрыша на TON
  const withdrawToTON = async () => {
    if (balance < 100) return alert('Недостаточно кристаликов');
    const address = prompt('Введи TON-адрес для вывода:');
    if (!address) return;

    try {
      await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [{
          address,
          amount: (balance * 5000000).toString() // пример: 1 cryst = 0.005 TON
        }]
      });
      saveBalance(0);
      alert('✅ Вывод отправлен!');
    } catch (e) {
      alert('❌ Ошибка вывода');
    }
  };

  const totalWon = bets.reduce((sum, b) => sum + (b.prize || 0), 0);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">💎 Кошелёк</h1>

      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 text-center mb-8">
        <div className="text-sm opacity-75">Твой баланс</div>
        <div className="text-6xl font-bold mt-2">{balance}</div>
        <div className="text-xl mt-1">кристаликов</div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <button
          onClick={buyWithTON}
          className="bg-blue-600 hover:bg-blue-700 py-6 rounded-3xl text-lg font-medium transition-all active:scale-95"
        >
          Купить за TON
        </button>
        <button
          className="bg-purple-600 hover:bg-purple-700 py-6 rounded-3xl text-lg font-medium transition-all active:scale-95"
        >
          Купить за Stars
        </button>
      </div>

      <button
        onClick={withdrawToTON}
        className="w-full bg-emerald-500 hover:bg-emerald-600 py-6 rounded-3xl text-xl font-medium mb-10 transition-all active:scale-95"
      >
        Вывести на TON-кошелёк
      </button>

      <div className="bg-zinc-900 rounded-3xl p-5">
        <h3 className="text-lg font-semibold mb-4">Статистика</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-400">Ставок сделано:</span>
            <span className="font-medium">{bets.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Выиграно всего:</span>
            <span className="text-green-400 font-bold">+{totalWon} cryst</span>
          </div>
        </div>
      </div>
    </div>
  );
}
