import { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, Alert, Container } from 'reactstrap';
import { connect } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { updateList, getList } from '../actions/listActions';
import PropTypes from 'prop-types';
import AppNavbar from './AppNavbar';

class EditList extends Component {
    state = {
        userId: '',
        listName: ''
    }

    static propTypes = {
        updateList: PropTypes.func.isRequired,
        getList: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool,
        list: PropTypes.object.isRequired
    }

    async componentDidMount() {
        const listId = this.props.id;
        await this.props.getList(listId);
    }

    componentDidUpdate(prevProps) {
        if (this.props.list !== prevProps.list) {
            const { list } = this.props;
            this.setState({ 
                userId: list.userId,
                listName: list.listName
            });
        }
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit = async (e) => {
        e.preventDefault();


        const id = this.props.id;
        const { listName } = this.state;

        if (listName.trim() !== '') {
            const list = {
                listName
            };
            await this.props.updateList(id, list);
            this.props.navigate('/todos');
        }
    }

    render() {
        const { listName } = this.state;

        const { loading } = this.props.list;

        if (loading) {
            return <div>Loading...</div>; // Render loading indicator while waiting for data
        }

        return (
            <div>
                <AppNavbar/>
                <Container>
                <Link to="/todos">
                    <button type="button" className="btn btn-outline-dark">
                        Back
                    </button>
                </Link>

                <h2 className="text-center mb-3">Edit List</h2>
                {this.props.isAuthenticated ?

                <Form onSubmit={this.onSubmit}>
                    <FormGroup>
                        <Label for="listName">List Name</Label>
                        <Input 
                            type="text" 
                            name="listName" 
                            id="listName" 
                            value={listName}
                            placeholder="New List"
                            onChange={this.onChange} 
                        />
                        <Button
                            color="dark"
                            style={{marginTop: '2rem'}}
                            block
                            disabled={listName.trim() === ''} // Disable the button if the title is empty or only whitespace
                        >Submit</Button>
                    </FormGroup>
                </Form> :
                <Alert className="text-center" color="danger">Login to update list!</Alert>
                }
                </Container>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    list: state.list.list
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

const EditListWithRouter = withRouter(EditList)

export default connect(mapStateToProps, { updateList, getList })(EditListWithRouter);