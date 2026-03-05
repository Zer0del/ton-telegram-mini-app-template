import { useState, useEffect } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { Link } from 'react-router-dom';

export function Home() {
  const [tonConnectUI] = useTonConnectUI();
  const [balance, setBalance] = useState(500);

  useEffect(() => {
    const saved = localStorage.getItem('crystalBalance');
    if (saved) setBalance(parseInt(saved));
  }, []);

  const connectWallet = () => tonConnectUI.connectWallet();

  return (
    <div className="p-4">
      {/* Логотип + Connect */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <img src="https://www.hltv.org/img/static/cs2_logo.png" alt="CS2" className="w-12 h-12" />
          <div>
            <div className="text-3xl font-black tracking-tighter">CS2</div>
            <div className="text-4xl font-black text-green-400 -mt-3">PREDICT</div>
            <div className="text-xs text-green-400">Top-1 • Top-3 • Top-5</div>
          </div>
        </div>
        <button
          onClick={connectWallet}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-3xl font-medium text-sm"
        >
          Connect Wallet
        </button>
      </div>

      {/* Баланс */}
      <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-700 rounded-3xl p-8 text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center text-5xl">💎</div>
        </div>
        <div className="text-7xl font-bold text-green-400">{balance}</div>
        <div className="text-xl text-zinc-400">Кристалики</div>
      </div>

      {/* Кнопки */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          to="/wallet"
          className="bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-medium py-6 rounded-3xl text-center text-lg active:scale-95 transition-all"
        >
          Купить кристалики
        </Link>
        <Link
          to="/tournaments"
          className="border-2 border-green-400 text-green-400 font-medium py-6 rounded-3xl text-center text-lg active:scale-95 transition-all"
        >
          Сделать предикт
        </Link>
      </div>
    </div>
  );
}
