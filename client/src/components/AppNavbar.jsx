import { Component, Fragment } from 'react';
import { 
    Button, 
    Navbar, 
    NavbarBrand, 
    Nav, 
    NavItem, 
    Container, 
    NavLink,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem 
} from 'reactstrap';
import { connect } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setViewType, setSortBy } from '../actions/todoActions';
import { getLists, setCurrentList } from '../actions/listActions';
import PropTypes from 'prop-types';
import Logout from './auth/Logout';

import { FaPlus } from 'react-icons/fa6';
import '../App.css';

class AppNavbar extends Component {
    state = {
        isOpen: false,
        loaded: false
    }

    static propTypes = {
        getLists: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool,
        user: PropTypes.object.isRequired,
        list: PropTypes.object.isRequired
    }

    componentDidUpdate(prevProps) {
        if (this.props.isAuthenticated && !prevProps.isAuthenticated) {
            const current_list = JSON.parse(localStorage.getItem('currentList'));
            const view_type = localStorage.getItem('viewType');
            const sort_by = localStorage.getItem('sortBy');
    
            if (current_list) {
                this.props.setCurrentList(current_list); // Dispatch action to set currentList
            }
            if (view_type) {
                this.props.setViewType(view_type); // Dispatch action to set viewType
            }
            if (sort_by) {
                this.props.setSortBy(sort_by); // Dispatch action to set sortBy
            }
        }
    }

    async getListNames(id) {
        await this.props.getLists(id);
        this.setState({ loaded: true })
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    onScheduledClicked = () => {
        this.props.setViewType('scheduled');
        this.props.navigate('/todos');
    }

    onFlaggedClicked = () => {
        this.props.setViewType('flagged');
        this.props.navigate('/todos');
    }

    render() {
        const { isAuthenticated, user, list } = this.props;

        if (isAuthenticated && user._id && !list.loading && !this.state.loaded) {
            this.getListNames(user._id);
        }

        const authLinks = (
            <Fragment>
                <NavItem>
                    <Dropdown isOpen={this.state.isOpen} toggle={this.toggle}>
                    <DropdownToggle className="btn btn-dark custom-dropdown-toggle-nav" caret>My Lists</DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem onClick={this.onScheduledClicked}>Scheduled</DropdownItem>
                            <DropdownItem onClick={this.onFlaggedClicked}>Flagged</DropdownItem>
                            <DropdownItem divider />
                            {isAuthenticated && !list.loading && this.state.loaded && list.lists.length ? 
                                <div className="col">
                                {list.lists.map((list) => (
                                    <DropdownItem 
                                        key={list._id}
                                        onClick={() => {
                                            this.props.setCurrentList({ id: list._id, name: list.listName })
                                            this.props.setViewType('list');
                                            this.props.navigate('/todos');
                                        }}
                                    >{list.listName}</DropdownItem>
                                ))} 
                                </div>
                            : null}
                            <DropdownItem divider />
                            <DropdownItem className="text-center py-0" tag={Link} to={`/add-list`}>
                                <FaPlus />
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavItem>

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
    user: state.auth.user,
    list: state.list,
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

const AppNavbarWithRouter = withRouter(AppNavbar);

export default connect(mapStateToProps, { getLists, setCurrentList, setViewType, setSortBy })(AppNavbarWithRouter);