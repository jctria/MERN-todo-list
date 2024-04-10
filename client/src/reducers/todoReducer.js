import { 
    GET_TODOS, 
    GET_TODO, 
    ADD_TODO, 
    UPDATE_TODO, 
    DELETE_TODO, 
    TODOS_LOADING, 
    SET_VIEW_TYPE, 
    SET_SORT_BY 
} from '../actions/types';

const initialState = {
    todos: [],
    todo: {},
    viewType: 'list',
    sortBy: 'creationDate',
    loading: false
}

export default function(state=initialState, action) {
    switch(action.type) {
        case GET_TODOS:
            return {
                ...state,
                todos: action.payload,
                loading: false
            }

        case GET_TODO:
            return {
                ...state,
                todo: action.payload,
                loading: false
            }
        
        case ADD_TODO:
            return {
                ...state,
                todos: [...state.todos, action.payload]
            }
        
        case DELETE_TODO:
            return {
                ...state,
                todos: state.todos.filter(todo => todo._id!==action.payload)                
            };
        
        case UPDATE_TODO:
            return {
                ...state,
                todos: state.todos.map(todo => {
                    if (todo._id === action.payload._id) {
                        return action.payload; 
                    }
                    return todo; 
                })
            };

        case SET_VIEW_TYPE:
            return {
                ...state,
                viewType: action.payload,
            };

        case SET_SORT_BY:
            return {
                ...state,
                sortBy: action.payload,
            };

        case TODOS_LOADING:
            return {
                ...state,
                loading: true
            }

        default:
            return state;
    }
}