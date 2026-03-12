import { useState, useEffect, useRef } from 'react';
import { supabase } from '../main';

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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // === ФЛАГ ОЧИСТКИ (сохраняется даже при смене вкладок) ===
  const [isCleared, setIsCleared] = useState(() => 
    localStorage.getItem('betsCleared') === 'true'
  );

  // Загрузка ставок + realtime-подписка Supabase (ставки исчезают мгновенно после завершения турнира)
  useEffect(() => {
    const webApp = (window as any).Telegram?.WebApp;
    const telegramId = webApp?.initDataUnsafe?.user?.id;

    if (!telegramId) {
      setLoading(false);
      return;
    }

    // Автоматически сбрасываем флаг очистки при заходе
    if (isCleared) {
      localStorage.removeItem('betsCleared');
      setIsCleared(false);
    }

    const loadBets = () => {
      supabase
        .from('bets')
        .select('*')
        .eq('telegram_id', telegramId)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          if (data) setBets(data);
          setLoading(false);
        });
    };

    loadBets();

    // === REALTIME ПОДПИСКА — ставки исчезают мгновенно ===
    const channel = supabase
      .channel('my-bets-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'bets',
          filter: `telegram_id=eq.${telegramId}`
        },
        () => loadBets() // мгновенно обновляем список
      )
      .subscribe();

    // Очищаем при размонтировании
    return () => {
      supabase.removeChannel(channel);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isCleared]);

  if (loading) return <div className="p-4 text-center text-zinc-400">Загрузка ставок...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Мои ставки</h1>

      {/* Кнопка очистки старых ставок — теперь интервал останавливается навсегда */}
      {bets.length > 0 && (
        <button 
          onClick={async () => {
            if (!confirm('Удалить ВСЕ ставки навсегда? Это действие нельзя отменить.')) return;

            try {
              const webApp = (window as any).Telegram?.WebApp;
              const telegramId = webApp?.initDataUnsafe?.user?.id;

              if (!telegramId) {
                alert('❌ Не удалось получить Telegram ID');
                return;
              }

              const { error } = await supabase
                .from('bets')
                .delete()
                .eq('telegram_id', telegramId);

              if (error) throw error;

              // Останавливаем интервал и сохраняем флаг навсегда
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
              // Флаг не ставим — очистка теперь только ручная

              setBets([]);
              alert('✅ Все ставки успешно очищены и больше никогда не вернутся');
            } catch (err) {
              console.error('Ошибка очистки:', err);
              alert('❌ Ошибка при очистке. Посмотри консоль');
            }
          }}
          className="mb-6 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-2xl transition-all"
        >
          🗑 Очистить все ставки
        </button>
      )}

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
