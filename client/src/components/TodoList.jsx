import { Component, Fragment } from 'react';
import { Card, CardText, CardBody, CardTitle, CardSubtitle, Container, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getTodos, deleteTodo, setSortBy } from '../actions/todoActions';
import { deleteList } from '../actions/listActions';
import { filterTodos } from '../utils/filterTodos'; 
import { sortTodos } from '../utils/sortTodos'; 
import PropTypes from 'prop-types';
import AppNavbar from './AppNavbar';
import ListDropdown from './ListDropdown'; 

import { FaPenToSquare, FaCheck, FaFlag, FaPlus } from 'react-icons/fa6';
import '../App.css';

class TodoList extends Component {

    state = {
        loaded: false
        }

    static propTypes = {
        getTodos: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool,
        user: PropTypes.object.isRequired,
        todo: PropTypes.object.isRequired,
        list: PropTypes.object.isRequired,
        currentList: PropTypes.object.isRequired,
        viewType: PropTypes.string.isRequired,
        sortBy: PropTypes.string.isRequired,
    }

    async getTodoList(userId) {
        await this.props.getTodos(userId);
        this.setState({ loaded: true });
    }

    onUpdateTodo = async (id) => {
        this.props.navigate(`/todos/${id}/edit`);
    }

    onDeleteTodo = (id) => {
        this.props.deleteTodo(id);
    }

    onUpdateList = async (id) => {
        this.props.navigate(`/lists/${id}/edit`);
    }

    setSortBy = (sortByValue) => {
        this.props.setSortBy(sortByValue);
    }

    formatDate = (dateString) => {
        const dt = new Date(dateString);
        return dt.toLocaleString('en-CA').replace(':00', '');
    };

    isDueDatePassed = (dueDate) => {
        const currentDate = new Date();
        const dueDateTime = new Date(dueDate);
        return dueDateTime < currentDate;
    }

    render(){
        const { isAuthenticated, user, todo, list, currentList, viewType, sortBy } = this.props;

        if (isAuthenticated && user._id && !todo.loading && !this.state.loaded) {
            this.getTodoList(user._id);
        }

        let filteredTodos = [...todo.todos]; // Start with all todos
        // Filter todos based on view type
        if (viewType === 'scheduled') {
            filteredTodos = filteredTodos.filter(todo => todo.due_date !== undefined && todo.due_date !== "");
        } else if (viewType === 'flagged') {
            filteredTodos = filteredTodos.filter(todo => todo.flag === 1);
        } else if (viewType === 'list') {
            filteredTodos = filteredTodos.filter(todo => todo.listId === currentList.id);
        }

        // Sort the filtered todos based on the selected criteria
        const sortedFilteredTodos = sortTodos(filteredTodos, sortBy);

        let heading = <h2 className="text-center">{currentList.name}</h2>;
        if (viewType === 'scheduled') {
            heading = <h2 className="text-center">Scheduled Todos</h2>;
        } else if (viewType === 'flagged') {
            heading = <h2 className="text-center">Flagged Todos</h2>;
        }

        return (
            <div>
                <AppNavbar/>
                {isAuthenticated ? 
                <Container>
                    <div>
                        {heading}
                    </div>

                    <div className="d-flex justify-content-end mb-2">
                        <ListDropdown
                                onUpdateList={() => this.onUpdateList(currentList.id)}
                                onDeleteList={this.props.deleteList} // Pass deleteList action directly
                                filteredTodos={filteredTodos}
                                sortBy={sortBy}
                                setSortBy={this.setSortBy}
                                currentList={currentList}
                                viewType={viewType}
                                lists={list.lists}
                        />
                    </div>
                    
                    {!todo.loading && !currentList.loading && this.state.loaded && sortedFilteredTodos.length ? 
                        <div className="col">
                            {sortedFilteredTodos.map((todo)=>(
                                <div className="col-md" key={todo._id}>
                                <Card className="mb-3 shadow-sm">
                                    <CardBody style={{padding: "5px"}}>
                                        <CardTitle tag="h5">
                                            <span className="priority">{todo.priority} </span>
                                            <span>{todo.title}</span>
                                            <span className="float-end priority" style={{fontSize: "0.75em"}}>
                                                {todo.flag === 1 ? <FaFlag /> : null} 
                                            </span>
                                        </CardTitle>
                                        <CardSubtitle className="description-text">{todo.description}</CardSubtitle>
                                        <CardText>
                                            <span className={this.isDueDatePassed(todo.due_date) ? "due-date-overdue" : "due-date"}>
                                                {this.formatDate(todo.due_date) === "Invalid Date" ? '' : this.formatDate(todo.due_date)}
                                            </span>                                    
                                            <span className="button-container float-end">
                                                <button 
                                                    className="btn btn-outline-dark" 
                                                    style={{padding: "2.5px", border: "none"}} 
                                                    onClick={this.onUpdateTodo.bind(this, todo._id)}
                                                >
                                                <span style={{fontSize: "1em"}}><FaPenToSquare /></span>
                                                </button>
                                                &nbsp;
                                                <button 
                                                    className="btn btn-outline-dark" 
                                                    style={{padding: "2.5px", border: "none"}} 
                                                    onClick={this.onDeleteTodo.bind(this, todo._id)}
                                                >
                                                <span style={{fontSize: "1em"}}><FaCheck /></span>
                                                </button>
                                            </span>
                                        </CardText>
                                    </CardBody>
                                </Card>
                                </div>
                            ))}
                        </div>
                    : null}
                </Container>
                : null}
                
                {isAuthenticated ?
                <Fragment>
                    {sortedFilteredTodos.length ? null :
                        <Alert color="info" className="text-center">No Todos Found.</Alert>
                    }
                    <Container className="mb-4 add-todo-btn">
                        <Link to="/add-todo" style={{textDecoration: 'none'}}>
                            <div className="d-grid gap-2">
                                <button className="btn btn-outline-dark text-start mb-3"> 
                                    <FaPlus /> Add Todo 
                                </button>
                            </div>
                        </Link>
                    </Container>
                </Fragment>
                : <Alert color="danger" className="text-center">Login to View!</Alert>
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    todo: state.todo,
    list: state.list,
    currentList: state.list.currentList,
    viewType: state.todo.viewType, 
    sortBy: state.todo.sortBy
})

function withRouter(Component) {
    function ComponentWithRouterProp(props) {
      const navigate = useNavigate();
      return (
        <Component
          {...props}
          navigate={navigate}
        />
      );
    }
    return ComponentWithRouterProp;
}

const TodoListWithRouter = withRouter(TodoList);

export default connect(mapStateToProps, { getTodos, deleteTodo, deleteList, setSortBy, filterTodos, sortTodos })(TodoListWithRouter);