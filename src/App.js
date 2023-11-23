import './App.css';
import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, setDoc, doc, deleteDoc, getDocs } from "firebase/firestore";


const firebaseConfig = {
  apiKey: process.env.REACT_APP_apikey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
  measurementId: process.env.REACT_APP_measurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
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


function App() {
  const [todoItemList, setTodoItemList] = useState([]);

  useEffect(() => {
    getDocs(collection(db, "todoItem")).then((querySnapshot) => {
      const firestoreTodoItemList = [];
      querySnapshot.forEach((doc) => {
        firestoreTodoItemList.push({
          id: doc.id,
          todoItemContent: doc.data().todoItemContent,
          isFinished: doc.data().isFinished,
        });
      });
    setTodoItemList(firestoreTodoItemList);
  });
}, []);
  // const onSubmit = (newTodoItem) => {
    const onSubmit = async (newTodoItem) => {
      const docRef = await addDoc(collection(db, "todoItem"), {
        todoItemContent: newTodoItem,
        isFinished: false,
      });
    
      setTodoItemList([...todoItemList, {
        // id: todoItemId++,
        id: docRef.id,
        todoItemContent: newTodoItem,
        isFinished: false,
    }]);
  };

  //실제 바뀌는건 여기서 일어남
  const onTodoItemClick = async (clickedTodoItem) => {
    const todoItemRef = doc(db, "todoItem", clickedTodoItem.id);
    await setDoc(todoItemRef, { isFinished: !clickedTodoItem.isFinished }, { merge: true });

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

  const onRemoveClick= async (removedTodoItem) => {
    const todoItemRef = doc(db, "todoItem", removedTodoItem.id);
    await deleteDoc(todoItemRef);
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
