// Подключаем библиотеку
const ProxyChain = require('proxy-chain');

// --- НАСТРОЙКИ АВТОРИЗАЦИИ (Меняем тут) ---
// Ставим свой логин и пароль вместо 'user' и 'password'
const PROXY_USERNAME = 'user';
const PROXY_PASSWORD = 'password';
// -----------------------------------------

// Render передает порт через переменную окружения PORT. ОБЯЗАТЕЛЬНО используем её.
const port = process.env.PORT || 8080;

// Создаем сервер
const server = new ProxyChain.Server({
    // Слушаем на всех интерфейсах (0.0.0.0), иначе Render не увидит сервер[citation:4]
    host: '0.0.0.0',
    port: port,
    verbose: true, // Хорошо для логов, чтобы видеть подключения

    // Функция проверки логина и пароля
    prepareRequestFunction: ({ username, password }) => {
        return {
            // Если не совпадают с нашими данными — запрашиваем авторизацию
            requestAuthentication: username !== PROXY_USERNAME || password !== PROXY_PASSWORD,
            // Отправляем трафик напрямую (без цепочки других прокси)
            upstreamProxyUrl: null,
            // Сообщение об ошибке (опционально)
            failMsg: 'Auth failed: wrong login or password'
        };
    }
});

// Запускаем сервер
server.listen(() => {
    console.log(`✅ Proxy server is running on 0.0.0.0:${port}`);
    console.log(`🔐 Auth: ${PROXY_USERNAME}:${PROXY_PASSWORD}`);
});

// Обработка ошибок, чтобы сервер не падал
server.on('error', (err) => {
    console.error('Proxy error:', err);
});
