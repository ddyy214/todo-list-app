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

const TodoItem = (props) => {
  const style = props.todoItem.isFinished ? { textDecoration: 'line-through' } : {}; //할일종료표시 > Finished 를 처리해줘야한다. 어디서?
  return (<li>
    {/* <span>{props.todoItem.todoItemContent}</span> */}
    <span
      style={style}
      onClick={() => props.onTodoItemClick(props.todoItem)}
    >
      {props.todoItem.todoItemContent}
    </span>
  </li>);
}
const TodoItemList = (props) => {
  const todoList = props.todoItemList.map((todoItem, index) => {
    // return <li key={index}>{todoItem.todoItemContent}</li>;
    return <TodoItem key={todoItem.id} todoItem={todoItem} onTodoItemClick={props.onTodoItemClick}/>; //여기서
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

  //실제 바뀌는건 여기서 일어남
  const onTodoItemClick = (clickedTodoItem) => {
    setTodoItemList(todoItemList.map((todoItem) => {
      if (clickedTodoItem.id === todoItem.id) {
        return {
          id: clickedTodoItem.id,
          todoItemContent: clickedTodoItem.todoItemContent,
          isFinished: !clickedTodoItem.isFinished,
        };
      } else {
        return todoItem;
      }
    }))
  }
  return (
    <div className="App">
      {/* <TodoItemInputField/> */}
      <TodoItemInputField onSubmit={onSubmit} />
      {/* <TodoItemList todoItemList={[]} /> */}
      <TodoItemList todoItemList={todoItemList} onTodoItemClick={onTodoItemClick}/>
    </div>
  );
}

export default App;
