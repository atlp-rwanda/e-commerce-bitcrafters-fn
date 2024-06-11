import { useSelector,useDispatch } from 'react-redux'
import { decrement, increment, incrementByAmount } from '../redux/counter';

function Counter() {
  const { count } = useSelector((state:any) => state.counter)
  const dispatch = useDispatch();
  return (
    <>
    <h1>The count is: {count}</h1>
    <button onClick={()=>dispatch(increment())}>increment</button>
    <button onClick={()=>dispatch(decrement())}>decrement</button>
    <button onClick={()=>dispatch(incrementByAmount(33))}>increment by 33</button>
    </>
  )
}

export default Counter
