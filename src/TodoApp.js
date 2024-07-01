import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { List, ListItem, ListItemText, Checkbox, Button, TextField } from '@mui/material';


function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    document.title = "Mifth's To-Do";
  }, []); // This effect runs only once after the initial render

  // Fetch todos from the API when the component mounts
useEffect(() => {
  axios.get('/todos')
    .then(response => {
      // Check if response.data is an array, if not set todos to an empty array
      const todosData = Array.isArray(response.data) ? response.data : [];
      setTodos(todosData);
    })
    .catch(error => {
      console.error('There was an error fetching the todos:', error);
      // Set todos to an empty array in case of error
      setTodos([]);
    });
}, []);

  const addTodo = (event) => {
    event.preventDefault();
    if (!newTodo.trim()) return;
    const newTodoItem = {
      name: newTodo,
      completed: false,
    };
    axios.post('/todos', newTodoItem)
      .then(response => {
        setTodos([...todos, response.data]);
        setNewTodo('');
      })
      .catch(error => console.error('There was an error adding the todo:', error));
  };

function toggleTodoCompletion(todoId) {
  // First, calculate the new todos state to ensure we have the updated completed status
  const updatedTodos = todos.map(todo => {
    if (todo.id === todoId) {
      // Calculate the new completed status
      const newCompletedStatus = !todo.completed;
      // Immediately return the updated todo object
      return { ...todo, completed: newCompletedStatus };
    }
    return todo;
  });
  const showMessage = (msg) => {
    setMessage(msg);
    // Optionally, clear the message after a few seconds
    setTimeout(() => setMessage(''), 3000);
  };

  // Then, set the state with the updated todos
  setTodos(updatedTodos);

  // Find the updated todo to get the correct completed status
  const updatedTodo = updatedTodos.find(todo => todo.id === todoId);

  // Ensure updatedTodo is defined before attempting to access its properties
  if (updatedTodo) {
    axios.put(`/todos/${todoId}`, { name: updatedTodo.name, completed: updatedTodo.completed})
.then(response => {
    // Call the showMessage method to display success message
    showMessage('Todo updated successfully');
})
.catch(error => {
    console.error('There was an error updating the todo:', error);
});
  }
}

  return (
    <div style={{ maxWidth: '500px', margin: 'auto' }}>
      <h1>Mifth's ToDo List</h1>
      {message && <div style={{ marginBottom: '10px' }}>{message}</div>}
      <form onSubmit={addTodo} style={{ display: 'flex', gap: '10px' }}>
  <TextField
    label="Add new todo"
    size="small"
    value={newTodo}
    onChange={(e) => setNewTodo(e.target.value)}
    fullWidth
  />
  <Button
    type="submit"
    variant="contained"
    style={{ backgroundColor: '#fff', color: '#333', boxShadow: '0px 3px 5px rgba(0,0,0,0.2)' }} // White button with shadow
  >
    Add
  </Button>
</form>
      <List>
        {todos.map((todo) => (
          <ListItem
            key={todo.id}
            secondaryAction={
              <Checkbox
                edge="end"
                onChange={() => toggleTodoCompletion(todo.id, !todo.completed)}
                checked={todo.completed}
              />
            }
          >
            <ListItemText
              primary={todo.name}
              style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default TodoApp;