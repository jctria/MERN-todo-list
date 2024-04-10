import { Component, Fragment } from 'react';
import { Card, CardText, CardBody, CardTitle, CardSubtitle, Container, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getTodos, deleteTodo } from '../actions/todoActions';
import PropTypes from 'prop-types';
import AppNavbar from './AppNavbar';

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
        const { isAuthenticated, user, todo } = this.props;

        if (isAuthenticated && user._id && !todo.loading && !this.state.loaded) {
            this.getTodoList(user._id);
        }

        return (
            <div>
                <AppNavbar/>
                {isAuthenticated ? 
                <Container>                    
                    {!todo.loading && this.state.loaded && todo.todos.length ? 
                        <div className="col">
                            {todo.todos.map((todo)=>(
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
                    {todo.todos.length ? null :
                        <Alert color="info" className="text-center">No Todos Found.</Alert>
                    }
                    <Container className="sticky-bottom mb-4 add-todo-btn">
                        <Link to="/add-todo" style={{textDecoration: 'none'}}>
                            <div className="d-grid gap-2">
                                <button className="btn btn-outline-dark text-start"> 
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
    todo: state.todo
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

export default connect(mapStateToProps, { getTodos, deleteTodo })(TodoListWithRouter);