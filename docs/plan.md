Текст ниже - это подготовка к выполнению задачи: что представляет собой выбранный backend и план по реализации frontend части

## 1. К чему нас обязывает выбранный backend fork?
- https://github.com/SilverHof/engineer-challenge выбран потому что есть подробная документация

- **какие поля обязательны**
POST /register → email, password
POST /login → email, password
POST /refresh → refresh_token
POST /request-password-reset → email
POST /reset-password → token, newPassword

- **есть ли валидация на backend**
email валидируется по RFC 5322;
пароль хешируется через bcrypt;
есть проверка credentials;
reset token валидируется и проверяется на истечение;
есть защита от повторного использования reset token;
есть rate limiting
HTTP 429 при превышении лимита

- **как приходят ошибки**
единый формат
{
  "message": "Описание ошибки понятное человеку",
  "status": 400
}

- **401/403/404/409/422**
409 Resource already exists
401 Invalid credentials
400 Invalid or expired token
429 rate limit declared in features
500 

не подтверждены
403
404
422

- **есть ли токен и где хранится сессия — cookie или bearer token**
login возвращает access_token, refresh_token, expires_in
refresh тоже возвращает новую пару access_token, refresh_token, expires_in
токены возвращаются в JSON body
про Set-Cookie, HttpOnly, SameSite ничего не сказано

- **как бекенд отвечает на повторный запрос**
- повторная регистрация того же email 409 Conflict
- повторное использование reset token не допускается, токен инвалидируется после использования, значит повторный reset с тем же token должен упасть ошибкой уровня 400/invalid token

- **успешный ответ идет как**
{ "data": ..., "success": true }

- **бывают ли пустые ответы**
контрактом пустые ответы не заявлены
но defensive handling на фронте все равно нужен

- **итого план связки backend и frontend**
1. Сначала создаем типы под то, что ждет backend и что возвращает backend чтобы видеть подсказки в IDE, и не тратить время на гадание и лишние перепроверки 

что мы отправляем на register
что мы отправляем на login
что мы отправляем на request-password-reset
что мы отправляем на reset-password
какие ответы приходят при успехе
какой формат ошибки приходит

2. Создам утилиту httpClient которая возьмет на себя рутину в работе с запросами: отправка HTTP-запроса, добавление Content-Type: application/json, превращение body в JSON, получение ответа, попытка распарсить JSON, возврат результата в удобном виде

3. Создам authApi c набором методов register(), login(), refresh(), requestPasswordReset(), resetPassword(), которые возьмут на себя работу с эндпоинтами, чтобы компоненты не были усложнены логикой хождения на эндпоинты

4. Создам утилиту convertFieldName которая будет преобразовывать формат бекенд ответа в удобный вид для фронтенда и наоборот. access_token -> accessToken

5. Создам утилиту normolizeAuthError которая принимает код ошибки и возвращает понятное пользователю сообщение, если бекенд не вернул

6. Создам composables под 4 сценария, которые может обрабатывать бекенд - useSignIn, useSignUp, useRequesstPasswordReset, useResetPassword чтобы связывать компоненты и модули выше

Структура должна быть после реализации этих шагов такая

src/
  app/
    main.ts
  shared/
    api/
      httpClient.ts
      types.ts
    auth/
      authApi.ts
      auth.types.ts
      convertFieldName.ts
      normalizeAuthError.ts
  composables/
    useSignIn.ts
    useSignUp.ts
    useRequestPasswordReset.ts
    useResetPassword.ts

## 2. Какие инструменты выберем для написания фронтенда

1. Vue - знаю его глубже чем React
2. Tailwind CSS - идеален для быстрой стилизации интерфейсов
3. Pinia - для auth состояния, хотя в рамках текущей задачи можно обойтись и без него
4. TypeScript - типизация
5. VueRouter - роутинг
6. Vitest + Vue Testing Library

## 3. Что со страницами, роутингом, и защитой роутов?

1. Создам страницы под сценарии
SignInPage.vue
SignUpPage.vue
ForgotPasswordPage.vue
ResetPasswordPage.vue
DashboardPage.vue // доступна только если в sessionStore есть accessToken
NotFoundPage.vue

