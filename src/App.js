import React, { useState, useEffect } from 'react';
import socketio from 'socket.io-client';
import './App.css';

const App = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [value, setValue] = useState('');
  const [socket] = useState(() => socketio('http://diffusedhermit.com:8000'));

  useEffect(() => {
    socket.on('shopping-list-update', (newItems) => {
      setItems(newItems);
    });
    socket.on('complete_item_test', (item) => {
      setItems(item)
    });
    socket.on('clear_items', (items) => {
      setItems(items);
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
    socket.emit('complete_item', item);
    };
  const handleClear = () => {
      socket.emit('clear_items', items);
      };

  return (
    <div className='shopping-list-main'>
      <h1>Shopping List</h1>
      <div className='shopping-list'>
      <button class="clear-button" onClick={() => handleClear(items)}>Clear</button>
        <ul>
        {items.map((item) => (
          <li key={item.name}
          onClick={() => handleComplete(item)} className={item.completed ? "shopping-list-item-completed" : "none"}>{item.name}</li>
        ))}
      </ul>
      </div>
      <div className="shopping-list-input-container">
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
    </div>
  );
};

export default App;