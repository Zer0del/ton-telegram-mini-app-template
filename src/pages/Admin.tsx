import { useState, useEffect } from 'react';

const tournamentsData = [ /* тот же массив 3 турниров */ ];

export function Admin() {
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [realResult, setRealResult] = useState<string[]>([]);

  const finishMode = (t: string, m: string) => { setSelectedTournament(t); setSelectedMode(m); setRealResult([]); setShowResultModal(true); };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Админ-панель</h1>
      {tournamentsData.map((t, i) => (
        <div key={i} className="mb-8 bg-zinc-900 rounded-3xl p-5">
          <h2 className="text-xl font-bold mb-3">{t.name}</h2>
          {['Top-1', 'Top-3', 'Top-5'].map(mode => (
            <button key={mode} onClick={() => finishMode(t.name, mode)} className="w-full bg-red-600 py-6 rounded-3xl mb-3">
              Завершить {mode}
            </button>
          ))}
        </div>
      ))}

      {/* модалка результата — как раньше */}
      {showResultModal && <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"> {/* модалка с select */} </div>}
    </div>
  );
}
