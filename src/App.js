import './App.css';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const TodoItemInputField = (props) => {
  const [input, setInput] = useState("");
  const onSubmit = () => {
    props.onSubmit(input);
    setInput("");
  };
  return (
  <div>
    <TextField
      id="todo-item-input"
      label="Todo Item"
      variant="outlined"
      value={input}
      onChange={(e) => setInput(e.target.value)}
    />
    {/* <Button variant="outlined">Submit</Button> */}
    <Button variant="outlined" onClick={onSubmit}>Submit</Button>  
  </div>);
};
const TodoItemList = (props) => {
  const todoList = props.todoItemList.map((todoItem, index) => {
    return <li key={index}>{todoItem.todoItemContent}</li>;
  });
  return (<div>
    <ul>{todoList}</ul>
  </div>);
};

let todoItemId = 0;

function App() {
  const [todoItemList, setTodoItemList] = useState([]);

  const onSubmit = (newTodoItem) => {
    setTodoItemList([...todoItemList, {
      id: todoItemId++,
      todoItemContent: newTodoItem,
      isFinished: false,
    }]);
  };
  return (
    <div className="App">
      {/* <TodoItemInputField/> */}
      <TodoItemInputField onSubmit={onSubmit} />
      {/* <TodoItemList todoItemList={[]} /> */}
      <TodoItemList todoItemList={todoItemList} />
    </div>
  );
}

export default App;
