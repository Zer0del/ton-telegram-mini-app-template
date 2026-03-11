import { useState, useEffect } from 'react';
import { supabase } from '../main';
import { useQueryClient } from '@tanstack/react-query';   // ← добавили

const tournamentsData = [
  {
    name: "BLAST Open Rotterdam 2026",
    date: "18–29 марта",
    prize: "$1 100 000",
    status: "LIVE",
    color: "bg-red-500",
    teams: [
      { name: "Vitality", logo: "https://www.hltv.org/img/static/team/logo/5973.png" },
      { name: "Team Spirit", logo: "https://www.hltv.org/img/static/team/logo/7020.png" },
      { name: "NaVi", logo: "https://www.hltv.org/img/static/team/logo/6667.png" },
      { name: "G2 Esports", logo: "https://www.hltv.org/img/static/team/logo/5995.png" },
      { name: "Team Liquid", logo: "https://www.hltv.org/img/static/team/logo/5973.png" },
      { name: "FaZe Clan", logo: "https://www.hltv.org/img/static/team/logo/6667.png" },
      { name: "MOUZ", logo: "https://www.hltv.org/img/static/team/logo/5000.png" },
      { name: "Astralis", logo: "https://www.hltv.org/img/static/team/logo/6665.png" },
      { name: "BIG", logo: "https://www.hltv.org/img/static/team/logo/7532.png" },
      { name: "3DMAX", logo: "https://www.hltv.org/img/static/team/logo/7020.png" },
      { name: "Eternal Fire", logo: "https://www.hltv.org/img/static/team/logo/11251.png" },
      { name: "HEROIC", logo: "https://www.hltv.org/img/static/team/logo/7178.png" }
    ]
  },
  {
    name: "ESL Pro League Season 23 Finals",
    date: "13–15 марта",
    prize: "$275 000",
    status: "Скоро",
    color: "bg-yellow-500",
    teams: [ /* те же 12 команд */ ]
  },
  {
    name: "PGL Bucharest 2026",
    date: "3–11 апреля",
    prize: "$1 250 000",
    status: "Скоро",
    color: "bg-yellow-500",
    teams: [ /* те же 12 команд */ ]
  }
];

export function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [realResult, setRealResult] = useState<string[]>([]);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTournament, setNewTournament] = useState({ name: '', date: '', prize: '' });
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
  
  // Fallback на локальные турниры, если Supabase пустой
  const displayTournaments = tournaments.length > 0 ? tournaments : tournamentsData;
  
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

            const currentCrystals = user?.crystals || 500;
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
    if (!newTournament.name) {
      alert('Введите название турнира!');
      return;
    }

    // Полный набор команд по умолчанию (чтобы не зависеть от старого tournamentsData)
    const defaultTeams = [
      { name: "Vitality", logo: "https://www.hltv.org/img/static/team/logo/5973.png" },
      { name: "Team Spirit", logo: "https://www.hltv.org/img/static/team/logo/7020.png" },
      { name: "NaVi", logo: "https://www.hltv.org/img/static/team/logo/6667.png" },
      { name: "G2 Esports", logo: "https://www.hltv.org/img/static/team/logo/5995.png" },
      { name: "Team Liquid", logo: "https://www.hltv.org/img/static/team/logo/5973.png" },
      { name: "FaZe Clan", logo: "https://www.hltv.org/img/static/team/logo/6667.png" },
      { name: "MOUZ", logo: "https://www.hltv.org/img/static/team/logo/5000.png" },
      { name: "Astralis", logo: "https://www.hltv.org/img/static/team/logo/6665.png" },
      { name: "BIG", logo: "https://www.hltv.org/img/static/team/logo/7532.png" },
      { name: "3DMAX", logo: "https://www.hltv.org/img/static/team/logo/7020.png" },
      { name: "Eternal Fire", logo: "https://www.hltv.org/img/static/team/logo/11251.png" },
      { name: "HEROIC", logo: "https://www.hltv.org/img/static/team/logo/7178.png" }
    ];

    const newData = {
      name: newTournament.name,
      date: newTournament.date || 'Дата не указана',
      prize: newTournament.prize || '$0',
      status: 'Скоро',
      color: 'bg-yellow-500',
      teams: defaultTeams
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
    setNewTournament({ name: '', date: '', prize: '' });

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

      {displayTournaments.map((t, i) => (
        <div key={i} className="mb-8 bg-zinc-900 rounded-3xl p-5">
          <h2 className="text-xl font-bold mb-4">{t.name}</h2>
          <button
            onClick={() => finishTournament(t.name)}
            className="w-full bg-red-600 hover:bg-red-700 py-6 rounded-2xl text-lg font-medium"
          >
            Завершить турнир
          </button>
        </div>
      ))}

      {/* Модалка добавления турнира */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="bg-[#171717] w-full max-w-md rounded-3xl p-6">
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
              placeholder="Дата (18–29 марта)" 
              className="w-full bg-zinc-800 p-4 rounded-2xl mb-3 text-white"
              value={newTournament.date}
              onChange={(e) => setNewTournament({...newTournament, date: e.target.value})}
            />
            <input 
              type="text" 
              placeholder="Призовой фонд ($1 100 000)" 
              className="w-full bg-zinc-800 p-4 rounded-2xl mb-3 text-white"
              value={newTournament.prize}
              onChange={(e) => setNewTournament({...newTournament, prize: e.target.value})}
            />

            <div className="flex gap-3 mt-8">
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
