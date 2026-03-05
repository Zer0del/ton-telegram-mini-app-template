import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Tournaments } from './pages/Tournaments';
import { MyBets } from './pages/MyBets';
import { Wallet } from './pages/Wallet';
import { Admin } from './pages/Admin';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-[100dvh] bg-black text-white overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto main-content safe-area">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/my-bets" element={<MyBets />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
