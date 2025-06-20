const WebSocket = require('ws');
const { parse } = require('url');

const wss = new WebSocket.Server({ port: 8080 });

let overlaySocket = null;

wss.on('connection', function connection(ws, req) {
  const pathname = parse(req.url).pathname;

  if (pathname === '/overlay') {
    overlaySocket = ws;
    console.log('Overlay connected');
  } else if (pathname === '/control') {
    console.log('Control panel connected');

    ws.on('message', function incoming(message) {
      console.log('Control sent:', message.toString());
      if (overlaySocket && overlaySocket.readyState === WebSocket.OPEN) {
        overlaySocket.send(message.toString());
      }
    });
  } else {
    console.log(`Unknown route: ${pathname}`);
    ws.close();
  }
});

console.log('WebSocket server running on ws://localhost:8080');
