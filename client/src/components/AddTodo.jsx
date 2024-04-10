import { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, Container, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import { addTodo } from '../actions/todoActions';
import PropTypes from 'prop-types';
import AppNavbar from './AppNavbar';

import { FaFlag } from 'react-icons/fa6';
import '../App.css';

class AddTodo extends Component {
    state = {
        userId: '',
        title: '',
        description: '',
        due_date: '',
        flag: '',
        priority: ''
    }

    static propTypes = {
        addTodo: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool,
        user: PropTypes.object.isRequired,
        todo: PropTypes.object.isRequired
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    onSubmit = async (e) => {
        e.preventDefault();

        const { user } = this.props;
        let { title, description, due_date, flag, priority } = this.state;

        // If no radio button is selected for priority, set it to an empty string
        if (!priority) {
            priority = '';
        }

        if (title.trim() !== '') { // Check if the title is not empty or only whitespace
            const todo = {
                userId: user._id,
                title,
                description,
                due_date,
                flag, 
                priority
            };
            await this.props.addTodo(todo);
            this.props.navigate('/todos');
        } 
    }

    render(){
        const { title, description, due_date, priority } = this.state;

        return(
            <div>
                <AppNavbar/>
                <Container>
                <Link to="/todos">
                    <button type="button" className="btn btn-outline-dark">
                        Back
                    </button>
                </Link>

                <h2 className="text-center mb-3">Add a new Todo</h2>
                {this.props.isAuthenticated ?
                <Form onSubmit={this.onSubmit}>
                    <FormGroup>
                        <Label for="title">Title</Label>
                        <Input
                            type="text"
                            name="title"
                            id="title"
                            placeholder="New Todo"
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
                            onfocus="this.showPicker()"
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
                            value="1"
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
                        >Add Todo</Button>
                    </FormGroup>
                </Form> : 
                <Alert className="text-center" color="danger">Login to add todos!</Alert>
                }
                </Container>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    todo: state.todo
});

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

const AddTodoWithRouter = withRouter(AddTodo);

export default connect(mapStateToProps, { addTodo })(AddTodoWithRouter);