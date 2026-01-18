// frontend/src/utils/tgIntegration.js
import { useEffect } from 'react';

export const initializeTGWebApp = () => {
  // Проверяем, что мы внутри Telegram Web App
  if (window.Telegram?.WebApp) {
    // Инициализируем Telegram Web App
    const tg = window.Telegram.WebApp;
    
    // Устанавливаем размеры приложения
    tg.ready();
    
    // Устанавливаем цвет фона
    document.body.style.backgroundColor = '#f0f0f0';
    
    // Включаем вертикальный свайп
    tg.enableVerticalSwipes();
    
    console.log('Telegram Web App initialized');
  } else {
    console.log('Not in Telegram Web App environment');
  }
};

// Функция для получения данных пользователя из Telegram
export const getUserData = () => {
  if (window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp;
    return tg.initDataUnsafe?.user || null;
  }
  return null;
};

// Функция для расширения приложения на весь экран
export const expandApp = () => {
  if (window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.expand();
  }
};