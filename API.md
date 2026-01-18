# API Документация для Telegram Checkers Mini App

## Базовый URL
`http://localhost:5000/api` (для разработки)
`https://yourdomain.com/api` (для production)

## Аутентификация
Все запросы должны содержать заголовок `Content-Type: application/json`.

## Пользователи

### Создать пользователя
- **POST** `/users`
- **Тело запроса:**
```json
{
  "telegramId": "string",
  "username": "string",
  "firstName": "string",
  "lastName": "string"
}
```
- **Ответ:**
```json
{
  "success": true,
  "_id": "user_id",
  "telegramId": "string",
  "username": "string",
  "firstName": "string",
  "lastName": "string",
  "gamesPlayed": 0,
  "gamesWon": 0,
  "createdAt": "timestamp"
}
```
- **Ошибки:**
  - `409 Conflict` - Пользователь с таким telegramId уже существует

### Получить пользователя
- **GET** `/users/{id}`
- **Параметры:**
  - `id` (path) - ID пользователя
- **Ответ:**
```json
{
  "success": true,
  "_id": "user_id",
  "telegramId": "string",
  "username": "string",
  "firstName": "string",
  "lastName": "string",
  "gamesPlayed": 0,
  "gamesWon": 0,
  "createdAt": "timestamp"
}
```
- **Ошибки:**
  - `404 Not Found` - Пользователь не найден

## Игры

### Создать игру
- **POST** `/games`
- **Тело запроса:**
```json
{
  "player1Id": "string",
  "gameMode": "ai|online"
}
```
- **Ответ:**
```json
{
  "success": true,
  "_id": "game_id",
  "player1Id": "string",
  "player2Id": "string|null",
  "gameMode": "ai|online",
  "boardState": "[[object]]",
  "currentPlayer": "player1|player2",
  "moves": [],
  "winner": "string|null",
  "status": "waiting|active|finished",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Получить игру
- **GET** `/games/{id}`
- **Параметры:**
  - `id` (path) - ID игры
- **Ответ:**
```json
{
  "success": true,
  "_id": "game_id",
  "player1Id": "string",
  "player2Id": "string|null",
  "gameMode": "ai|online",
  "boardState": "[[object]]",
  "currentPlayer": "player1|player2",
  "moves": [],
  "winner": "string|null",
  "status": "waiting|active|finished",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```
- **Ошибки:**
  - `404 Not Found` - Игра не найдена

### Сделать ход
- **PUT** `/games/{id}`
- **Параметры:**
  - `id` (path) - ID игры
- **Тело запроса:**
```json
{
  "from": [row, col],
  "to": [row, col]
}
```
- **Ответ:**
```json
{
  "success": true,
  "_id": "game_id",
  "player1Id": "string",
  "player2Id": "string|null",
  "gameMode": "ai|online",
  "boardState": "[[object]]",
  "currentPlayer": "player1|player2",
  "moves": [...],
  "winner": "string|null",
  "status": "waiting|active|finished",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```
- **Ошибки:**
  - `400 Bad Request` - Неверный ход
  - `404 Not Found` - Игра не найдена

## WebSocket события

Приложение использует Socket.IO для реального времени в многопользовательской игре:

### Подключение
Клиент подключается к серверу по WebSocket и отправляет событие `join-room` с ID комнаты.

### События:
- `join-room` - Присоединиться к комнате
  - **Данные:** `{ roomId: string }`
- `move-piece` - Совершить ход
  - **Данные:** `{ roomId: string, move: { from: [row, col], to: [row, col] } }`
- `opponent-move` - Ход противника
  - **Данные:** `{ from: [row, col], to: [row, col] }`