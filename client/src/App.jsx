import { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import store from './store';
import { loadUser } from './actions/authActions';
import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';
import EditTodo from './components/EditTodo';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AddList from './components/AddList';
import EditList from './components/EditList';

class App extends Component {
    componentDidMount(){
        store.dispatch(loadUser());
    }
    render(){
        return ( 
            <Provider store={store}>
                <BrowserRouter>
                    <div className='App'>
                        <Routes>
                            <Route path='/todos' element={<TodoList />} />
                            <Route path='/add-todo' element={<AddTodo />} />
                            <Route path='/todos/:id/edit' element={<EditTodo />} />
                            <Route path='/login' element={<Login />} />
                            <Route path='/register' element={<Register />} />
                            <Route path='/add-list' element={<AddList />} />
                            <Route path='/lists/:id/edit' element={<EditList />} />
                        </Routes>
                    </div> 
                </BrowserRouter>
            </Provider> 
        );
    }t
}

export default App;
