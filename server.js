м запрос

 proxy.web(req, res, { target: req.url, secure: false }, (err) => {

  res.writeHead(500);

  res.end('Proxy Error');

 });

});



// Поддержка HTTPS CONNECT

server.on('connect', (req, clientSocket, head) => {

 const auth = req.headers['proxy-authorization'];

 if (!auth || auth !== 'Basic ' + Buffer.from('user:password').toString('base64')) {

  clientSocket.write('HTTP/1.1 407 Proxy Authentication Required\r\nProxy-Authenticate: Basic realm="Proxy"\r\n\r\n');

  clientSocket.end();

  return;

 }



 const { port, hostname } = new URL(`http://${req.url}`);

 const serverSocket = require('net').connect(port || 443, hostname, () => {

  clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');

  serverSocket.write(head);

  serverSocket.pipe(clientSocket);

  clientSocket.pipe(serverSocket);

 });



 serverSocket.on('error', () => clientSocket.end());

 clientSocket.on('error', () => serverSocket.end());

});



server.listen(port, () => {

 console.log(`Proxy server is running on port ${port}`);

});
