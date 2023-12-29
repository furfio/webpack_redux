import React, { useEffect, useMemo } from 'react';
import TodoItem from './TodoItem';
import { useSelector } from 'react-redux';
import { deleteTodoAsync, getTodosAsync, selectTodos, ITodoItem, toggleCompleteAsync } from '../../redux/todoSlice';
import { useAppDispatch } from '../../redux/hooks';

const TodoList = () => {
	const todos = useSelector(selectTodos);
    const dispatch = useAppDispatch()

	useEffect(() => {
		dispatch(getTodosAsync());
	}, [dispatch]);

	return (
		<ul className='list-group'>
			{todos.map((todo) => (
				<TodoItem key={todo.id} id={todo.id} title={todo.title} completed={todo.completed}/>
			))}
		</ul>
	);
};

export default TodoList;