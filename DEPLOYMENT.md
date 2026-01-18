# Деплой Telegram Mini App

Инструкции по развертыванию приложения на production-сервере.

## Подготовка к деплою

1. Убедитесь, что все зависимости установлены:
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

2. Соберите фронтенд:
```bash
cd frontend && npm run build
```

3. Убедитесь, что в корне проекта есть файл `.env` с правильными значениями:
```
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

## Развертывание на сервере

### Вариант 1: Самостоятельный сервер

1. Загрузите код на сервер
2. Установите Node.js и MongoDB
3. Установите зависимости:
```bash
npm install
cd backend && npm install
```
4. Соберите фронтенд:
```bash
cd frontend && npm run build
```
5. Запустите приложение:
```bash
npm start
```

### Вариант 2: Облачные платформы (Heroku, Render, Railway и т.д.)

1. Подключите репозиторий к облачной платформе
2. Установите переменные окружения:
   - NODE_ENV=production
   - MONGODB_URI=your_mongodb_connection_string
   - TELEGRAM_BOT_TOKEN=your_telegram_bot_token
3. Укажите команду сборки: `cd frontend && npm run build`
4. Укажите команду запуска: `npm start`

## Настройка SSL

Telegram Mini Apps требуют HTTPS. Убедитесь, что у вас настроен SSL-сертификат:
- Используйте Cloudflare, Let's Encrypt или предоставляемый хостингом SSL
- Убедитесь, что все ресурсы загружаются по HTTPS

## Настройка Telegram Bot

1. После развертывания приложения обновите URL веб-приложения у @BotFather
2. Убедитесь, что URL совпадает с адресом вашего production-сервера

## Мониторинг и логирование

1. Настройте логирование на сервере
2. Используйте такие сервисы, как Winston для Node.js
3. Настройте уведомления об ошибках

## Резервное копирование

1. Регулярно создавайте резервные копии базы данных
2. Используйте автоматические скрипты для бэкапа
3. Храните бэкапы в безопасном месте

## Масштабирование

1. При необходимости используйте кластеризацию Node.js
2. Рассмотрите использование Redis для хранения сессий
3. Используйте CDN для статических ресурсов