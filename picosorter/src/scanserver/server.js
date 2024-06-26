const express = require('express');
const next = require('next');
const http = require('http');
const socketIo = require('socket.io');
const { Server } = socketIo;

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:3000',
      credentials: true
    }
  })

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('message', (msg) => {
      console.log('Message received:', msg);

      // check device connection message and respond
      if(msg.includes("Hello from ")){
        io.emit('message', "Hello from server");
      }
    });

    // listen for barcodes
    socket.on('barcode', (barcode) => {
      console.log('Barcode received:', barcode);

      io.emit('barcode', barcode);
    });

    // listen for images
    socket.on('image', (image) => {
      console.log('Image received:', image);

      io.emit('image', image);
    });

    // listen for disconnection 
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