2. Конфигурируем VueRouter
requiresAuth: true - DashboardPage.vue
guestOnly: true - /sign-in, /sign-up, /forgot-password

публичные /reset-password, 404

3. Guard утилита для редиректа: 
если роут требует авторизацию, а сессии нет → на /sign-in
если роут только для гостя, а сессия есть → на /dashboard
если роут / и пользователь авторизован редирект на /dashboard, в противном случае на /sign-in
в остальных случаях пускаем

После реализации этих шагов структура должна быть такой

src/
  app/
    main.ts
    router/
      index.ts
      guards.ts

  pages/
    SignInPage.vue
    SignUpPage.vue
    ForgotPasswordPage.vue
    ResetPasswordPage.vue
    DashboardPage.vue
    NotFoundPage.vue

  shared/
    api/
      httpClient.ts
      types.ts
    auth/
      authApi.ts
      auth.types.ts
      convertFieldName.ts
      normalizeAuthError.ts

  composables/
    useSignIn.ts
    useSignUp.ts
    useRequestPasswordReset.ts
    useResetPassword.ts

## 4. Декомпозируем макет и какие компоненты переиспользуем? Чек-лист по accessibility, адаптивности, LightHouse проверке

1. Экраны - контент по центру, контент слева иллюстрация справа - SimpleLayout, IllustrationLayout
2. Формы/обертки - FormTextInput и FormPasswordInput для полей формы, Form для реакции на сабмит, запуска валидации после сабмита, рендера слотов, обертка для статусов восстановления пароля - AuthStatus
3. База - Button (primary, secondary, gost), BackButton, HelperText, Logo, Illustration

**accessibility** чек-лист
1. button type="" class="focus:" aria-label=""
2. label for="" -> input id="" type=""
3. input aria-invalid="true" aria-describedby="id" -> p id="" (если ошибка есть)
4. aria-live="polite" role="alert" в статусах
5. img alt=""
6. button disabled (пока данные отправляются)

**адаптивность** чек лист
1. иллюстрацию на мобильном скрываем
2. ширины экранов для проверки - 320px, 375px, 768px, 1024px

Структура проекта после этого этапа должна стать такой

src/
  app/
    main.ts
    router/
      index.ts
      guards.ts

  pages/
    SignInPage.vue
    SignUpPage.vue
    ForgotPasswordPage.vue
    ResetPasswordPage.vue
    DashboardPage.vue
    NotFoundPage.vue

  composables/
    useSignIn.ts
    useSignUp.ts
    useRequestPasswordReset.ts
    useResetPassword.ts

  shared/
    api/
      httpClient.ts
      types.ts

    auth/
      authApi.ts
      auth.types.ts
      convertFieldName.ts
      normalizeAuthError.ts

    ui/
      base/
        Button.vue
        BackButton.vue
        HelperText.vue
        Logo.vue
        Illustration.vue

      form/
        Form.vue
        FormTextInput.vue
        FormPasswordInput.vue
        AuthStatus.vue

      layout/
        SimpleLayout.vue
        IllustrationLayout.vue

## 5. Каким будет поведение пользователя и ответ системы?

1. Неавторизованный пользователь попадает на /  -> Guard запрашивает токен у Pinia -> редиректит пользователя на /sign-in -> пользователь видит форму, поля формы с плейсхолдерами и НЕ может нажать на Submit (или может?) пока данные не заполнены ->  если email и password заполнены -> над полями видны лейблы, Submit доступен -> если данные в системе отсутсвуют пользователь видит сообщение "Введены неверные данные" и красное подчеркивание полей, пользователь имеет возможность нажать на Зарегестрироваться (сообщение об ошибке стоит улучшить?) -> если данные корректны редирект на /dashboard

2. Неавторизованный пользователь перешел на /sign-up -> Submit не доступен при пустых полях, пользователь может нажать на "условия договора оферты" (показать текст в модальном окне?), либо вернуться на логин  -> пользователь вводит данные, видит лейблы, кнопка активна, а система должна ответить проверкой совпадают ли пароли, не занят ли адрес, валиден ли адрес, не меньше ли 8 символов в пароле, если проверка не пройдена показать ошибку под конкретным полем (полями) (после нажатия на Submit), если успех редирект на /dashboard

