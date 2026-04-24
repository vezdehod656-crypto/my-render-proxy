const ProxyChain = require('proxy-chain');

const PROXY_USERNAME = 'user';
const PROXY_PASSWORD = 'password';

const port = process.env.PORT || 8080;
const server = new ProxyChain.Server({
    host: '0.0.0.0',
    port: port,
    verbose: true,
    prepareRequestFunction: ({ username, password }) => {
        if (username === PROXY_USERNAME && password === PROXY_PASSWORD) {
            return { upstreamProxyUrl: null };
        }
        return {
            requestAuthentication: true,
            upstreamProxyUrl: null,
            failMsg: 'Auth failed'
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

// ===== ДОБАВЛЯЕМ ОБРАБОТЧИК ДЛЯ /ping (чтобы сервер не засыпал) =====
server.on('request', (req, res) => {
    if (req.url === '/ping') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('pong');
    }
});
