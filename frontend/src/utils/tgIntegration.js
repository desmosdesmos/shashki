// frontend/src/utils/tgIntegration.js
let tg;

export const initializeTGWebApp = () => {
  // Проверяем, доступен ли объект Telegram WebApp
  if (window.Telegram && window.Telegram.WebApp) {
    tg = window.Telegram.WebApp;
    
    // Устанавливаем цвет фона
    tg.setBackgroundColor('#f0f2f5');
    
    // Устанавливаем цвет заголовка
    tg.setHeaderColor('#2c3e50');
    
    // Включаем вертикальный свайп для закрытия
    tg.enableClosingConfirmation();
    
    // Устанавливаем размеры приложения
    tg.expand();
    
    console.log('Telegram WebApp initialized');
  } else {
    console.warn('Telegram WebApp not available');
  }
};

export const closeTgApp = () => {
  if (tg) {
    tg.close();
  }
};

export const sendDataToTG = (data) => {
  if (tg) {
    tg.sendData(JSON.stringify(data));
  }
};