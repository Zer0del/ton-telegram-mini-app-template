export function SavingInfo() {
    import { TonConnectButton } from "@tonconnect/ui-react";
    return (
        <div className="px-4 pt-6 pb-24">
            <div className="bg-zinc-900 rounded-3xl p-8 text-center border border-zinc-700">
                <p className="uppercase tracking-widest text-emerald-500 text-xs mb-1 font-medium">ТВОЙ БАЛАНС</p>
                <div className="text-[68px] leading-none font-black text-white mb-2">0</div>
                <p className="text-2xl font-bold text-emerald-400 mb-8">КРИСТАЛЛИКОВ</p>

                <p className="text-gray-400 text-[15px] leading-snug mb-10">
                    Угадай точный топ-1 / топ-3 / топ-5<br />
                    на Tier-1 турнирах CS2 и забирай весь банк
                </p>

<TonConnectButton className="w-full !bg-blue-600 hover:!bg-blue-700 !py-4 !rounded-2xl !text-xl !font-bold" />
            </div>

            <p className="text-center text-gray-500 text-xs mt-8">
                Купить кристаллики: TON • Telegram Stars • Задания
            </p>
        </div>
    );
}
