export const filterTodos = (todos, {listId, scheduled, flagged}) => {
    return todos.filter(todo => {
        const matchesList = listId ? todo.listId === listId : true;
        const matchesScheduled = scheduled ? todo.due_date !== undefined && todo.due_date !== "" : true;
        const matchesFlagged = flagged ? todo.flag === 1 : true;
        return matchesList && matchesScheduled && matchesFlagged;
    });
};