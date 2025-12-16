const todos = [
    { id: 1, title: "Faire les courses", completed: false },
    { id: 2, title: "Apprendre Node.js", completed: true }
];

class TodoModel {
    static findAll() {
        return Promise.resolve(todos);
    }

    static create(todoData) {
        const newTodo = {
            id: todos.length + 1,
            title: todoData.title,
            completed: false
        };
        todos.push(newTodo);
        return Promise.resolve(newTodo);
    }
}

module.exports = TodoModel