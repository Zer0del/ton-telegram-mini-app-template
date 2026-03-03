import { Link } from "react-router-dom";
import { FaHome, FaTrophy, FaList, FaWallet } from "react-icons/fa";

export function Footer() {
    return (
        <div>
            <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-xl bg-zinc-950 border-t border-zinc-800 flex justify-around items-center z-50 text-xs py-1">
                
                <Link to="/" className="text-center text-gray-400 hover:text-white flex flex-col items-center py-1 px-3">
                    <FaHome size={24} />
                    <p className="mt-0.5 text-[10px]">Главная</p>
                </Link>

                <Link to="/tournaments" className="text-center text-gray-400 hover:text-white flex flex-col items-center py-1 px-3">
                    <FaTrophy size={24} />
                    <p className="mt-0.5 text-[10px]">Турниры</p>
                </Link>

                <Link to="/mybets" className="text-center text-gray-400 hover:text-white flex flex-col items-center py-1 px-3">
                    <FaList size={24} />
                    <p className="mt-0.5 text-[10px]">Мои ставки</p>
                </Link>

                <Link to="/wallet" className="text-center text-emerald-400 hover:text-white flex flex-col items-center py-1 px-3">
                    <FaWallet size={24} />
                    <p className="mt-0.5 text-[10px]">Кошелёк</p>
                </Link>
            </div>
        </div>
    );
}
