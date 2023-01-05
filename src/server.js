const express = require('express');
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.Server(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
  }
});


let items = [];
io.on('connection', (socket) => {
  socket.emit('shopping-list-update', items);

  socket.on('add-shopping-list-item', (item) => {
    let itemId = 0;
    if (items.length === 0){
      itemId = 0;
    } else {
      itemId = items[items.length - 1].id + 1;
    }
    items.push({id:itemId, name: item, completed: false});
    io.emit('shopping-list-update', items);
  });
  socket.on('complete_item', (item) => {
    items.map((i) => {
      if (i.id === item.id) {
          i.completed = !i.completed;
      }
    });
    io.emit('complete_item_test', items);
  });
//Handle clearing of items
  socket.on('clear_items', (item) => {
    items = [];
    io.emit('complete_item_test', items);
  });
});
server.listen(8000, () => {
  console.log('listening on *:8000');
});
