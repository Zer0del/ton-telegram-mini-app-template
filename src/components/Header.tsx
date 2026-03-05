import { TonConnectButton } from "@tonconnect/ui-react";

export function Header() {
  return (
    <div className="p-4 border-b border-zinc-800 bg-black flex items-center justify-end sticky top-0 z-50">
      <TonConnectButton />
    </div>
  );
}
