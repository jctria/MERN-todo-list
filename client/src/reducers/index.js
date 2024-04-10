import { combineReducers } from 'redux';
import todoReducer from './todoReducer';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import listReducer from './listReducer';

const rootReducer = combineReducers({
    todo: todoReducer,
    error: errorReducer,
    auth: authReducer,
    list: listReducer
})

export default rootReducer;