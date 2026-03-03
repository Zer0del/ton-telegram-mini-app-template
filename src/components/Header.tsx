import { TonConnectButton } from "@tonconnect/ui-react";

export function Header() {
    return (
        <div className="bg-zinc-950 border-b border-zinc-800 px-4 py-5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-orange-500 via-red-500 to-yellow-500 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow">
                        CS
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter text-white">CS2 PREDICT</h1>
                        <p className="text-xs text-emerald-400 -mt-1">Топ-1 • Топ-3 • Топ-5</p>
                    </div>
                </div>
                
                <TonConnectButton />
            </div>
        </div>
    );
}
