import { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import { Link, Navigate } from "react-router-dom";
import { register } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';
import PropTypes from 'prop-types';
import AppNavbar from '../AppNavbar';

class Register extends Component {
    state = {
        name: '',
        email: '',
        password: '',
        msg: null
    };

    static propTypes = {
        register: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired
    }

    componentDidUpdate(prevProps) {
        const { error, isAuthenticated } = this.props;
        if (error !== prevProps.error) {
            // Check for register error
            if (error.id === 'REGISTER_FAIL') {
                this.setState({ msg: error.msg.msg });
            }
            else {
                this.setState({ msg: null });
            }
        }
        if (isAuthenticated) {
            alert('Registered successfully');
        }
    }

    onChange = (e) => {
        this.setState({ [e.target.name]:e.target.value });
    }

    onSubmit = (e) => {
        e.preventDefault();  
        
        const { name, email, password } = this.state;

        // Create user object
        const newUser = { name, email, password };

        // Attempt to register
        this.props.register(newUser);
    }

    render(){
        // If authenticated, go to showpage
        if (this.props.isAuthenticated) {
            this.props.clearErrors();
            return < Navigate to='/todos' />;
        }

        return (
            <div>
                <AppNavbar/>
                <div className="container">
                {this.state.msg ? (<Alert color="danger">{this.state.msg}</Alert>): null}
                <h2 className="text-center mb-3">Register</h2>
                <Form onSubmit={this.onSubmit}>
                    <FormGroup>
                        <Label for="name">Name</Label>
                        <Input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Name"
                            className="mb-3"
                            onChange={this.onChange}
                        />
                        <Label for="email">Email</Label>
                        <Input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Email"
                            className="mb-3"
                            onChange={this.onChange}
                        />
                        <Label for="password">Password</Label>
                        <Input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Password"
                            className="mb-3"
                            onChange={this.onChange}
                        />
                        <Button
                            color="dark"
                            style={{marginTop: '2rem'}}
                            block
                        >Register</Button>
                        <p>
                            Already have an account?{' '}
                            <Link to ="/login">
                                <span className='link'>
                                    Login
                                </span>
                            </Link>
                        </p>
                    </FormGroup>
                </Form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error
});

export default connect(mapStateToProps, { register, clearErrors })(Register);