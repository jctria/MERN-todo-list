import axios from 'axios';
import { 
    GET_TODOS, 
    GET_TODO, 
    ADD_TODO, 
    DELETE_TODO, 
    UPDATE_TODO, 
    TODOS_LOADING, 
    SET_VIEW_TYPE, 
    SET_SORT_BY 
} from './types';
import { returnErrors } from './errorActions';

export const getTodos = (userId) => async (dispatch) => {
    dispatch(setTodosLoading());
    try {
        const res = await axios.get(`/api/todos/user/${userId}`);
        dispatch({
            type: GET_TODOS,
            payload: res.data
        });
    } catch (err) {
        dispatch(returnErrors(err.response.data, err.response.status));
    }
}

export const getTodo = (id) => async (dispatch) => {
    dispatch(setTodosLoading());
    try {
        const res = await axios.get(`/api/todos/${id}`);
        dispatch({
            type: GET_TODO,
            payload: res.data
        });
    } catch (err) {
        dispatch(returnErrors(err.response.data, err.response.status));
    }
}

export const addTodo = (todo) => async (dispatch) => {
    try {
        const res = await axios.post(`/api/todos/${todo.userId}`, todo);
        dispatch({
            type: ADD_TODO,
            payload: res.data
        });
        dispatch(setViewType('list'));
    } catch (err) {
        dispatch(returnErrors(err.response.data, err.response.status));
    }
}

export const deleteTodo = (id) => async (dispatch) => {
    try {
        await axios.delete(`/api/todos/${id}`);
        dispatch({
            type: DELETE_TODO,
            payload: id
        });
    } catch (err) {
        dispatch(returnErrors(err.response.data, err.response.status));
    }
}

export const updateTodo = (id, todo) => async (dispatch) => {
    try {
        const res = await axios.put(`/api/todos/${id}`, todo);
        dispatch({
            type: UPDATE_TODO,
            payload: res.data
        });
    } catch (err) {
        dispatch(returnErrors(err.response.data, err.response.status));
    }
}

export const setViewType = (viewType) => {
    localStorage.setItem('viewType', viewType); // Save viewType to localStorage
    return {
        type: SET_VIEW_TYPE,
        payload: viewType,
    };
}

export const setSortBy = (sortBy) => {
    localStorage.setItem('sortBy', sortBy); // Save sortBy to localStorage
    return {
        type: SET_SORT_BY,
        payload: sortBy,
    };
}

export const setTodosLoading = () => {
    return {
        type: TODOS_LOADING
    }
}