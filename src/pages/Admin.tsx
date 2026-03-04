import { useState } from 'react';

export function Admin() {
  const [tournamentName, setTournamentName] = useState('');
  const [date, setDate] = useState('');
  const [prize, setPrize] = useState('');
  const [status, setStatus] = useState('Скоро');
  const [teams, setTeams] = useState('');

  const addTournament = () => {
    if (!tournamentName || !date || !prize || !teams) {
      alert('Заполни все поля!');
      return;
    }

    // Пока сохраняем в localStorage (потом можно в Supabase)
    const currentTournaments = JSON.parse(localStorage.getItem('tournaments') || '[]');
    const newTournament = {
      name: tournamentName,
      date,
      prize,
      status,
      teams: teams.split(',').map(t => t.trim()),
      color: status === 'LIVE' ? 'bg-red-500' : 'bg-yellow-500'
    };
    currentTournaments.push(newTournament);
    localStorage.setItem('tournaments', JSON.stringify(currentTournaments));

    alert('Турнир добавлен!');
    // Очистка формы
    setTournamentName('');
    setDate('');
    setPrize('');
    setTeams('');
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-black mb-8 text-center">Админка</h1>

      <div className="bg-zinc-900 rounded-3xl p-6 space-y-4">
        <input
          type="text"
          placeholder="Название турнира"
          value={tournamentName}
          onChange={e => setTournamentName(e.target.value)}
          className="w-full p-4 bg-zinc-800 rounded-2xl text-white placeholder-gray-500"
        />
        <input
          type="text"
          placeholder="Даты (18–29 марта)"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full p-4 bg-zinc-800 rounded-2xl text-white placeholder-gray-500"
        />
        <input
          type="text"
          placeholder="Призовой фонд ($1 100 000)"
          value={prize}
          onChange={e => setPrize(e.target.value)}
          className="w-full p-4 bg-zinc-800 rounded-2xl text-white placeholder-gray-500"
        />
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="w-full p-4 bg-zinc-800 rounded-2xl text-white"
        >
          <option value="Скоро">Скоро</option>
          <option value="LIVE">LIVE</option>
        </select>
        <textarea
          placeholder="Команды через запятую: Vitality, NaVi, G2 Esports..."
          value={teams}
          onChange={e => setTeams(e.target.value)}
          className="w-full p-4 bg-zinc-800 rounded-2xl text-white placeholder-gray-500 h-32"
        />
        <button 
          onClick={addTournament}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 rounded-2xl text-xl font-bold"
        >
          Добавить турнир
        </button>
      </div>
    </div>
  );
}
