import { useState, useEffect } from 'react';
import { useCrystals } from '../hooks/useCrystals';
import { useBank } from '../hooks/useBank';
import { supabase } from '../main';
import { hltvTeams } from '../data/teams';

interface Bet {
  id: number;
  tournament: string;
  mode: string;
  prediction: string[];
  amount: number;
  date: string;
}

export function Tournaments() {
  const [showBetModal, setShowBetModal] = useState(false);
  const [currentTournament, setCurrentTournament] = useState('');
  const [currentMode, setCurrentMode] = useState('');
  const [prediction, setPrediction] = useState<string[]>([]);
  const [bets, setBets] = useState<Bet[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);   // ← добавили

  // === ДИНАМИЧЕСКАЯ ЗАГРУЗКА ТУРНИРОВ ИЗ SUPABASE ===
  const [tournaments, setTournaments] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from('tournaments')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setTournaments(data);
      });
  }, []);
  
  const { crystals, updateCrystals } = useCrystals();

  // Общий банк турнира (реалтайм для всех пользователей)
  const { bank, addToBank } = useBank(currentTournament, currentMode);

  // Загрузка ставок пользователя из Supabase + обновление после завершения
  useEffect(() => {
    const loadBets = () => {
      const webApp = (window as any).Telegram?.WebApp;
      const userId = webApp?.initDataUnsafe?.user?.id;

      if (userId) {
        supabase
          .from('bets')
          .select('*')
          .eq('telegram_id', userId)
          .then(({ data }) => {
            if (data) setBets(data);
          });
      }
    };

    loadBets();

    // Перезагружаем ставки каждые 3 секунды (пока турнир активен)
    const interval = setInterval(loadBets, 3000);
    return () => clearInterval(interval);
  }, []);

  const openBetModal = (tournament: string, mode: string) => {
    setCurrentTournament(tournament);
    setCurrentMode(mode);
    setPrediction([]);
    setShowBetModal(true);
  };

  const currentTournamentData = tournaments.find(t => t.name === currentTournament);

  // Получаем правильный логотип по имени команды из глобального списка
  const getTeamLogo = (teamName: string) => {
    const team = hltvTeams.find(t => t.name === teamName);
    return team ? team.logo : "https://www.hltv.org/img/static/team/logo/5973.png"; // fallback
  };

  const addTeam = (teamName: string) => {
    const max = parseInt(currentMode.replace('Top-', ''));
    if (prediction.length < max && !prediction.includes(teamName)) {
      setPrediction([...prediction, teamName]);
    }
  };

  const removeTeam = (index: number) => {
    setPrediction(prediction.filter((_, i) => i !== index));
  };

  const hasBet = (tournament: string, mode: string) => {
    return bets.some(b => b.tournament === tournament && b.mode === mode);
  };

  const handleConfirmBet = async () => {
    if (isSubmitting) return; // защита от двойных кликов
    if (prediction.length !== parseInt(currentMode.replace('Top-', ''))) {
      alert('Выбери все места!');
      return;
    }
    if (crystals < 100) {
      alert('Недостаточно кристаликов!');
      return;
    }

    const webApp = (window as any).Telegram?.WebApp;
    const telegramId = webApp?.initDataUnsafe?.user?.id;

    if (!telegramId) {
      alert('Не удалось получить Telegram ID');
      return;
    }

    setIsSubmitting(true); // блокируем кнопку

    try {
      // Списываем кристалики
      updateCrystals(crystals - 100);

      // Добавляем в банк
      await addToBank(100);

      // Сохраняем ставку
      const newBet = {
        telegram_id: telegramId,
        tournament: currentTournament,
        mode: currentMode,
        prediction: [...prediction],
        amount: 100,
        date: new Date().toLocaleDateString('ru-RU')
      };

      await supabase.from('bets').insert(newBet);

      alert(`Ставка принята! Банк вырос.`);
      setShowBetModal(false);
      setPrediction([]);
    } catch (err) {
      console.error(err);
      alert('Ошибка при отправке ставки. Попробуй ещё раз.');
    } finally {
      setIsSubmitting(false); // разблокируем кнопку
    }
  };

  // === ВНУТРЕННИЙ КОМПОНЕНТ ДЛЯ БАНКА (решает нарушение хуков) ===
  const ModeButton = ({ tournamentName, mode }: { tournamentName: string; mode: string }) => {
    const { bank } = useBank(tournamentName, mode);  // теперь хук на топ-уровне
    const alreadyBet = hasBet(tournamentName, mode);

    return (
      <button
        onClick={() => !alreadyBet && openBetModal(tournamentName, mode)}
        disabled={alreadyBet}
        className={`w-full py-7 rounded-3xl mt-3 text-lg font-medium transition-all ${
          alreadyBet 
            ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed' 
            : 'bg-zinc-800 hover:bg-zinc-700 active:scale-[0.97]'
        }`}
      >
        {mode} • Банк: {bank} cryst {alreadyBet && '(ставка сделана)'}
      </button>
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Турниры CS2</h1>

      {tournaments.map((t, i) => (
        <div key={i} className="mb-8 bg-zinc-900 rounded-3xl p-5">
          <h2 className="text-xl font-bold mb-3">{t.name}</h2>
          {['Top-1', 'Top-3', 'Top-5'].map((mode) => (
            <ModeButton 
              key={mode} 
              tournamentName={t.name} 
              mode={mode} 
            />
          ))}
        </div>
      ))}

      {showBetModal && currentTournamentData && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-end safe-area overflow-hidden">
          <div className="bg-[#171717] w-full max-h-[88vh] rounded-t-3xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-zinc-800 text-center">
              <h2 className="text-2xl font-bold">Составь свой {currentMode}</h2>
              <p className="text-zinc-400 mt-1">{currentTournament}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6 main-content pb-40">
              <h3 className="text-green-400 font-semibold text-lg">МОЙ ТОП {currentMode.replace('Top-', '')}</h3>
              <div className="space-y-3">
                {Array.from({ length: parseInt(currentMode.replace('Top-', '')) }).map((_, i) => (
                  <div key={i} className="bg-zinc-900 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <span className="text-green-400 font-bold">Место {i + 1}</span>
                      <div className="text-white text-lg mt-1">{prediction[i] || 'Выбери команду'}</div>
                    </div>
                    {prediction[i] && <button onClick={() => removeTeam(i)} className="text-red-400 text-3xl">✕</button>}
                  </div>
                ))}
              </div>

              <h3 className="text-green-400 font-semibold text-lg mt-8">КОМАНДЫ ТУРНИРА</h3>
              <div className="grid grid-cols-1 gap-3">
                {currentTournamentData.teams
                  .filter(team => !prediction.includes(team.name))
                  .map((team, idx) => (
                    <button
                      key={idx}
                      onClick={() => addTeam(team.name)}
                      className="bg-zinc-800 hover:bg-zinc-700 p-4 rounded-2xl flex items-center gap-4 active:scale-95"
                    >
                      <img src={getTeamLogo(team.name)} alt="" className="w-10 h-10 rounded-none object-cover" />
                      <span className="text-white text-lg">{team.name}</span>
                    </button>
                  ))}
              </div>
            </div>

            <div className="p-4 border-t border-zinc-800 flex gap-3 bg-[#171717] pb-8">
              <button onClick={() => setShowBetModal(false)} className="flex-1 py-4 bg-red-500 rounded-2xl text-lg font-medium">Отмена</button>
              <button 
                onClick={handleConfirmBet} 
                disabled={isSubmitting}
                className={`flex-1 py-4 rounded-2xl text-lg font-medium text-black transition-all ${
                  isSubmitting 
                    ? 'bg-zinc-500 cursor-not-allowed' 
                    : 'bg-green-500 hover:bg-green-600 active:scale-95'
                }`}
              >
                {isSubmitting ? 'Отправка...' : 'Подтвердить (100 cryst)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
