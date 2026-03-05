import { useState, useEffect } from 'react';
import { supabase } from '../main';

export const useCrystals = () => {
  const [crystals, setCrystals] = useState(500);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const webApp = (window as any).Telegram?.WebApp;
    const telegramId = webApp?.initDataUnsafe?.user?.id;

    if (!telegramId) {
      setLoading(false);
      return;
    }

    // Загрузка баланса из Supabase
    const loadBalance = async () => {
      const { data } = await supabase
        .from('user_balances')
        .select('crystals')
        .eq('telegram_id', telegramId)
        .single();

      if (data) {
        setCrystals(data.crystals);
      } else {
        // Создаём запись, если пользователя нет
        await supabase.from('user_balances').insert({ telegram_id: telegramId, crystals: 500 });
      }
      setLoading(false);
    };

    loadBalance();

    // Реалтайм-подписка
    const channel = supabase
      .channel(`balance-${telegramId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_balances', filter: `telegram_id=eq.${telegramId}` },
        (payload) => setCrystals(payload.new.crystals)
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const updateCrystals = async (newAmount: number) => {
    const webApp = (window as any).Telegram?.WebApp;
    const telegramId = webApp?.initDataUnsafe?.user?.id;

    if (telegramId) {
      await supabase
        .from('user_balances')
        .upsert({ telegram_id: telegramId, crystals: newAmount });
    }
  };

  return { crystals, updateCrystals, loading };
};
