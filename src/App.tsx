import React from 'react';
import './App.css';

import { Home } from './pages/Home';
import { Tournaments } from './pages/Tournaments';
import { MyBets } from './pages/MyBets';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Admin } from './pages/Admin'; // новый импорт

// Твой Telegram ID (замени на свой реальный — посмотри в консоли после подключения кошелька)
const ADMIN_TG_ID = '123456789'; // ← ← ← ПОМЕНЯЙ НА СВОЙ ID

function App() {
  return (
    <BrowserRouter>
      <div className="bg-black flex justify-center">
        <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl">
          <Header />
          
          <main className="flex-1 overflow-y-auto pb-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tournaments" element={<Tournaments />} />
              <Route path="/mybets" element={<MyBets />} />
              <Route path="/wallet" element={<div className="p-4 text-center text-2xl text-white">Кошелёк</div>} />
              <Route 
                path="/admin" 
                element={
                  // Защита — только ты видишь
                  localStorage.getItem('tgUserId') === ADMIN_TG_ID 
                    ? <Admin /> 
                    : <div className="p-8 text-center text-red-400">Доступ запрещён</div>
                } 
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
