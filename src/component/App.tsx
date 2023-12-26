import React from 'react';
import '../css/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddTodoForm from './todos/AddTodoForm';
import TodoList from './todos/TodoList';
import TotalCompleteItems from './todos/TotalCompleteItems';

const App: React.FC = () => {
	return (
		<div>
			<h1>My Todo List</h1>
			<AddTodoForm />
			<TodoList />
			<TotalCompleteItems />
		</div>
	);
}

export default App;