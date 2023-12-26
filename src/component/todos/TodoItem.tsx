import React from 'react';
import { useDispatch } from 'react-redux';
import { toggleCompleteAsync, deleteTodoAsync, todoItem } from '../../redux/todoSlice';
import { AppDispatch } from '../../redux/store';

interface Props {
    item: todoItem
}

const TodoItem: React.FC<Props> = (props) => {
    const {item} = props
    const dispatch = useDispatch<AppDispatch>();

    const handleCheckboxClick = () => {
        console.log({id: item.id, title: item.title, completed: !item.completed})
        dispatch(toggleCompleteAsync({id: item.id, title: item.title, completed: !item.completed}));
    };

    const handleDeleteClick = () => {
        dispatch(deleteTodoAsync(item));
    };

    return (
        <div>
            <li className={`list-group-item ${item.completed && 'list-group-item-success'}`}>
                <div className='d-flex justify-content-between'>
                    <span className='d-flex align-items-center'>
                        {item.completed ?? '123123'}
                        <input
                            type='checkbox'
                            className='mr-3'
                            checked={item.completed}
                            onChange={handleCheckboxClick}
                        ></input>
                        {item.title}
                    </span>
                    <button onClick={handleDeleteClick} className='btn btn-danger'>
                        Delete
                    </button>
                </div>
            </li>
        </div>
    );
};

export default TodoItem;