import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Tournaments } from './pages/Tournaments';
import { MyBets } from './pages/MyBets';
import { Wallet } from './pages/Wallet';
import { Admin } from './pages/Admin';

const ADMIN_TG_ID = '636499517'; // твой Telegram ID

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black text-white pb-20">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/my-bets" element={<MyBets />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
