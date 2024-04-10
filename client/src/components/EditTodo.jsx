import { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, Container, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import { updateTodo, getTodo } from '../actions/todoActions';
import { Link, useNavigate, useParams } from "react-router-dom";
import PropTypes from 'prop-types';
import AppNavbar from './AppNavbar';

import { FaFlag } from 'react-icons/fa6';
import '../App.css';

class EditTodo extends Component {
    state = {
        title: '',
        description: '',
        due_date: '',
        flag: false,
        priority: '',
        listId: ''
    }

    static propTypes = {
        updateTodo: PropTypes.func.isRequired,
        getTodo: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool,
        todo: PropTypes.object.isRequired,
        currentList: PropTypes.object.isRequired,
    }

    async componentDidMount() {
        const todoId = this.props.id;
        await this.props.getTodo(todoId);
    }

    componentDidUpdate(prevProps) {
        if (this.props.todo !== prevProps.todo) {
            const { todo } = this.props;
            this.setState({ 
                title: todo.title,
                description: todo.description,
                due_date: todo.due_date,
                flag: todo.flag,
                priority: todo.priority,
                listId: todo.listId 
            });
        }
    }

    onChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        this.setState({ [e.target.name]: value });
    }

    onSubmit = async (e) => {
        e.preventDefault();

        const id = this.props.id;
        const { title, description, due_date, flag, priority, listId } = this.state;
    
        if (title.trim() !== '') { // Check if the title is not empty or only whitespace
            const todo = {
                title,
                description,
                due_date,
                flag, 
                priority,
                listId 
            };
            await this.props.updateTodo(id, todo);
            this.props.navigate('/todos');
        }
    }

    render(){
        const { title, description, due_date, flag, priority } = this.state;
        const { loading } = this.props.todo;

        if (!title) {
            return (
                <div className="loader-container">
                    <div>Loading...</div>
                </div>
            );        
        }

        return(
            <div>
                <AppNavbar/>
                <Container>
                <Link to="/todos">
                    <button type="button" className="btn btn-outline-dark">
                        Back
                    </button>
                </Link>
                
                <h2 className="text-center mb-3">Edit Todo</h2>
                {this.props.isAuthenticated ?
                <Form onSubmit={this.onSubmit}>
                    <FormGroup>
                        <Label for="title">Title</Label>
                        <Input
                            type="text"
                            name="title"
                            id="title"
                            value={title}
                            onChange={this.onChange}
                        />
                        <br/>
                        <Label for="description">Notes</Label>
                        <Input
                            type="textarea"
                            name="description"
                            id="description"
                            rows="2"
                            value={description}
                            onChange={this.onChange}
                        />
                        <br/>
                        <Label for="due_date">Due Date</Label>
                        <Input
                            type="datetime-local"
                            name="due_date"
                            id="due_date"
                            value={due_date}
                            onChange={this.onChange}
                        />
                        <br/>
                        <Label className="form-check-label" for="flag">
                            <FaFlag /> Flag For Importance
                        </Label>
                        <Input
                            className="form-check-input"
                            type="checkbox" 
                            name="flag"
                            id="flag"
                            style={{marginLeft: '10px'}}
                            checked={flag} // Use checked instead of value for checkbox
                            onChange={this.onChange}
                        />
                        <br/>
                        <Label className="mt-2 priority-label">
                            {priority ? `(${priority}) Priority:` : 'Priority:'}
                        </Label>
                        <FormGroup check inline className="priority-radio">
                            <Label check>
                                <Input 
                                    type="radio" 
                                    name="priority" 
                                    value="" 
                                    onChange={this.onChange} 
                                    checked={priority === ''} 
                                /> {'None'}
                            </Label>
                        </FormGroup>
                        <FormGroup check inline className="priority-radio">
                            <Label check>
                                <Input 
                                    type="radio" 
                                    name="priority" 
                                    value="!" 
                                    onChange={this.onChange} 
                                    checked={priority === '!'} 
                                /> {'Low'}
                            </Label>
                        </FormGroup>
                        <FormGroup check inline className="priority-radio">
                            <Label check>
                                <Input 
                                    type="radio" 
                                    name="priority" 
                                    value="!!" 
                                    onChange={this.onChange} 
                                    checked={priority === '!!'} 
                                /> {'Medium'}
                            </Label>
                        </FormGroup>
                        <FormGroup check inline className="priority-radio">
                            <Label check>
                                <Input 
                                    type="radio" 
                                    name="priority" 
                                    value="!!!" 
                                    onChange={this.onChange} 
                                    checked={priority === '!!!'} 
                                /> {'High'}
                            </Label>
                        </FormGroup>
                        <Button
                            color="dark"
                            style={{marginTop: '2rem'}}
                            block
                            disabled={title.trim() === ''} // Disable the button if the title is empty or only whitespace
                        >Submit</Button>
                    </FormGroup>
                </Form> : 
                <Alert className="text-center" color="danger">Login to update todos!</Alert>
                }
                </Container>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    todo: state.todo.todo,
    currentList: state.list.currentList 
});

function withRouter(Component) {
    function ComponentWithRouterProp(props) {
      const navigate = useNavigate();
      const params = useParams();
      return (
        <Component
          {...props}
          id={params.id}
          navigate={navigate}
        />
      );
    }
    return ComponentWithRouterProp;
}

const EditTodoWithRouter = withRouter(EditTodo);

export default connect(mapStateToProps, { updateTodo, getTodo })(EditTodoWithRouter);