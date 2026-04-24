const ProxyChain = require('proxy-chain');

// === МЕНЯЙТЕ ЛОГИН И ПАРОЛЬ ЗДЕСЬ ===
const PROXY_USERNAME = 'user';
const PROXY_PASSWORD = 'password';
// ===================================

const port = process.env.PORT || 8080;

const server = new ProxyChain.Server({
    host: '0.0.0.0',
    port: port,
    verbose: true,

    prepareRequestFunction: ({ username, password }) => {
        return {
            requestAuthentication: username !== PROXY_USERNAME || password !== PROXY_PASSWORD,
            upstreamProxyUrl: null,
            failMsg: 'Auth failed: wrong login or password'
        };
    }
});

server.listen(() => {
    console.log(`✅ Proxy running on port ${port}`);
    console.log(`🔐 Login: ${PROXY_USERNAME}, Password: ${PROXY_PASSWORD}`);
});

server.on('error', (err) => {
    console.error('Proxy error:', err);
});
