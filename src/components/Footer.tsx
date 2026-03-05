import { Link, useLocation } from "react-router-dom";
import { FaHome, FaTrophy, FaList, FaWallet, FaUserShield } from "react-icons/fa";

export function Footer() {
  const location = useLocation();
  const webApp = (window as any).Telegram?.WebApp;
  const userId = webApp?.initDataUnsafe?.user?.id;

  // Только ты видишь вкладку Админ
  const isAdmin = userId === 636499517;

  const tabs = [
    { path: "/", icon: <FaHome size={24} />, label: "Главная" },
    { path: "/tournaments", icon: <FaTrophy size={24} />, label: "Турниры" },
    { path: "/my-bets", icon: <FaList size={24} />, label: "Ставки" },
    { path: "/wallet", icon: <FaWallet size={24} />, label: "Кошелёк" },
    ...(isAdmin ? [{ path: "/admin", icon: <FaUserShield size={24} />, label: "Админ" }] : []),
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#171717] border-t border-zinc-800 z-50 safe-area">
      <div className="flex items-center justify-around py-3 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center transition-all active:scale-95 ${
                isActive ? 'text-green-400' : 'text-zinc-400'
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
