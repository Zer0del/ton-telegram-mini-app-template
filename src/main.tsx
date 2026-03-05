import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import telegram from '@twa-dev/sdk';
import { createClient } from '@supabase/supabase-js';

// === ВСТАВЬ СВОИ ДАННЫЕ ИЗ SUPABASE ===
const supabaseUrl = 'https://nyyykbtkygmlbxlqicmi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55eXlrYnRreWdtbGJ4bHFpY21pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MjY1MjAsImV4cCI6MjA4ODMwMjUyMH0.-8ZrB1wfIS17noxYt7sbX2UJEa7s2ROkBQUTC80epzE';
// =====================================

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const queryClient = new QueryClient();

const Root = () => {
  useEffect(() => {
    const webApp = telegram;
    webApp.ready();
    webApp.expand();
  }, []);

  return (
    <TonConnectUIProvider manifestUrl="https://tonpanda.com/wp-content/uploads/2024/10/tonconnect-manifest.json">
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </TonConnectUIProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
