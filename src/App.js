import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from './components/authComponents/Signup';
import Login from './components/authComponents/Login';
import {BrowserRouter as Rounter, Routes,Route} from 'react-router-dom';
import CreateTodoList from './components/appComponents/CreateTodoList';
import List from './components/appComponents/List';

function App() {
  return (
    <Rounter>
      <Routes>
        <Route path="/" element={<Signup/>}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/create' element={<CreateTodoList/>}/>
        <Route path='/list' element={<List/>}/>
      </Routes>
    </Rounter>
  );
}

export default App;
