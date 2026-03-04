import React from 'react';
import './App.css';

import { Home } from './pages/Home';
import { Tournaments } from './pages/Tournaments';
import { MyBets } from './pages/MyBets';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Admin } from './pages/Admin';

// Твой Telegram ID (строка, потому что localStorage хранит строки)
const ADMIN_TG_ID = '636499517';

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
  element={<Admin />} 
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
