import { PayloadAction, createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../rootstore/store';

export interface ITodoItem {
    id: string,
    title: string,
    completed: boolean,
}

export interface ITodo {
    entities: ITodoItem[],
    status: Status
}

export enum Status {
    pending = 'pending',
    succeed = 'succeed',
    failed = 'failed'
}

const initTodoState: ITodo = {
    status: Status.pending,
    entities: []
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
    initialState: initTodoState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getTodosAsync.fulfilled, (state: ITodo, action: PayloadAction<ITodoItem[]>) => {
            state.status = Status.succeed;
            state.entities = action.payload;
        })
        .addCase(addTodoAsync.pending, (state: ITodo, action: PayloadAction<ITodoItem[]>) => {
            state.status = Status.pending;
        })
        .addCase(addTodoAsync.fulfilled, (state: ITodo, action: PayloadAction<ITodoItem>) => {
            state.status = Status.succeed
            state.entities.push(action.payload);
        }).
        addCase(toggleCompleteAsync.fulfilled, (state: ITodo, action: PayloadAction<ITodoItem>) => {
            const index = state.entities.findIndex(
                (todo: ITodoItem) => todo.id === action.payload.id
            );
            state.entities[index].completed = action.payload.completed;
            state.status = Status.succeed;
        }).
        addCase(toggleCompleteAsync.pending, (state: ITodo, action: PayloadAction<ITodoItem>) => {
            state.status = Status.pending;
        })
        .addCase(deleteTodoAsync.fulfilled, (state: ITodo, action: PayloadAction<string>) => {
            state.entities = state.entities.filter((todo: ITodoItem) => todo.id !== action.payload);
            state.status = Status.succeed;
        })
        .addCase(deleteTodoAsync.pending, (state: ITodo, action: PayloadAction<string>) => {
            state.status = Status.pending;
        })
    },
});

// export const { addTodo, toggleComplete, deleteTodo } = todoSlice.actions;

//selectors
export const selectTodos = (state: RootState) => state.todos
export const completedTodosSelector = createSelector(selectTodos, (todos: ITodo) =>
    todos.entities.filter((todo) => todo.completed === true)
);
export const selectTodoByIdSelector = createSelector(
    [selectTodos, (state, todoId) => todoId],
    (todos: ITodo, todoId) => todos.entities.find((todo) => todo.id === todoId)
);

export default todoSlice.reducer;