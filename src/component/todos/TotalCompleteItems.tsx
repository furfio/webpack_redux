import React from 'react';
import { completedTodosSelector } from '../../redux/todoSlice';
import { useSelector } from 'react-redux';

const TotalCompleteItems = () => {
    const completed_todos = useSelector(completedTodosSelector)

    console.log("rendering count")

    return <h4 className='mt-3'>Total complete items: {completed_todos.length}</h4>;
};

export default TotalCompleteItems;