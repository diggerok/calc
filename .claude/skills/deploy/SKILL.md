---
name: deploy
description: Деплой калькулятора на продакшен сервер amigocalc.ru
---

Деплой на продакшен сервер `176.12.68.142` (amigocalc.ru).

Выполни последовательно через SSH:

```bash
ssh root@176.12.68.142 "cd /var/www/calc && git pull origin main && npm install && npx prisma generate && npx prisma migrate deploy && npm run build && pm2 restart calc"
```

После деплоя проверь что сервер отвечает:

```bash
curl -s -o /dev/null -w "%{http_code}" https://amigocalc.ru
```

Если код ответа 200 или 307 — деплой успешен. Сообщи пользователю результат.

Если build упал — покажи ошибку и НЕ перезапускай PM2 (старая версия продолжит работать).