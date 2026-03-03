export function BasicInfo() {
    return (
        <div className="static pb-1">
            <div className="px-4 pt-8 text-center bg-black">
                <h1 className="text-4xl font-black text-white mb-2">CS2 PREDICT</h1>
                <p className="text-lg text-gray-400 mb-6">
                    Угадай топ-1 / топ-3 / топ-5<br />
                    на Tier-1 турнирах • Выиграй кристаллики
                </p>

                <div className="bg-zinc-900 rounded-2xl p-5 mb-6">
                    <div className="text-5xl font-bold text-emerald-400">0</div>
                    <p className="text-xs text-gray-400 mt-1">ТВОИ КРИСТАЛЛИКИ</p>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl text-xl font-bold">
                    Подключить TON кошелёк
                </button>
            </div>
        </div>
    );
}
