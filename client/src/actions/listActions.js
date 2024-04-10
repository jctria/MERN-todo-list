import axios from 'axios';
import {
    GET_LISTS,
    GET_LIST,
    ADD_LIST,
    DELETE_LIST,
    UPDATE_LIST,
    SET_CURRENT_LIST,
    CLEAR_CURRENT_LIST,
    LISTS_LOADING,
    GET_TODOS
} from './types';
import { returnErrors } from './errorActions';
import { getTodos, setViewType } from './todoActions';


export const getLists = (userId) => async (dispatch) => {
    dispatch(setListsLoading());
    try {
        const res = await axios.get(`/api/lists/user/${userId}`);
        dispatch({
            type: GET_LISTS,
            payload: res.data
        });
    } catch (err) {
        dispatch(returnErrors(err.response.data, err.response.status));
    }
}

export const getList = (id) => async (dispatch) => {
    dispatch(setListsLoading());
    try {
        const res = await axios.get(`/api/lists/${id}`);
        dispatch({
            type: GET_LIST,
            payload: res.data
        });
    } catch (err) {
        dispatch(returnErrors(err.response.data, err.response.status));
    }
}

export const addList = (list) => async (dispatch) => {
    try {
        const res = await axios.post(`/api/lists/${list.userId}`, list);
        dispatch({
            type: ADD_LIST,
            payload: res.data
        });
        // Set the newly added list as the current list both in Redux and localStorage
        dispatch(setCurrentList({
            id: res.data._id, 
            name: res.data.listName 
        }));
        dispatch(setViewType('list'));
    } catch (err) {
        dispatch(returnErrors(err.response.data, err.response.status));
    }
}

export const deleteList = (id) => async (dispatch, getState) => {
    try {
        await axios.delete(`/api/lists/${id}`);
        dispatch({
            type: DELETE_LIST,
            payload: id
        });

        // Delete todos associated with this list from the frontend state
        const todos = getState().todo.todos.filter(todo => todo.listId !== id);
        dispatch({
            type: GET_TODOS, 
            payload: todos 
        });

        // Get updated lists from the state
        const updatedLists = getState().list.lists.filter(list => list._id !== id);

        // Set the last list as the current list
        if (updatedLists.length > 0) {
            const lastList = updatedLists[updatedLists.length - 1]; 
            dispatch(setCurrentList({
                id: lastList._id,
                name: lastList.listName
            }));
        } 
    } catch (err) {
        dispatch(returnErrors(err.response.data, err.response.status));
    }
}

export const updateList = (id, list) => async (dispatch) => {
    try {
        const res = await axios.put(`/api/lists/${id}`, list);
        dispatch({
            type: UPDATE_LIST,
            payload: res.data
        });
        dispatch(setCurrentList({ 
            id: res.data._id, 
            name: res.data.listName 
        }));
    } catch (err) {
        dispatch(returnErrors(err.response.data, err.response.status));
    }
}
export const setCurrentList = (currentList) => (dispatch, getState) => {
    localStorage.setItem('currentList', JSON.stringify(currentList)); // Save currentList to localStorage
    dispatch({
        type: SET_CURRENT_LIST,
        payload: currentList,
    });
    const userId = getState().auth.user._id; // Get the userId from state
    if (currentList.id && userId) {
        dispatch(getTodos(userId, currentList.id));
    }
}

export const clearCurrentList = () => {
    return {
        type: CLEAR_CURRENT_LIST
    }
}

export const fetchAndSetFirstListAsCurrent = (userId) => async (dispatch, getState) => {
    const currentList = getState().list.currentList;

    // Set the first list as the current list only if currentList is null
    if (!currentList.id) {
        try {
            const res = await axios.get(`/api/lists/user/${userId}`);
            const lists = res.data;
            if (lists && lists.length > 0) {
                const firstList = lists[0];
                dispatch(setCurrentList({
                    id: firstList._id,
                    name: firstList.listName
                }));
            }
        } catch (err) {
            dispatch(returnErrors(err.response.data, err.response.status));
        }
    }
};

export const setListsLoading = () => {
    return {
        type: LISTS_LOADING
    }
}