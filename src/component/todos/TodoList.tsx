import React, { useEffect, useMemo } from "react";
import TodoItem from "./TodoItem";
import { useSelector } from "react-redux";
import {
  deleteTodoAsync,
  getTodosAsync,
  selectTodos,
  ITodoItem,
  toggleCompleteAsync,
  ITodo,
  Status,
} from "./redux/todoSlice";
import { useAppDispatch } from "../../rootstore/hooks";

const TodoList = () => {
  const todos: ITodo = useSelector(selectTodos);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getTodosAsync());
  }, [dispatch]);

  if (todos.status === Status.pending) {
    return <>loading...</>;
  }
  return (
    <ul className="list-group">
      {todos.entities.map((todo) => (
        <TodoItem
          key={todo.id}
          id={todo.id}
          title={todo.title}
          completed={todo.completed}
        />
      ))}
    </ul>
  );
};

export default TodoList;
