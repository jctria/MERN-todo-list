import { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, Alert, Container } from 'reactstrap';
import { connect } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import { addList } from '../actions/listActions';
import PropTypes from 'prop-types';
import AppNavbar from './AppNavbar';

class AddList extends Component {
    state = {
        userId: '',
        listName: ''
    }

    static propTypes = {
        addList: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool,
        user: PropTypes.object.isRequired,
        list: PropTypes.object.isRequired
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit = async (e) => {
        e.preventDefault();

        const { user } = this.props;
        const { listName } = this.state;

        if (listName.trim() !== '') {
            const list = {
                userId: user._id,
                listName
            };
            await this.props.addList(list);
            this.props.navigate('/todos');
        }
    }

    render() {
        const { listName } = this.state;

        return (
            <div>
                <AppNavbar/>
                <Container>
                <Link to="/todos">
                    <button type="button" className="btn btn-outline-dark">
                        Back
                    </button>
                </Link>

                <h2 className="text-center mb-3">Add List</h2>
                {this.props.isAuthenticated ?

                <Form onSubmit={this.onSubmit}>
                    <FormGroup>
                        <Label for="listName">List Name</Label>
                        <Input 
                            type="text" 
                            name="listName" 
                            id="listName" 
                            placeholder="New List"
                            onChange={this.onChange} 
                        />
                        <Button
                            color="dark"
                            style={{marginTop: '2rem'}}
                            block
                            disabled={listName.trim() === ''} // Disable the button if the title is empty or only whitespace
                        >Add List</Button>
                    </FormGroup>
                </Form> :
                <Alert className="text-center" color="danger">Login to add a new list!</Alert>
                }
                </Container>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    list: state.list,
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

const AddListWithRouter = withRouter(AddList)

export default connect(mapStateToProps, { addList })(AddListWithRouter);