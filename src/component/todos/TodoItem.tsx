import React from 'react';
import { toggleCompleteAsync, deleteTodoAsync, ITodoItem } from '../../redux/todoSlice';
import { useAppDispatch } from '../../redux/hooks';

const TodoItem: React.FC<ITodoItem> = (props) => {
    const { id, title, completed } = props
    const dispatch = useAppDispatch()
    console.log(`${title} is rendering..`)

    const handleCheckboxClick = () => {
        dispatch(toggleCompleteAsync({ id: id,  title: title, completed: !completed }));
    };

    const handleDeleteClick = () => {
        dispatch(deleteTodoAsync(id));
    };

    return (
        <div>
            <li className={`list-group-item ${completed && 'list-group-item-success'}`}>
                <div className='d-flex justify-content-between'>
                    <span className='d-flex align-items-center'>
                        <input
                            type='checkbox'
                            className='mr-3'
                            checked={completed}
                            onChange={handleCheckboxClick}
                        ></input>
                        {title}
                    </span>
                    <button onClick={handleDeleteClick} className='btn btn-danger'>
                        Delete
                    </button>
                </div>
            </li>
        </div>
    );
};

//prevent other todoItems from re-render when updating current todoItem
export default React.memo(TodoItem);