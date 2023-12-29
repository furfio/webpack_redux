import { PayloadAction, createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { RootState } from './store';
import { todo } from 'node:test';

export interface ITodoItem {
    id: string,
    title: string,
    completed: boolean,
}

export const getTodosAsync = createAsyncThunk(
    'todos/getTodosAsync',
    async () => {
        const resp = await fetch('http://localhost:7000/todos');
        if (resp.ok) {
            const todos = await resp.json();
            return todos as ITodoItem[];
        }
    }
);

export const addTodoAsync = createAsyncThunk(
    'todos/addTodoAsync',
    async (payload: string) => {
        const resp = await fetch('http://localhost:7000/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: payload }),
        });

        if (resp.ok) {
            const todo = await resp.json();
            return todo as ITodoItem;
        }
    }
);

export const toggleCompleteAsync = createAsyncThunk(
    'todos/completeTodoAsync',
    async (payload: ITodoItem) => {
        const resp = await fetch(`http://localhost:7000/todos/${payload.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed: payload.completed }),
        });

        if (resp.ok) {
            const todo = await resp.json();
            return todo as ITodoItem;
        }
    }
);

export const deleteTodoAsync = createAsyncThunk(
    'todos/deleteTodoAsync',
    async (payload: string) => {
        const resp = await fetch(`http://localhost:7000/todos/${payload}`, {
            method: 'DELETE',
        });

        if (resp.ok) {
            return payload;
        }
    }
);

export const todoSlice = createSlice({
    name: 'todos',
    initialState: [] as ITodoItem[],
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getTodosAsync.fulfilled, (state: ITodoItem[], action: PayloadAction<ITodoItem[]>) => {
            return action.payload;
        }).addCase(addTodoAsync.fulfilled, (state: ITodoItem[], action: PayloadAction<ITodoItem>) => {
            state.push(action.payload);
        }).addCase(toggleCompleteAsync.fulfilled, (state: ITodoItem[], action: PayloadAction<ITodoItem>) => {
            const index = state.findIndex(
                (todo: ITodoItem) => todo.id === action.payload.id
            );
            state[index].completed = action.payload.completed;
        }).addCase(deleteTodoAsync.fulfilled, (state: ITodoItem[], action: PayloadAction<string>) => {
            return state.filter((todo: ITodoItem) => todo.id !== action.payload);
        })
    },
});

// export const { addTodo, toggleComplete, deleteTodo } = todoSlice.actions;

//selectors
export const selectTodos = (state: RootState) => state.todos
export const completedTodosSelector = createSelector(selectTodos, (todos: ITodoItem[]) =>
    todos.filter((todo) => todo.completed === true)
);
export const selectTodoByIdSelector = createSelector(
    [selectTodos, (state, todoId) => todoId],
    (todos: ITodoItem[], todoId) => todos.find((todo) => todo.id === todoId)
);

export default todoSlice.reducer;