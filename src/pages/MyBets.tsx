import { useState, useEffect } from 'react';
import { supabase } from '../main';
import { useCrystals } from '../hooks/useCrystals';

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
  const [loading, setLoading] = useState(true);
  const { updateCrystals } = useCrystals();

  useEffect(() => {
    const webApp = (window as any).Telegram?.WebApp;
    const telegramId = webApp?.initDataUnsafe?.user?.id;

    if (!telegramId) {
      setLoading(false);
      return;
    }

    supabase
      .from('bets')
      .select('*')
      .eq('telegram_id', telegramId)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setBets(data);
        setLoading(false);
      });
  }, []);

  const resetAllBets = async () => {
    if (!confirm('Ты уверен? Все ставки будут удалены, а кристалики вернутся обратно.')) return;

    const webApp = (window as any).Telegram?.WebApp;
    const telegramId = webApp?.initDataUnsafe?.user?.id;

    if (!telegramId) {
      alert('Не удалось получить Telegram ID');
      return;
    }

    try {
      // 1. Возвращаем кристалики (100 за каждую ставку)
      const totalRefund = bets.length * 100;
      const { data: current } = await supabase
        .from('user_balances')
        .select('crystals')
        .eq('telegram_id', telegramId)
        .single();

      const newBalance = (current?.crystals || 500) + totalRefund;
      await supabase
        .from('user_balances')
        .upsert({ telegram_id: telegramId, crystals: newBalance });

      // 2. Удаляем все ставки пользователя из Supabase
      const { error } = await supabase
        .from('bets')
        .delete()
        .eq('telegram_id', telegramId);

      if (error) throw error;

      // 3. Очищаем локальный state
      setBets([]);

      alert(`✅ Все ставки сброшены! +${totalRefund} cryst возвращено на баланс.`);
    } catch (err) {
      console.error('Ошибка при сбросе ставок:', err);
      alert('Ошибка при сбросе ставок. Попробуй ещё раз.');
    }
  };

  if (loading) return <div className="p-4 text-center text-zinc-400">Загрузка ставок...</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Мои ставки</h1>
        {bets.length > 0 && (
          <button
            onClick={resetAllBets}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-2xl text-sm font-medium transition-all"
          >
            Сбросить все
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
          </div>
        ))}
      </div>
    </div>
  );
}
