const WebSocket = require('ws');

  export default (req, res) => {
    // Kiểm tra yêu cầu WebSocket
    if (req.headers['upgrade'] !== 'websocket') {
      res.status(400).send('Expected a WebSocket connection');
      return;
    }

    // Tạo WebSocket server
    const wss = new WebSocket.Server({ noServer: true });

    // Xử lý upgrade từ HTTP sang WebSocket
    req.on('upgrade', (request, socket, head) => {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    });

    wss.on('connection', (ws) => {
      console.log('Client connected');

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message.toString());
          if (data.type === 'screenshot') {
            console.log('Received screenshot, size:', data.data.length);
            ws.send('OK');
          }
        } catch (error) {
          console.error('Error parsing message:', error);
          ws.send('ERROR');
        }
      });

      ws.on('close', () => {
        console.log('Client disconnected');
      });
    });

    // Vercel yêu cầu trả về HTTP response
    res.status(200).end();
  };