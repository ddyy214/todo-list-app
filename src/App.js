import './App.css';
import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import DeleteIcon from '@mui/icons-material/Delete';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

import backgroundImage from './img/snoopy_spoon.png';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, setDoc, doc, deleteDoc, getDocs, query, orderBy, where, } from "firebase/firestore";
import { GoogleAuthProvider, getAuth, signInWithRedirect, onAuthStateChanged, signOut, } from "firebase/auth";


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

const provider = new GoogleAuthProvider();
const auth = getAuth(app);

const TodoItemInputField = (props) => {
  const [input, setInput] = useState("");
  const onSubmit = () => {
    props.onSubmit(input);
    setInput("");
  };
  return (
    <Box sx={{margin: "auto"}}>
      <Stack direction="row" spacing={2} justifyContent="center">
        <TextField
          id="todo-item-input"
          label="Todo Item"
          variant="outlined"
          onChange={(e) => setInput(e.target.value)} value = {input}
        />
        <Button variant="outlined" onClick={onSubmit}>Submit</Button>  
      </Stack>
    </Box>
  );
};

const TodoItem = (props) => {
  const style = props.todoItem.isFinished ? { textDecoration: 'line-through' } : {}; //할일종료표시 > Finished 를 처리해줘야한다. 어디서?
  // return (<li>
  //   <span
  //     style={style}
  //     onClick={() => props.onTodoItemClick(props.todoItem)}
  //   >
  //     {props.todoItem.todoItemContent}
  //   </span>
  //   <Button variant="outlined" onClick={() => props.onRemoveClick(props.todoItem)}>Remove</Button> {/*삭제버튼*/}
  // </li>);
  return (
        <ListItem secondaryAction={
         <IconButton edge="end" aria-label="comments" onClick={() => props.onRemoveClick(props.todoItem)}>
            <DeleteIcon />
          </IconButton>
        }>
          <ListItemButton role={undefined} onClick={() => props.onTodoItemClick(props.todoItem)} dense>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={props.todoItem.isFinished}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText style={style} primary={props.todoItem.todoItemContent} />
          </ListItemButton>
        </ListItem>
        );
}
const TodoItemList = (props) => {
  const todoList = props.todoItemList.map((todoItem, index) => {
    // return <li key={index}>{todoItem.todoItemContent}</li>;
    return <TodoItem                                            //여기서
      key={index} 
      todoItem={todoItem} 
      onTodoItemClick={props.onTodoItemClick}
      onRemoveClick={props.onRemoveClick}/>;      //onRemoveClick 로직만들어줘랏
  });
  // return (<div>
  //   <ul>{todoList}</ul>
  // </div>);
  return (
    <Box>
      <List sx={{margin: "auto", maxwidth: 720}}>
        {todoList}
      </List>
    </Box>
  )
};

const TodoListAppBar = (props) => {
  const loginWithGoogleButton = (
    <Button color="inherit" onClick={() => {
      signInWithRedirect(auth, provider);
    }}>Login with Google</Button>
  );
  const logoutButton = (
    <Button color="inherit" onClick={() => {
      signOut(auth);
    }}>Log out</Button>
  );
  const button = props.currentUser === null ? loginWithGoogleButton : logoutButton;
  return (
    <AppBar position="static">
      <Toolbar sx={{ width: "100%", maxWidth: 720, margin: "auto", justifyContent: "center", paddingY: 1}}>
        <Typography variant="h5" component="div">
          Todo List App
        </Typography>
       
        {/* <Button color="inherint">Log In</Button> */}
        <Box sx={{flexGrow: 1}} />
        {button}
      </Toolbar>
    </AppBar>
  )
  
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [todoItemList, setTodoItemList] = useState([]);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurrentUser(user.uid);
    } else {
      setCurrentUser(null);
    }
  })

  // useEffect(() => {
  const syncTodoItemListStateWithFirestore = () => {
    // const q = query(collection(db, "todoItem"), orderBy("createdTime", "desc"));
    const q = query(collection(db, "todoItem"), where("userId", "==", currentUser), orderBy("createdTime", "desc"));
    getDocs(q).then((querySnapshot) => {
      const firestoreTodoItemList = [];
      querySnapshot.forEach((doc) => {
        firestoreTodoItemList.push({
          id: doc.id,
          todoItemContent: doc.data().todoItemContent,
          isFinished: doc.data().isFinished,
          createdTime: doc.data().createdTime ?? 0,
          userId: doc.data().userId,
        });
      });
    setTodoItemList(firestoreTodoItemList);
  });
};

useEffect(() => {
  syncTodoItemListStateWithFirestore();
}, [currentUser]);
// const onSubmit = (newTodoItem) => {
const onSubmit = async (newTodoItem) => {
  // const docRef = await addDoc(collection(db, "todoItem"), {
  await addDoc(collection(db, "todoItem"), {
    todoItemContent: newTodoItem,
    isFinished: false,
    createdTime: Math.floor(Date.now() / 1000),
    userId: currentUser,
  });
  syncTodoItemListStateWithFirestore();
};

  //실제 바뀌는건 여기서 일어남
  const onTodoItemClick = async (clickedTodoItem) => {
    const todoItemRef = doc(db, "todoItem", clickedTodoItem.id);
    await setDoc(todoItemRef, { isFinished: !clickedTodoItem.isFinished }, { merge: true });
    syncTodoItemListStateWithFirestore();
  
  };

  const onRemoveClick= async (removedTodoItem) => {
    const todoItemRef = doc(db, "todoItem", removedTodoItem.id);
    await deleteDoc(todoItemRef);
    syncTodoItemListStateWithFirestore();
  };

  

  return (
    <ThemeProvider theme={theme}>
    <CssBaseline />
      <TodoListAppBar currentUser={currentUser} />
      <Container sx={{paddingTop: 3}}>
        <TodoItemInputField onSubmit={onSubmit} />
        <TodoItemList
          todoItemList={todoItemList}
          onTodoItemClick={onTodoItemClick}
          onRemoveClick={onRemoveClick}
        />
      </Container>
    <div
        className="App"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          minHeight: '70vh',
        }}
      >
     </div>
      </ThemeProvider>
   );
 }
 
 export default App;