3. Неавторизованный пользователь осознал что он был, зарегестрирован, но не помнит пароль (где в макете ссылка на страницу восстановления пароля?) попадает на /forgote-password -> видит форму, проходит все те же проверки на валидность, после успешного добавления email и нажатия Submit видит уведомление о проверке почты и кнопку Назад -> по клику на ссылку из email попадает на /reset-password -> система проверяет что пароль не меньше 8 символов и пароли совпадают -> по Submit уведомление что пароль был восстановлен и кнопка на /sign-in или уведомление что не был с двумя кнопками с редиректом на /sign-in и /forgote-password

1. **Sign In (Авторизация)**

Route: /sign-in
Доступ: guestOnly

- Начальное состояние
поля: email, password — пустые
submit: disabled
ошибок нет
есть ссылки:
/forgot-password
/sign-up

- Действия пользователя
ввод email
ввод password
submit

- Client validation
email:
обязательное
валидный формат
password:
обязательное

- Submit behavior
при submit:
если client validation не пройдена → показать ошибки под полями
если пройдена:
кнопка disabled
показывается loading
отправляется login

- Server responses
200 OK
сохранить accessToken, refreshToken
redirect → /dashboard
401
показать общую ошибку:
“Неверный email или пароль”
429
показать:
“Слишком много попыток. Попробуйте позже”
500 / network error
показать:
“Ошибка сервера. Попробуйте позже”

malformed response
fallback ошибка:
“Что-то пошло не так”
Поведение ошибок
field errors — под полями
general error — под формой
ошибки очищаются при новом submit
field error очищается при изменении поля

- Edge cases
повторный submit запрещен
при смене страницы запрос не должен ломать UI

2. **Sign Up (Регистрация)**

Route: /sign-up
Доступ: guestOnly

- Начальное состояние
поля:
email
password
confirmPassword
submit: disabled
ошибок нет

- Client validation
email:
обязательный
валидный формат
password:
минимум 8 символов
confirmPassword:
совпадает с password

- Submit behavior
если validation не пройдена → ошибки под полями
если пройдена:
кнопка disabled
loading
запрос register

- Server responses
200 OK
(вариант решения)
либо auto login → /dashboard
либо redirect → /sign-in
409 (email exists)
ошибка под email:
“Этот email уже зарегистрирован”
422 / validation error
ошибки под конкретными полями
429
“Слишком много попыток”
500 / network
общая ошибка
Поведение ошибок
field errors → под полями
server error → под формой
очищаются при изменении поля / новом submit

- Edge cases
двойной submit запрещен
password mismatch проверяется до запроса


3. **Forgot Password (Запрос сброса)**

Route: /forgot-password
Доступ: guestOnly

- Начальное состояние
поле: email
submit: disabled
есть кнопка “Назад” → /sign-in

- Client validation
email:
обязательный
валидный формат

- Submit behavior
если невалидно → ошибка под email
если валидно:
loading
disable submit
запрос requestPasswordReset

- Server responses
200 OK
показать success-state:
“Проверьте свою почту”
кнопка:
“Назад в авторизацию” → /sign-in
429
“Слишком много попыток”
500 / network
общая ошибка

- UI-состояния
default
loading
error
success (email sent)

- Edge cases
повторный submit запрещен

4. **Reset Password (Новый пароль)**

Route: /reset-password?token=...
Доступ: публичный

- Начальное состояние
читаем token из URL
если token отсутствует
показать invalid-state:
“Неверная ссылка”
кнопка → /forgot-password
если token есть
показать форму

- Поля
password
confirmPassword

- Client validation
password:
минимум 8 символов
confirmPassword:
совпадает

- Submit behavior
validation fail → ошибки под полями
validation ok:
loading
disable submit
запрос resetPassword(token, newPassword)

- Server responses
200 OK
success-state:
“Пароль был восстановлен”
кнопка:
/sign-in
400 / invalid token
fail-state:
“Ссылка недействительна или истекла”
кнопки:
“Попробовать заново” → /forgot-password
“Войти” → /sign-in
422
ошибки под полями
429
rate limit сообщение
500 / network
общая ошибка

- UI-состояния
default
validation error
loading
success
fail (invalid token)

- Edge cases
token просрочен
token уже использован
повторный submit запрещен

