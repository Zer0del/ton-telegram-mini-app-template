import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Tournaments } from './pages/Tournaments';
import { MyBets } from './pages/MyBets';
import { Admin } from './pages/Admin';
import { useTelegram } from './hooks/useTelegram';
import { motion } from 'framer-motion';

const ADMIN_TG_ID = '636499517';

function App() {
  const { tg, haptic } = useTelegram();

  // Пример: проверка админа (можно вынести в контекст)
  const isAdmin = tg.initDataUnsafe?.user?.id?.toString() === ADMIN_TG_ID;

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)]">
        <Header />
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pb-20"
        >
          <Routes>
            <Route path="/" element={<Home haptic={haptic} />} />
            <Route path="/tournaments" element={<Tournaments haptic={haptic} />} />
            <Route path="/my-bets" element={<MyBets haptic={haptic} />} />
            {isAdmin && <Route path="/admin" element={<Admin />} />}
          </Routes>
        </motion.main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
