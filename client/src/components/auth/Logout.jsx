import { Component } from 'react';
import { NavLink, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { logout } from '../../actions/authActions';
import PropTypes from 'prop-types';

export class Logout extends Component {
    static propTypes = {
        logout: PropTypes.func.isRequired
    }

    render() {
        return (
            <div>
                <Button color="danger" className="btn btn-sm" style={{padding: "0px"}}>
                    <NavLink onClick={this.props.logout} href="#">
                        <span className="text-light"><b>Logout</b></span>
                    </NavLink>
                </Button>
            </div>
        )
    }
}

export default connect(null, { logout })(Logout);