# Users Auth with Roles — NestJS

Полноценная система аутентификации и авторизации на NestJS с поддержкой ролей, прав и управления пользователями.

## Возможности

- JWT-аутентификация
- Управление пользователями (регистрация, профиль, обновление, удаление)
- Ролевой доступ (RBAC)
- Гибкая система прав (permissions)
- Защита маршрутов через Guard'ы
- Документация Swagger
- Поддержка Docker и PostgreSQL
- Тесты (unit, e2e)

---

## Структура проекта

```
src/
├── app.module.ts
├── main.ts
├── auth/         # Аутентификация и JWT
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   ├── jwt-auth.guard.ts
│   └── interfaces/
├── users/        # Пользователи
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── password.service.ts
│   ├── create-user.dto.ts
│   ├── update-user.dto.ts
│   └── interfaces/
├── roles/        # Роли
│   ├── roles.controller.ts
│   ├── roles.service.ts
│   └── interfaces/
├── permissions/  # Права доступа
│   ├── permissions.controller.ts
│   ├── permissions.service.ts
│   ├── permissions.guard.ts
│   └── permissions.decorator.ts
├── entities/     # TypeORM-сущности (User, Role, Permission)
├── database/     # Сиды и настройки БД
│   └── seeds/
└── ...
```

---

## Быстрый старт

1. Клонируйте репозиторий и установите зависимости:
   ```bash
   git clone https://github.com/nkd89/userAuthWRoles.git
   cd userAuthWRoles
   npm install
   ```
2. Создайте файл `.env` в корне:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_NAME=userswroles
   JWT_SECRET=your_jwt_secret
   S3_URL=your_url
   S3_UPLOAD_TOKEN=your_bearer_token
   ```
3. Запустите PostgreSQL (можно через Docker):
   ```bash
   docker-compose up -d
   ```
4. Запустите приложение:
   ```bash
   npm run start:dev
   # или production
   npm run build && npm run start:prod
   ```

---

## Основные модули и примеры

### Аутентификация

- POST `/auth/login` — вход по email/телефону и паролю
- JWT-токен возвращается в ответе

### Пользователи

- POST `/users/register` — регистрация
- GET `/users/me` — профиль текущего пользователя (JWT)
- PUT `/users/me` — обновление профиля
- DELETE `/users/me` — удаление пользователя

### Роли

- POST `/roles` — создать роль
- GET `/roles` — список ролей
- PUT `/roles/:id` — обновить роль
- DELETE `/roles/:id` — удалить роль

### Права (permissions)

- Гибкая система прав, назначаемых ролям
- Пример использования Guard:
  ```typescript
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @PermissionsAll('users.update.self')
  @Get('protected')
  getProtected() { return 'Доступ разрешён'; }
  ```

---

## Документация API

Swagger доступен по адресу: [http://localhost:3000/docs](http://localhost:3000/docs)

---

## Тестирование

- Unit-тесты: `npm run test`
- E2E-тесты: `npm run test:e2e`
- Покрытие: `npm run test:cov`

---

## Docker

- Запуск PostgreSQL и pgAdmin:
  ```bash
  docker-compose up -d
  ```
- Остановка:
  ```bash
  docker-compose down
  ```

---

## Seed (начальные данные)

- В проекте есть сиды для создания базовых ролей и прав (`src/database/seeds/initial-seed.ts`).

---

## Контакты и поддержка

- GitHub: https://github.com/nkd89/userAuthWRoles
- Issues: https://github.com/nkd89/userAuthWRoles/issues

---

## Лицензия

MIT
