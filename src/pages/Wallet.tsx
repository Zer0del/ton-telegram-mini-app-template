import { useTonConnectUI } from '@tonconnect/ui-react';
import { useCrystals } from '../hooks/useCrystals';

export function Wallet() {
  const [tonConnectUI] = useTonConnectUI();
  const { crystals, updateCrystals } = useCrystals();

  // useEffect с localStorage полностью удалён — теперь всё через Supabase + TanStack Query
  const buyWithTON = async () => {
    // заглушка для покупки
    const newAmount = crystals + 100;
    updateCrystals(newAmount);
    alert('Plus 100 cryst зачислено!');
  };

  const withdrawToTON = async () => {
    if (crystals < 100) return alert('Недостаточно кристаликов');
    const address = prompt('Введи TON-адрес для вывода:');
    if (!address) return;
    alert(`Вывод ${crystals} cryst на ${address} отправлен!`);
    updateCrystals(0);  // остаток = 0 (как было в старой заглушке)
  };

  if (loading) return <div className="p-4 text-center">Загрузка баланса...</div>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">💎 Кошелёк</h1>

      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 text-center mb-8">
        <div className="text-sm opacity-75">Твой баланс</div>
        <div className="text-6xl font-bold mt-2">{crystals}</div>
        <div className="text-xl mt-1">кристаликов</div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <button onClick={buyWithTON} className="bg-blue-600 hover:bg-blue-700 py-6 rounded-3xl text-lg font-medium transition-all active:scale-95">Купить за TON</button>
        <button className="bg-purple-600 hover:bg-purple-700 py-6 rounded-3xl text-lg font-medium transition-all active:scale-95">Купить за Stars</button>
      </div>

      <button onClick={withdrawToTON} className="w-full bg-emerald-500 hover:bg-emerald-600 py-6 rounded-3xl text-xl font-medium transition-all active:scale-95">Вывести на TON-кошелёк</button>
    </div>
  );
}
