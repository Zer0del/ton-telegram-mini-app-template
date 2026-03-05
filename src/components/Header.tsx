import { TonConnectButton } from "@tonconnect/ui-react";

export function Header() {
  return (
    <div className="p-4 border-b border-zinc-800 bg-black flex items-center justify-between sticky top-0 z-50">
      {/* Верхний блок — оставляем именно его */}
      <div className="flex items-center gap-3">
        <img 
          src="https://www.hltv.org/img/static/cs2_logo.png" 
          alt="CS2" 
          className="w-12 h-12" 
        />
        <div>
          <div className="text-3xl font-black tracking-tighter">CS2</div>
          <div className="text-4xl font-black text-green-400 -mt-3">PREDICT</div>
          <div className="text-xs text-green-400">Top-1 • Top-3 • Top-5</div>
        </div>
      </div>
      <TonConnectButton />
    </div>
  );
}
