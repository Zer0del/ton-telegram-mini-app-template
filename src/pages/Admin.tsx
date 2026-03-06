import { useState, useEffect } from 'react';
import { supabase } from '../main';

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

  useEffect(() => {
    const webApp = (window as any).Telegram?.WebApp;
    const userId = webApp?.initDataUnsafe?.user?.id;
    if (userId === 636499517) setIsAdmin(true);
  }, []);

  useEffect(() => {
    // Загрузка динамического списка турниров из Supabase
    supabase
      .from('tournaments')
      .select('*')
      .then(({ data }) => {
        if (data) setTournaments(data);
      });
  }, []);

  if (!isAdmin) {
    return (
      <div className="p-8 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-red-400">Доступ запрещён</h1>
        <p className="text-zinc-400 mt-2">Эта панель только для администратора</p>
      </div>
    );
  }

  const finishMode = (tournament: string, mode: string) => {
    setSelectedTournament(tournament);
    setSelectedMode(mode);
    setRealResult([]);
    setShowResultModal(true);
  };

    const saveRealResult = async () => {
      const maxPlaces = parseInt(selectedMode.replace('Top-', ''));
      if (realResult.length !== maxPlaces) {
        alert('Заполни все места!');
        return;
      }

      // 1. Получаем все ставки этого режима
      const { data: allBets } = await supabase
        .from('bets')
        .select('*')
        .eq('tournament', selectedTournament)
        .eq('mode', selectedMode);

      // 2. Находим победителей (полное совпадение)
      const winners = allBets?.filter(bet =>
        bet.prediction.every((team: string, i: number) => team === realResult[i])
      ) || [];

      // 3. Получаем банк
      const { data: bankData } = await supabase
        .from('tournament_banks')
        .select('bank')
        .eq('tournament', selectedTournament)
        .eq('mode', selectedMode)
        .single();

      const bank = bankData?.bank || 1000;

    if (winners.length > 0) {
      const prize = Math.floor(bank / winners.length);

      // 4. Раздаём призы каждому победителю
      for (const winner of winners) {
        // Сначала получаем текущий баланс пользователя
        const { data: user } = await supabase
          .from('user_balances')
          .select('crystals')
          .eq('telegram_id', winner.telegram_id)
          .single();

        const currentCrystals = user?.crystals || 500;
        const newCrystals = currentCrystals + prize;

        await supabase
          .from('user_balances')
          .upsert({
            telegram_id: winner.telegram_id,
            crystals: newCrystals
          });
      }

      alert(`✅ ${winners.length} победителей! Каждый получил по ${prize} cryst.`);
    } else {
      alert('❌ Победителей нет. Банк остаётся.');
    }
      // 5. Удаляем банк режима
      await supabase
        .from('tournament_banks')
        .delete()
        .eq('tournament', selectedTournament)
        .eq('mode', selectedMode);

      // 6. Удаляем все ставки этого режима
      await supabase
        .from('bets')
        .delete()
        .eq('tournament', selectedTournament)
        .eq('mode', selectedMode);

      alert('Турнир завершён. Данные очищены.');
      setShowResultModal(false);
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

      {tournaments.map((t, i) => (
        <div key={i} className="mb-8 bg-zinc-900 rounded-3xl p-5">
          <h2 className="text-xl font-bold mb-4">{t.name}</h2>
          {['Top-1', 'Top-3', 'Top-5'].map((mode) => (
            <button
              key={mode}
              onClick={() => finishMode(t.name, mode)}
              className="w-full bg-red-600 hover:bg-red-700 py-6 rounded-2xl mb-3 text-lg font-medium"
            >
              Завершить {mode}
            </button>
          ))}
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
          {/* модалка завершения — оставляем как была */}
        </div>
      )}
    </div>
  );
}
