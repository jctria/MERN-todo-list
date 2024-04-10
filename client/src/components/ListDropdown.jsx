import { Component } from 'react';
import { 
    Dropdown, 
    DropdownToggle, 
    DropdownMenu, 
    DropdownItem, 
    Modal, 
    ModalHeader, 
    ModalBody, 
    ModalFooter, 
    Button 
} from 'reactstrap';
import { FaEllipsis, FaSort } from 'react-icons/fa6';
import { sortDescription } from '../utils/sortTodos'; 
import '../App.css'

class ListDropdown extends Component {
    state = {
        isOpen: false,
        isNestedOpen: false,
        modalOpen: false, 
        deletingListId: null 
    };

    toggle = () => {
        this.setState(prevState => ({
            isOpen: !prevState.isOpen
        }));
    };

    toggleNested = () => {
        this.setState(prevState => ({
            isNestedOpen: !prevState.isNestedOpen
        }));
    };

    toggleModal = () => {
        this.setState({
            modalOpen: !this.state.modalOpen
        });
    }

    onDeleteList = () => {
        const { deletingListId } = this.state;
        this.props.onDeleteList(deletingListId);
        this.toggleModal(); // Close the modal after confirming deletion
    }

    render() {
        const { onUpdateList, setSortBy, currentList, viewType, filteredTodos, sortBy, lists } = this.props;

        return (
            <div>
                <Dropdown isOpen={this.state.isOpen} toggle={this.toggle}>
                    <DropdownToggle className="btn btn-outline-dark custom-dropdown-toggle px-1 py-1">
                        <FaEllipsis />
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem
                            onClick={() => onUpdateList(currentList.id)}
                            disabled={viewType === 'scheduled' || viewType === 'flagged'}
                        >
                            Edit List Name
                        </DropdownItem>
                        <DropdownItem
                            onClick={() => {
                                this.setState({ deletingListId: currentList.id });
                                this.toggleModal();
                            }}                            
                            disabled={(lists.length <= 1) || (viewType === 'scheduled' || viewType === 'flagged')}
                        >
                            Delete List
                        </DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem toggle={false} disabled={filteredTodos.length === 0}>
                            <Dropdown isOpen={this.state.isNestedOpen} toggle={this.toggleNested}>
                                <DropdownToggle className="custom-nested-dropdown-toggle py-0">
                                    <span>Sort By</span>
                                    <span className="float-end"><FaSort /></span>
                                    <div className="sort-description">
                                        {sortDescription(filteredTodos.length, sortBy)}
                                    </div>
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem toggle={false} onClick={() => setSortBy('creationDate')}>
                                        <input
                                            type="radio"
                                            name="sortOption"
                                            value="creationDate"
                                            checked={sortBy === 'creationDate'}
                                            readOnly
                                        />{' '}
                                        Creation Date
                                    </DropdownItem>
                                    <DropdownItem toggle={false} onClick={() => setSortBy('dueDate')}>
                                        <input
                                            type="radio"
                                            name="sortOption"
                                            value="dueDate"
                                            checked={sortBy === 'dueDate'}
                                            readOnly
                                        />{' '}
                                        Due Date
                                    </DropdownItem>
                                    <DropdownItem toggle={false} onClick={() => setSortBy('priority')}>
                                        <input
                                            type="radio"
                                            name="sortOption"
                                            value="priority"
                                            checked={sortBy === 'priority'}
                                            readOnly
                                        />{' '}
                                        Priority
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>

                <Modal isOpen={this.state.modalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Delete list "{currentList.name}"?</ModalHeader>
                    <ModalBody>
                        This will delete all todos in this list.
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                        <Button color="danger" onClick={this.onDeleteList}>Delete</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default ListDropdown;