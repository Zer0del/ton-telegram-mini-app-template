import React from 'react';
import './App.css';

import { Home } from './pages/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { Plan } from './pages/Plan';
import { Tournaments } from './pages/Tournaments';

function App() {

  return (

    <BrowserRouter>

      <div className="bg-black flex justify-center">

        <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/mybets" element={<div className="p-4 text-center text-2xl text-white">Мои ставки</div>} />
            <Route path="/wallet" element={<div className="p-4 text-center text-2xl text-white">Кошелёк (баланс TON + вывод)</div>} />
            <Route path="/plan" element={<Plan />} />
          </Routes>

        </div>
      </div>
    </BrowserRouter>

  )
}

export default App
