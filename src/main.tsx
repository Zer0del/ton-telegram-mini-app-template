import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { TonConnectUIProvider } from "@tonconnect/ui-react";

const manifestUrl = 'https://tonpanda.com/wp-content/uploads/2024/10/tonconnect-manifest.json';

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

// Только проверенные кошельки (убираем Mirai и Tomo)
const preferredWallets = [
  'tonkeeper',      // Tonkeeper
  'mytonwallet',    // MyTonWallet
  'tonhub',         // Tonhub
  'tonwallet',      // Ton Wallet
  // добавь сюда другие, если нужно
];

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TonConnectUIProvider
      manifestUrl={manifestUrl}
      walletsListSource="https://raw.githubusercontent.com/ton-blockchain/wallets-list/main/wallets-v2.json"
      preferredWallets={preferredWallets}
      uiPreferences={{ theme: 'SYSTEM' }}
    >
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </TonConnectUIProvider>
  </React.StrictMode>
);
