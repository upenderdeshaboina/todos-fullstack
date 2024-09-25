import React, { Component } from 'react';
import NavBar from "../NavBar/navbar";
import Cookies from 'js-cookie';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import './home.css';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';

class Home extends Component {
    state = {
        todosList: [],
        currentTodo: { todo_id: '', todo_title: '', todo_status: 'Pending' }, // Default status set to Pending
        message: '',
        isUpdating: false
    };

    componentDidMount() {
        this.getTodos();
    }

    getTodos = async () => {
        const token = Cookies.get('jwtToken');
        const response = await fetch('https://todos-backend-6.onrender.com/get-todos', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (response.ok) {
            this.setState({ todosList: data });
        } else {
            this.setState({ message: data.msg });
        }
    };

    handleAddTodo = async (todo) => {
        const token = Cookies.get('jwtToken');
        const response = await fetch('https://todos-backend-6.onrender.com/add-todo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(todo)
        });
        const data = await response.json();
        if (response.ok) {
            this.getTodos(); 
        } else {
            this.setState({ message: data.msg });
        }
    };

    handleUpdateTodo = async (todo) => {
        const token = Cookies.get('jwtToken');
        const response = await fetch(`https://todos-backend-6.onrender.com/update-todo/${todo.todo_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(todo)
        });
        const data = await response.json();
        if (response.ok) {
            this.getTodos(); 
            this.setState({ isUpdating: false, currentTodo: { todo_id: '', todo_title: '', todo_status: 'Pending' } }); // Reset to default status
        } else {
            this.setState({ message: data.msg });
        }
    };

    handleDeleteTodo = async (todoId) => {
        const token = Cookies.get('jwtToken');
        const response = await fetch(`https://todos-backend-6.onrender.com/delete-todo/${todoId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (response.ok) {
            this.getTodos();
        } else {
            this.setState({ message: data.msg });
        }
    };

    openUpdatePopup = (todo) => {
        this.setState({ currentTodo: todo, isUpdating: true });
    };

    closePopup = () => {
        this.setState({ isUpdating: false, currentTodo: { todo_id: '', todo_title: '', todo_status: 'Pending' } }); // Reset to default status
    };

    render() {
        const token = Cookies.get('jwtToken');
        if (!token) {
            return <Redirect to='/login' />;
        }

        const { todosList, currentTodo, isUpdating, message } = this.state;

        return (
            <>
                <NavBar />
                <div className="home-container">
                    <h1>Todo List</h1>
                    {message && <p>{message}</p>}
                    <button onClick={() => this.openUpdatePopup({ todo_id: '', todo_title: '', todo_status: 'Pending' })}>
                        Add Todo
                    </button>
                    <ul>
                        {todosList.map(todo => (
                            <li key={todo.todo_id}>
                                <span>{todo.todo_title} - {todo.todo_status}</span>
                                <button onClick={() => this.openUpdatePopup(todo)}>Edit</button>
                                <button onClick={() => this.handleDeleteTodo(todo.todo_id)}>Delete</button>
                            </li>
                        ))}
                    </ul>

                    <Popup open={isUpdating} closeOnDocumentClick onClose={this.closePopup}>
                        <div className="modal">
                            <h2>{currentTodo.todo_id ? 'Update Todo' : 'Add Todo'}</h2>
                            <form onSubmit={e => {
                                e.preventDefault();
                                currentTodo.todo_id ? this.handleUpdateTodo(currentTodo) : this.handleAddTodo(currentTodo);
                            }}>
                                <label>
                                    Title:
                                    <input
                                        type="text"
                                        value={currentTodo.todo_title}
                                        onChange={e => this.setState({ currentTodo: { ...currentTodo, todo_title: e.target.value } })}
                                        required
                                    />
                                </label>
                                <label>
                                    Status:
                                    <select
                                        value={currentTodo.todo_status}
                                        onChange={e => this.setState({ currentTodo: { ...currentTodo, todo_status: e.target.value } })}
                                        required
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Not Done">Not Done</option>
                                        <option value="Started">Started</option>
                                    </select>
                                </label>
                                <button type="submit">{currentTodo.todo_id ? 'Update' : 'Add'}</button>
                            </form>
                            <button onClick={this.closePopup}>Close</button>
                        </div>
                    </Popup>
                </div>
            </>
        );
    }
}

export default Home;
