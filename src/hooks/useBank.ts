import { useState, useEffect } from 'react';
import { supabase } from '../main';

export const useBank = (tournament: string, mode: string) => {
  const [bank, setBank] = useState(1000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Загрузка текущего банка
    const fetchBank = async () => {
      const { data, error } = await supabase
        .from('tournament_banks')
        .select('bank')
        .eq('tournament', tournament)
        .eq('mode', mode)
        .maybeSingle();  // ← фиксит все 406

      if (error && error.code !== 'PGRST116') console.error(error);
      setBank(data?.bank ?? 1000);
      setLoading(false);
    };

    fetchBank();
    // Реалтайм-подписка — обновляется у всех пользователей мгновенно
    const channel = supabase
      .channel(`bank-${tournament}-${mode}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tournament_banks',
          filter: `tournament=eq.${tournament} AND mode=eq.${mode}`,
        },
        (payload) => {
          setBank(payload.new.bank);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tournament, mode]);

  const addToBank = async (amount: number) => {
    const { data } = await supabase
      .from('tournament_banks')
      .select('bank')
      .eq('tournament', tournament)
      .eq('mode', mode)
      .single();

    const newBank = (data?.bank || 1000) + amount;

    await supabase
      .from('tournament_banks')
      .upsert({ tournament, mode, bank: newBank });
  };

  return { bank, addToBank, loading };
};
