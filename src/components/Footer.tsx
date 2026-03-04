import { NavLink } from "react-router-dom";
import { FaHome, FaTrophy, FaList, FaWallet, FaLock } from "react-icons/fa";

export function Footer() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[var(--tg-theme-bg-color)] border-t border-[var(--tg-theme-secondary-bg-color)] z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center py-2 max-w-2xl mx-auto">
        
        <NavLink 
          to="/" 
          className={({ isActive }) => `flex flex-col items-center text-xs ${isActive ? 'text-blue-500' : 'text-[var(--tg-theme-hint-color)]'}`}
        >
          <FaHome size={24} />
          Главная
        </NavLink>

        <NavLink 
          to="/tournaments" 
          className={({ isActive }) => `flex flex-col items-center text-xs ${isActive ? 'text-blue-500' : 'text-[var(--tg-theme-hint-color)]'}`}
        >
          <FaTrophy size={24} />
          Турниры
        </NavLink>

        <NavLink 
          to="/my-bets" 
          className={({ isActive }) => `flex flex-col items-center text-xs ${isActive ? 'text-blue-500' : 'text-[var(--tg-theme-hint-color)]'}`}
        >
          <FaList size={24} />
          Ставки
        </NavLink>

        <NavLink 
          to="/wallet" 
          className={({ isActive }) => `flex flex-col items-center text-xs ${isActive ? 'text-blue-500' : 'text-[var(--tg-theme-hint-color)]'}`}
        >
          <FaWallet size={24} />
          Кошелёк
        </NavLink>

        <NavLink 
          to="/admin" 
          className={({ isActive }) => `flex flex-col items-center text-xs ${isActive ? 'text-blue-500' : 'text-[var(--tg-theme-hint-color)]'}`}
        >
          <FaLock size={24} />
          Админ
        </NavLink>
      </div>
    </div>
  );
}
