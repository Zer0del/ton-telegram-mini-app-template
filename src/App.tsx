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
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Header />
        
        <main className="flex-1 main-content overflow-y-auto">
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
