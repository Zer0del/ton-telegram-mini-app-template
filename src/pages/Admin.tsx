import { useState, useEffect } from 'react';
import { supabase } from '../main';
import { useQueryClient } from '@tanstack/react-query';   // ← добавили

export function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [realResult, setRealResult] = useState<string[]>([]);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTournament, setNewTournament] = useState({ 
    name: '', 
    start_date: '', 
    end_date: '', 
    selectedTeams: [] as string[] 
  });
  const [tournaments, setTournaments] = useState<any[]>([]);
  const queryClient = useQueryClient();   // ← добавили для обновления баланса

  useEffect(() => {
    const webApp = (window as any).Telegram?.WebApp;
    const userId = webApp?.initDataUnsafe?.user?.id;
    if (userId === 636499517) setIsAdmin(true);
  }, []);
  
  // Загрузка динамического списка турниров из Supabase
  useEffect(() => {
    supabase
      .from('tournaments')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setTournaments(data);
      });
  }, []);
  
    // Загружаем полный турнир с командами при открытии модалки
  useEffect(() => {
    if (selectedTournament) {
      supabase
        .from('tournaments')
        .select('teams')
        .eq('name', selectedTournament)
        .single()
        .then(({ data }) => {
          if (data) {
            // обновляем локальный массив, чтобы селекты сразу видели команды
            setTournaments(prev => prev.map(t => t.name === selectedTournament ? { ...t, teams: data.teams } : t));
          }
        });
    }
  }, [selectedTournament]);

  if (!isAdmin) {
    return (
      <div className="p-8 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-red-400">Доступ запрещён</h1>
        <p className="text-zinc-400 mt-2">Эта панель только для администратора</p>
      </div>
    );
  }

  const finishTournament = (tournament: string) => {
    setSelectedTournament(tournament);
    setRealResult([]);
    setShowResultModal(true);
  };

  const saveRealResult = async () => {
    if (realResult.length !== 5) {
      alert('Заполни все 5 мест!');
      return;
    }

    const modes = ['Top-1', 'Top-3', 'Top-5'];

    try {
      for (const mode of modes) {
        const requiredMatches = parseInt(mode.replace('Top-', ''));

        const { data: allBets } = await supabase
          .from('bets')
          .select('*')
          .eq('tournament', selectedTournament)
          .eq('mode', mode);

        const winners = allBets?.filter(bet =>
          bet.prediction.slice(0, requiredMatches).every((team: string, i: number) => team === realResult[i])
        ) || [];

        const { data: bankData } = await supabase
          .from('tournament_banks')
          .select('bank')
          .eq('tournament', selectedTournament)
          .eq('mode', mode)
          .maybeSingle();

        const bank = bankData?.bank || 1000;

        if (winners.length > 0) {
          const prize = Math.floor(bank / winners.length);

          for (const winner of winners) {
            const { data: user } = await supabase
              .from('user_balances')
              .select('crystals')
              .eq('telegram_id', winner.telegram_id)
              .single();

            const currentCrystals = user?.crystals || 0;  // ← фикс двойного +500
            await supabase
              .from('user_balances')
              .upsert({ telegram_id: winner.telegram_id, crystals: currentCrystals + prize });
          }
          alert(`✅ ${mode}: ${winners.length} победителей! Каждый получил по ${prize} cryst.`);
        } else {
          const nextTournament = tournaments.find(t => t.name !== selectedTournament);
          if (nextTournament) {
            const { data: nextBank } = await supabase
              .from('tournament_banks')
              .select('bank')
              .eq('tournament', nextTournament.name)
              .eq('mode', mode)
              .maybeSingle();

            const nextBankAmount = (nextBank?.bank || 1000) + Math.floor(bank / 2);
            await supabase
              .from('tournament_banks')
              .upsert({ tournament: nextTournament.name, mode, bank: nextBankAmount });
            alert(`❌ ${mode}: победителей нет. Половина банка перенесена.`);
          }
        }
      }

      // === ГАРАНТИРОВАННОЕ УДАЛЕНИЕ ВСЕХ СТАВОК ТУРНИРА (одним запросом) ===
      await supabase
        .from('bets')
        .delete()
        .eq('tournament', selectedTournament);

      // Удаляем все банки турнира
      await supabase
        .from('tournament_banks')
        .delete()
        .eq('tournament', selectedTournament);

      // Удаляем сам турнир
      await supabase
        .from('tournaments')
        .delete()
        .eq('name', selectedTournament);

      // Обновляем кэш баланса
      queryClient.invalidateQueries({ queryKey: ['userCrystals'] });

      // Локально удаляем турнир из списка
      setTournaments(prev => prev.filter(t => t.name !== selectedTournament));

      alert('✅ Турнир полностью завершён! Все ставки удалены из Supabase, баланс обновлён.');
      setShowResultModal(false);
    } catch (error) {
      console.error('Ошибка завершения турнира:', error);
      alert('❌ Ошибка при завершении турнира. Посмотри консоль.');
    }
  };

  const addNewTournament = async () => {
    if (!newTournament.name || !newTournament.start_date || !newTournament.end_date) {
      alert('Заполни название, начало и конец турнира!');
      return;
    }
    if (newTournament.selectedTeams.length === 0) {
      alert('Выбери хотя бы одну команду!');
      return;
    }

    const newData = {
      name: newTournament.name,
      start_date: newTournament.start_date,
      end_date: newTournament.end_date,
      status: 'Скоро',
      color: 'bg-yellow-500',
      teams: newTournament.selectedTeams.map(name => ({
        name,
        logo: "https://www.hltv.org/img/static/team/logo/5973.png"
      }))
    };

    const { error } = await supabase
      .from('tournaments')
      .insert(newData);

    if (error) {
      alert('Ошибка при добавлении турнира: ' + error.message);
      console.error('Supabase error:', error);
      return;
    }

    alert('Новый турнир успешно добавлен!');
    setShowAddModal(false);
    setNewTournament({ name: '', start_date: '', end_date: '', selectedTeams: [] });

    // Перезагружаем список
    supabase
      .from('tournaments')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setTournaments(data);
      });
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Админ-панель</h1>

      {/* Кнопка добавления нового турнира */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="w-full bg-green-500 text-black py-4 rounded-2xl font-medium mb-8"
      >
        + Добавить новый турнир
      </button>

      {tournaments.length > 0 ? (
        tournaments.map((t, i) => (
          <div key={i} className="mb-8 bg-zinc-900 rounded-3xl p-5">
            <h2 className="text-xl font-bold mb-4">{t.name}</h2>
            <button
              onClick={() => finishTournament(t.name)}
              className="w-full bg-red-600 hover:bg-red-700 py-6 rounded-2xl text-lg font-medium"
            >
              Завершить турнир
            </button>
          </div>
        ))
      ) : (
        <div className="text-center py-20 text-zinc-400 bg-zinc-900 rounded-3xl p-8">
          Нет активных турниров<br />
          Добавьте новый турнир выше ↑
        </div>
      )}

      {/* Модалка добавления турнира — полностью скроллится + кнопка всегда внизу */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="bg-[#171717] w-full max-w-md rounded-3xl p-6 max-h-[92vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-6 text-center">Новый турнир</h3>
            
            <input 
              type="text" 
              placeholder="Название турнира" 
              className="w-full bg-zinc-800 p-4 rounded-2xl mb-3 text-white"
              value={newTournament.name}
              onChange={(e) => setNewTournament({...newTournament, name: e.target.value})}
            />
            
            <input 
              type="text" 
              placeholder="Начало (например: 18 марта)" 
              className="w-full bg-zinc-800 p-4 rounded-2xl mb-3 text-white"
              value={newTournament.start_date}
              onChange={(e) => setNewTournament({...newTournament, start_date: e.target.value})}
            />
            
            <input 
              type="text" 
              placeholder="Конец (например: 29 марта)" 
              className="w-full bg-zinc-800 p-4 rounded-2xl mb-3 text-white"
              value={newTournament.end_date}
              onChange={(e) => setNewTournament({...newTournament, end_date: e.target.value})}
            />

            {/* Выбор команд */}
            <div className="mt-6">
              <div className="text-sm text-zinc-400 mb-3">Выбери команды-участницы</div>
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                {[
                  "Vitality", "Team Spirit", "NaVi", "G2 Esports", "Team Liquid",
                  "FaZe Clan", "MOUZ", "Astralis", "BIG", "3DMAX",
                  "Eternal Fire", "HEROIC"
                ].map(team => {
                  const isSelected = newTournament.selectedTeams.includes(team);
                  return (
                    <button
                      key={team}
                      onClick={() => {
                        if (isSelected) {
                          setNewTournament({
                            ...newTournament,
                            selectedTeams: newTournament.selectedTeams.filter(t => t !== team)
                          });
                        } else {
                          setNewTournament({
                            ...newTournament,
                            selectedTeams: [...newTournament.selectedTeams, team]
                          });
                        }
                      }}
                      className={`p-3 rounded-2xl text-sm transition-all ${
                        isSelected 
                          ? 'bg-green-500 text-black' 
                          : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                      }`}
                    >
                      {team}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Кнопки всегда внизу */}
            <div className="flex gap-3 mt-8 sticky bottom-0 bg-[#171717] pt-4 pb-2">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-4 bg-zinc-700 rounded-2xl">Отмена</button>
              <button onClick={addNewTournament} className="flex-1 py-4 bg-green-500 text-black rounded-2xl font-medium">Добавить турнир</button>
            </div>
          </div>
        </div>
      )}

      {showResultModal && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="bg-[#171717] w-full max-w-md rounded-3xl p-6">
            <h3 className="text-xl font-bold mb-6 text-center">Реальный результат — {selectedTournament}</h3>

            {Array.from({ length: 5 }).map((_, i) => (
              <select
                key={i}
                value={realResult[i] || ''}
                onChange={(e) => {
                  const newRes = [...realResult];
                  newRes[i] = e.target.value;
                  setRealResult(newRes);
                }}
                className="w-full bg-zinc-800 p-4 rounded-2xl mb-3 text-white"
              >
                <option value="">Место {i + 1} — выбери команду</option>
                {tournaments.find(t => t.name === selectedTournament)?.teams.map(team => (
                  <option key={team.name} value={team.name}>{team.name}</option>
                ))}
              </select>
            ))}

            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowResultModal(false)} className="flex-1 py-4 bg-zinc-700 rounded-2xl">Отмена</button>
              <button onClick={saveRealResult} className="flex-1 py-4 bg-green-500 text-black rounded-2xl font-medium">Завершить и раздать призы</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