5. **Session behavior**
после login:
сохраняем токены в Pinia + localStorage
при reload:
восстанавливаем session из storage
logout:
очищаем session
redirect → /sign-in

## 6. Какие пропсы нужны и что умеют composables?

1. SignIn сущность

useSignIn: хранит - email, password, fieldErrors, generalError, isSubmitting / методы - validate(), submit(), resetErrors() / состояние - idle, validationError, submitting, serverError, success

SignInPage: компоненты и пропсы: 
IllustrationLayout, 
Logo, 
Form (onSubmit, slot), 
FormTextInput (modelValue, label, placeholder, type, error, disabled события update:modelValue), 
FormPasswordInput (modelValue, label, placeholder, error, disabled события update:modelValue), 
Button (variant, disabled, loading, type), 
HelperText (slot)

2. SignUp сущность

useSignUp: хранит - email, password, confirmPassword, fieldErrors, generalError, isSubmitting / методы - validate(), submit(), resetErrors() / состояние - idle, validationError, submitting, serverError, success

SignUpPage: компоненты и пропсы: 
IllustrationLayout, 
Logo, 
Form (onSubmit, slot), 
FormTextInput (modelValue, label, placeholder, type, error, disabled события update:modelValue), 
FormPasswordInput х 2 (modelValue, label, placeholder, error, disabled события update:modelValue), 
Button (variant, disabled, loading, type), 
HelperText (slot)

3. ForgotPassword сущность

useRequestPasswordReset: хранит - email, fieldErrors, generalError, isSubmitting, status / методы - validate(), submit(), resetErrors() 

ForgotPasswordPage рендерит два состояния - status === 'form' (BackButton, Form, FormTextInput, Button) || status = 'success' (AuthStatus)

4. ResetPassword сущность

useResetPassword: хранит - token, password, confirmPassword, fieldErrors, generalError, isSubmitting, status / методы initFromRoute(tokenFromQuery), validate(), submit(), resetErrors()

type ResetPasswordStatus =
  | 'invalid-link'
  | 'form'
  | 'success'
  | 'fail'

ResetPasswordPage рендерит четыре состояния в зависимости от статуса

Примерная структура

src/
  app/
    main.ts
    router/
      index.ts
      guards.ts

  pages/
    SignInPage.vue
    SignUpPage.vue
    ForgotPasswordPage.vue
    ResetPasswordPage.vue
    DashboardPage.vue
    NotFoundPage.vue

  composables/
    useSignIn.ts
    useSignUp.ts
    useRequestPasswordReset.ts
    useResetPassword.ts

  stores/
    sessionStore.ts

  shared/
    api/
      httpClient.ts
      types.ts

    auth/
      authApi.ts
      auth.types.ts
      convertFieldName.ts
      normalizeAuthError.ts

    ui/
      base/
        Button.vue
        BackButton.vue
        HelperText.vue
        Logo.vue

      form/
        Form.vue
        FormTextInput.vue
        FormPasswordInput.vue
        AuthStatus.vue

      layout/
        SimpleLayout.vue
        IllustrationLayout.vue

## 7. Что покрываем тестами?

Unit тесты (для маленьких и важных функций)

- normalizeAuthError
- convertFieldName
- getResetTokenFromQuery
- клиентские функции валидации полей

Integration тесты (для пользовательских сценариев)

Sign In
успешный логин → редирект на /dashboard
401 → показать “Неверный email или пароль”
submit disabled при пустых полях
во время submit кнопка disabled / loading

- Sign Up
успешная регистрация
409 email exists → ошибка под email или общая ошибка
client validation:
невалидный email
пароль < 8
пароли не совпадают

- Forgot Password
успешная отправка → success-state “Проверьте почту”
невалидный email → ошибка под полем
server error / network error → general error

- Reset Password
token есть → форма показывается
token отсутствует → invalid-state
успешный reset → success-state
invalid/expired token → fail-state
пароль < 8
пароли не совпадают

- Route guards
неавторизованный пользователь на /dashboard → редирект на /sign-in
авторизованный пользователь на /sign-in → редирект на /dashboard

**Edge Cases**
двойной submit блокируется
server error не ломает форму
ошибка очищается при новой попытке
invalid token в reset flow
отсутствие token в URL
malformed response → fallback error