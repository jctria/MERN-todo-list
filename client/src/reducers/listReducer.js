import {
    GET_LISTS,
    GET_LIST,
    ADD_LIST,
    DELETE_LIST,
    UPDATE_LIST,
    SET_CURRENT_LIST,
    CLEAR_CURRENT_LIST,
    LISTS_LOADING
} from '../actions/types';

const initialState = {
    lists: [],
    list: {},
    currentList: { 
        id: null,
        name: '',
        loading: false
    },
    loading: false
}

export default function(state=initialState, action) {
    switch(action.type) {
        case GET_LISTS:
            return {
                ...state,
                lists: action.payload,
                loading: false
            }

        case GET_LIST:
            return {
                ...state,
                list: action.payload,
                loading: false
            }
        
        case ADD_LIST:
            return {
                ...state,
                lists: [...state.lists, action.payload]
            }
        
        case DELETE_LIST:
            return {
                ...state,
                lists: state.lists.filter(list => list._id !== action.payload)                
            };
        
        case UPDATE_LIST:
            return {
                ...state,
                lists: state.lists.map(list => {
                    if (list._id === action.payload._id) {
                        return action.payload; 
                    }
                    return list; 
                })
            };

        case SET_CURRENT_LIST:
            return {
                ...state,
                currentList: {
                    id: action.payload.id,
                    name: action.payload.name
                }
            }

        case CLEAR_CURRENT_LIST: 
            return {
                ...state,
                currentList: initialState.currentList
            }

        case LISTS_LOADING:
            return {
                ...state,
                loading: true
            }

        default:
            return state;
    }
}