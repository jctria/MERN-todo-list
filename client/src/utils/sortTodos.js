export const sortTodos = (todos, sortBy) => {
    return todos.slice().sort((a, b) => {
        if (sortBy === 'dueDate') {
            // Sorting by due date
            const dateA = a.due_date ? new Date(a.due_date) : new Date(8640000000000000);
            const dateB = b.due_date ? new Date(b.due_date) : new Date(8640000000000000);
            return dateA - dateB;
        } else if (sortBy === 'priority') {
            // Sorting by priority
            const priorityMap = { '!!!': 3, '!!': 2, '!': 1, '': 0 };
            const priorityA = priorityMap[a.priority] || 0;
            const priorityB = priorityMap[b.priority] || 0;
            return priorityB - priorityA;
        } else if (sortBy === 'creationDate') {
            return 0; // Default case, no sorting applied
        }
    });
};

export const sortDescription = (filteredTodosLength, sortBy) => {
    if (filteredTodosLength === 0) {
        return ''; // No todos, so no sort description
    } else {
        switch (sortBy) {
            case 'creationDate':
                return 'Creation Date';
            case 'dueDate':
                return 'Due Date';
            case 'priority':
                return 'Priority';
            default:
                return ''; // Just in case
        }
    }
}