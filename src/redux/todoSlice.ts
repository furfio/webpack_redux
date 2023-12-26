import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

export interface todoItem {
    id?: string,
    title: string,
    completed?: boolean,
}

export const getTodosAsync = createAsyncThunk(
	'todos/getTodosAsync',
	async () => {
		const resp = await fetch('http://localhost:7000/todos');
		if (resp.ok) {
			const todos = await resp.json();
			return todos as todoItem[];
		}
	}
);

export const addTodoAsync = createAsyncThunk(
	'todos/addTodoAsync',
	async (payload: todoItem) => {
		const resp = await fetch('http://localhost:7000/todos', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ title: payload.title }),
		});

		if (resp.ok) {
			const todo = await resp.json();
			return todo as todoItem;
		}
	}
);

export const toggleCompleteAsync = createAsyncThunk(
	'todos/completeTodoAsync',
	async (payload: todoItem) => {
		const resp = await fetch(`http://localhost:7000/todos/${payload.id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ completed: payload.completed }),
		});

		if (resp.ok) {
			const todo = await resp.json();
			return todo as todoItem;
		}
	}
);

export const deleteTodoAsync = createAsyncThunk(
	'todos/deleteTodoAsync',
	async (payload: todoItem) => {
		const resp = await fetch(`http://localhost:7000/todos/${payload.id}`, {
			method: 'DELETE',
		});

		if (resp.ok) {
			return payload.id;
		}
	}
);

export const todoSlice = createSlice({
	name: 'todos',
	initialState: [],
	reducers: {
		addTodo: (state, action) => {
			const todo = {
				id: nanoid(),
				title: action.payload.title,
				completed: false,
			};
			state.push(todo);
		},
		toggleComplete: (state, action) => {
			const index = state.findIndex((todo) => todo.id === action.payload.id);
			state[index].completed = action.payload.completed;
		},
		deleteTodo: (state, action) => {
			return state.filter((todo) => todo.id !== action.payload.id);
		},
	},
	extraReducers: (builder) => {
		builder.addCase(getTodosAsync.fulfilled, (state: todoItem[], action: PayloadAction<todoItem[]>) => {
			return action.payload;
		}),
        builder.addCase(addTodoAsync.fulfilled, (state: todoItem[], action: PayloadAction<todoItem>) => {
			state.push(action.payload);
		}),
        builder.addCase(toggleCompleteAsync.fulfilled, (state: todoItem[], action: PayloadAction<todoItem>) => {
			const index = state.findIndex(
				(todo: todoItem) => todo.id === action.payload.id
			);
			state[index].completed = action.payload.completed;
		}),
        builder.addCase(deleteTodoAsync.fulfilled, (state: todoItem[], action: PayloadAction<string>) => {
			return state.filter((todo: todoItem) => todo.id !== action.payload);
		})
	},
});

export const { addTodo, toggleComplete, deleteTodo } = todoSlice.actions;

export default todoSlice.reducer;