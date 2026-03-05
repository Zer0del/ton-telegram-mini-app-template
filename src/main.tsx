import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import telegram from '@twa-dev/sdk';
import { Analytics } from '@vercel/analytics/react';   // ← добавили

const manifestUrl = 'https://tonpanda.com/wp-content/uploads/2024/10/tonconnect-manifest.json';

const queryClient = new QueryClient();

const Root = () => {
  useEffect(() => {
    const webApp = telegram;
    webApp.ready();
    webApp.expand();

    // Отправляем событие открытия мини-аппа в Vercel Analytics
    const user = webApp.initDataUnsafe?.user;
    if (user) {
      console.log(`👤 Новый пользователь: @${user.username || user.id}`);
      // Vercel автоматически увидит это как уникального пользователя
    }
  }, []);

  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <QueryClientProvider client={queryClient}>
        <App />
        <Analytics /> {/* ← эта строка включает трекинг */}
      </QueryClientProvider>
    </TonConnectUIProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
