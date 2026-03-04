import { NavLink } from "react-router-dom";
import { FaHome, FaTrophy, FaList, FaWallet, FaUserSecret } from "react-icons/fa";
import { useTelegram } from "../hooks/useTelegram";

export function Footer() {
  const { haptic } = useTelegram();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0a0f1c] border-t border-[#1e2a4a] z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center py-3 max-w-2xl mx-auto">
        <NavLink to="/" className={({ isActive }) => `flex flex-col items-center gap-1 text-xs ${isActive ? 'text-[#00ff9d]' : 'text-[#8ba7c9]'}`} onClick={() => haptic('light')}>
          <FaHome size={26} />
          Главная
        </NavLink>

        <NavLink to="/tournaments" className={({ isActive }) => `flex flex-col items-center gap-1 text-xs ${isActive ? 'text-[#00ff9d]' : 'text-[#8ba7c9]'}`} onClick={() => haptic('light')}>
          <FaTrophy size={26} />
          Турниры
        </NavLink>

        <NavLink to="/my-bets" className={({ isActive }) => `flex flex-col items-center gap-1 text-xs ${isActive ? 'text-[#00ff9d]' : 'text-[#8ba7c9]'}`} onClick={() => haptic('light')}>
          <FaList size={26} />
          Ставки
        </NavLink>

        <NavLink to="/wallet" className={({ isActive }) => `flex flex-col items-center gap-1 text-xs ${isActive ? 'text-[#00ff9d]' : 'text-[#8ba7c9]'}`} onClick={() => haptic('light')}>
          <FaWallet size={26} />
          Кошелёк
        </NavLink>

        <NavLink to="/admin" className={({ isActive }) => `flex flex-col items-center gap-1 text-xs ${isActive ? 'text-[#00ff9d]' : 'text-[#8ba7c9]'}`} onClick={() => haptic('light')}>
          <FaUserSecret size={26} />
          Админ
        </NavLink>
      </div>
    </div>
  );
}
