import React from 'react';
import { useSelector } from 'react-redux'
import { counterSelector } from './counterSelector'
import { useAppDispatch } from '../../app/store'
import { countSlice } from './counterSlice'

export const CounterContainer = () => {
  const count = useSelector(counterSelector)
  const dispatch = useAppDispatch()

  const addHandler = React.useCallback(() => {
    dispatch(countSlice.actions.add({num: 1}))
  },
  [])
  return (
    <div>
      {count}
      <button onClick={addHandler}>Add</button>
    </div>
  );
}