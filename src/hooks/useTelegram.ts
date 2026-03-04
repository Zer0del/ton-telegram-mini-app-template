import { useEffect, useState } from 'react';
import tgSDK from '@twa-dev/sdk';

export const useTelegram = () => {
  const [tg] = useState(tgSDK);
  const [theme, setTheme] = useState(tg.colorScheme);

  useEffect(() => {
    tg.ready();
    tg.expand();
    tg.setHeaderColor('secondary_bg_color');

    // Слушаем смену темы
    const handleThemeChange = () => setTheme(tg.colorScheme);
    tg.onEvent('themeChanged', handleThemeChange);

    // Back button
    if (tg.BackButton) {
      tg.BackButton.show();
      tg.BackButton.onClick(() => window.history.back());
    }

    return () => tg.offEvent('themeChanged', handleThemeChange);
  }, [tg]);

  const haptic = (type: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' | 'selection') => {
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred(type);
  };

  return { tg, theme, haptic };
};

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
