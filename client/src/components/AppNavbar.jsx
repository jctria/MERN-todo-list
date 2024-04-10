import { Component, Fragment } from 'react';
import { Button, Navbar, NavbarBrand, Nav, NavItem, Container, NavLink } from 'reactstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Logout from './auth/Logout';
import '../App.css';

class AppNavbar extends Component {
    static propTypes = {
        isAuthenticated: PropTypes.bool,
        user: PropTypes.object.isRequired,
    }

    render() {
        const { isAuthenticated, user } = this.props;

        const authLinks = (
            <Fragment>
                {/* <NavItem className= "d-flex ms-4"> 
                    <span className="navbar-text"> 
                        <strong>{user ? `Welcome ${user.name}` : ''}</strong>
                    </span>
                </NavItem> */}

                <NavItem className="ms-auto">
                    <Logout/>
                </NavItem>
            </Fragment>
        );

        const guestLinks = (
            <Fragment>
                <NavItem className="ms-auto">
                    <Link to="/login">
                        <Button color="success" className="btn btn-sm" style={{padding: "0px"}}>
                            <NavLink to="/login"> 
                                <span className="text-dark"><b>Login</b></span>
                            </NavLink>
                        </Button>
                    </Link>
                </NavItem>
            </Fragment>
        );

        return(
            <div className="sticky-top">
                <Navbar color="dark" dark expand="sm" className="mb-5">
                    <Container fluid className="px-1">
                        <Nav navbar className="flex-row align-items-center">
                            <NavbarBrand href="/todos">To Do List</NavbarBrand>
                            { isAuthenticated ? authLinks : guestLinks }
                        </Nav>
                    </Container>
                </Navbar>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
})

export default connect(mapStateToProps, null)(AppNavbar);