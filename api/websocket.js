const WebSocket = require('ws');

  module.exports = (req, res) => {
    if (!req.headers['upgrade'] || req.headers['upgrade'].toLowerCase() !== 'websocket') {
      res.status(400).send('Expected a WebSocket connection');
      return;
    }

    const wss = new WebSocket.Server({ noServer: true });

    req.on('upgrade', (request, socket, head) => {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    });

    wss.on('connection', (ws) => {
      console.log('Client connected');

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          if (data.type === 'screenshot') {
            console.log('Received screenshot, size:', data.data.length);
            ws.send('OK'); // Gửi ký tự phản hồi
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

    res.status(200).end();
  };