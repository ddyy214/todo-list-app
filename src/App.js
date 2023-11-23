import './App.css';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
<<<<<<< HEAD
const firebaseConfig = {
  apiKey: process.env.REACT_APP_apikey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
  measurementId: process.env.REACT_APP_measurementId
};
=======
>>>>>>> 355c39c19c2325ca7708cf155cc20d15f400540f

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
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
    <Button variant="outlined" onClick={() => props.onRemoveClick(props.todoItem)}>Remove</Button> {/*삭제버튼*/}
  </li>);
}
const TodoItemList = (props) => {
  const todoList = props.todoItemList.map((todoItem, index) => {
    // return <li key={index}>{todoItem.todoItemContent}</li>;
    return <TodoItem                                            //여기서
      key={todoItem.id} 
      todoItem={todoItem} 
      onTodoItemClick={props.onTodoItemClick}
      onRemoveClick={props.onRemoveClick}/>;      //onRemoveClick 로직만들어줘랏
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

  const onRemoveClick= (removedTodoItem) => {
    setTodoItemList(todoItemList.filter((todoItem)=> {
      return todoItem.id !== removedTodoItem.id;
    }));
  };

  return (
    <div className="App">
      {/* <TodoItemInputField/> */}
      <TodoItemInputField onSubmit={onSubmit} />
      {/* <TodoItemList todoItemList={[]} /> */}
      <TodoItemList 
        todoItemList={todoItemList} 
        onTodoItemClick={onTodoItemClick}
        onRemoveClick={onRemoveClick}
        />
    </div>
  );
}

export default App;
