import React, { useState, useEffect } from 'react';
import socketio from 'socket.io-client';
import './App.css';

const App = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [value, setValue] = useState('');
  const [socket] = useState(() => socketio('http://localhost:8000'));

  useEffect(() => {
    socket.on('shopping-list-update', (newItems) => {
      setItems(newItems);
    });
    socket.on('complete_item_test', (item) => {
      console.log('complete item', item, "check emit complete item");
      setItems(item)
    });
    return () => {
      socket.off('shopping-list-update');
    };
  }, [socket]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!newItem) return;
    socket.emit('add-shopping-list-item', newItem);
    setNewItem('');
  };
  const handleComplete = (item) => {
    console.log('complete item', item);
    socket.emit('complete_item', item);
      //socket.emit(JSON.stringify({ type: 'complete_item', value: item }));
    };

  return (
    <div>
      <h1>Shopping List</h1>
      <div className='shopping-list'><ul>
        {items.map((item) => (
          <li key={item.name}
          onClick={() => handleComplete(item)} style={{ textDecoration: item.completed ? 'line-through' : 'none', color: item.completed ? 'green' : 'inherit' }}>{item.name}</li>
        ))}
      </ul>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          className='shopping-list-input'
          type="text"
          value={newItem}
          onChange={(event) => setNewItem(event.target.value)}
        />
        <button className='add-button' type="submit">Add Item</button>
      </form>
    </div>
  );
};

export default App;