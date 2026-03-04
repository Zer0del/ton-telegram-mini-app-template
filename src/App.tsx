import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Tournaments } from './pages/Tournaments';
import { MyBets } from './pages/MyBets';
import { Admin } from './pages/Admin';
import { useTelegram } from './hooks/useTelegram';

function App() {
  const { tg } = useTelegram();

  // Проверка админа (твой ID)
  const isAdmin = tg.initDataUnsafe?.user?.id?.toString() === '636499517';

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/my-bets" element={<MyBets />} />
          {isAdmin && <Route path="/admin" element={<Admin />} />}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
