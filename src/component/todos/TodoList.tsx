import React, { useEffect } from 'react';
import TodoItem from './TodoItem';
import { useSelector, useDispatch } from 'react-redux';
import { getTodosAsync, todoItem } from '../../redux/todoSlice';
import { AppDispatch, RootState } from '../../redux/store';

const TodoList = () => {
	const dispatch = useDispatch<AppDispatch>();
	const todos = useSelector((state: RootState) => state.todos);

	useEffect(() => {
		dispatch(getTodosAsync());
	}, [dispatch]);

	return (
		<ul className='list-group'>
			{todos.map((todo) => (
				<TodoItem key={todo.id} item={todo} />
			))}
		</ul>
	);
};

export default TodoList;