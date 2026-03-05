import { useState, useEffect } from 'react';
import { supabase } from '../main';

const tournamentsData = [ /* здесь остаётся твой массив турниров */ ];

export function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const webApp = (window as any).Telegram?.WebApp;
    const userId = webApp?.initDataUnsafe?.user?.id;

    // ТВОЙ ID — только ты имеешь доступ
    if (userId === 636499517) {
      setIsAdmin(true);
    }
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

  // === ТВОЯ АДМИНКА (только ты видишь) ===
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Админ-панель</h1>
      {/* Здесь будет удобный интерфейс для добавления и завершения турниров */}
      {/* Я добавлю его в следующем сообщении, если скажешь "давай полный админ" */}
    </div>
  );
}
