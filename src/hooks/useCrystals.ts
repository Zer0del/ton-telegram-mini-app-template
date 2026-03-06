import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../main';

export const useCrystals = () => {
  const queryClient = useQueryClient();
  const telegramId = (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id || 0;

  // === ЗАГРУЗКА БАЛАНСА ИЗ SUPABASE (замена useState + localStorage) ===
  const { data: crystals = 500 } = useQuery({
    queryKey: ['userCrystals', telegramId],
    queryFn: async () => {
      if (!telegramId) return 500;
      const { data, error } = await supabase
        .from('user_balances')
        .select('crystals')
        .eq('telegram_id', telegramId)
        .single();

      if (error && error.code !== 'PGRST116') console.error(error); // PGRST116 = no rows
      return data?.crystals ?? 500;
    },
    staleTime: 1000 * 60 * 5, // 5 минут
  });

  // === ОБНОВЛЕНИЕ БАЛАНСА (upsert + optimistic update) ===
  const mutation = useMutation({
    mutationFn: async (newAmount: number) => {
      if (!telegramId) return;
      const { error } = await supabase
        .from('user_balances')
        .upsert({ telegram_id: telegramId, crystals: Math.max(0, newAmount) }, { onConflict: 'telegram_id' });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userCrystals', telegramId] });
    },
  });

  const updateCrystals = (newAmount: number) => {
    // optimistic update — чтобы Tournaments.tsx работал как раньше (синхронно)
    queryClient.setQueryData(['userCrystals', telegramId], newAmount);
    mutation.mutate(newAmount);
  };

  const resetCrystals = () => {
    updateCrystals(500); // как было в старом коде
  };

  return { crystals, updateCrystals, resetCrystals };
};
