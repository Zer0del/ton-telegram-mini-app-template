import { Link, useLocation } from "react-router-dom";
import { FaHome, FaTrophy, FaList, FaWallet, FaUserShield } from "react-icons/fa";

export function Footer() {
  const location = useLocation();

  const tabs = [
    { path: "/", icon: <FaHome size={22} />, label: "Главная" },
    { path: "/tournaments", icon: <FaTrophy size={22} />, label: "Турниры" },
    { path: "/my-bets", icon: <FaList size={22} />, label: "Ставки" },
    { path: "/wallet", icon: <FaWallet size={22} />, label: "Кошелёк" },
    { path: "/admin", icon: <FaUserShield size={22} />, label: "Админ" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#171717] border-t border-zinc-800 z-50 safe-area pb-3">
      <div className="flex items-center justify-around py-2 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center py-1 px-4 transition-all active:scale-95 ${
                isActive 
                  ? 'text-green-400 scale-110' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab.icon}
              <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
