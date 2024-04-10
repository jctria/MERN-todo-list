import { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import { Link, Navigate } from "react-router-dom";
import { login } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';
import PropTypes from 'prop-types';
import AppNavbar from '../AppNavbar';

class Login extends Component {
    state = {
        email: '',
        password: '',
        msg: null
    };

    static propTypes = {
        login: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired
    }

    componentDidUpdate(prevProps) {
        const { error } = this.props;
        if (error !== prevProps.error) {
            // Check for login error
            if (error.id === 'LOGIN_FAIL') {
                this.setState({ msg: error.msg.msg });
            }
            else {
                this.setState({ msg: null });
            }
        }
    }

    onChange = (e) => {
        this.setState({ [e.target.name]:e.target.value });
    }

    onSubmit = (e) => {
        e.preventDefault(); 
        
        const { email, password } = this.state;
        const user = { email, password };

        // Attempt to login
        this.props.login(user);
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
                <h2 className="text-center mb-3">Login</h2>
                <Form onSubmit={this.onSubmit}>
                    <FormGroup>
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
                        >Login</Button> 
                        <p>
                            Don't have an account?{' '}
                            <Link to="/register">
                                <span className='link' >
                                    Sign up
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

export default connect(mapStateToProps, { login, clearErrors })(Login);