import {ACTIONS} from './App'
import click from './assets/click.mp3'

export default function OperationButton({dispatch, operation}){
  
    // new Audio(click).play()
    return  <button onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation } })}>{operation}</button>
  
  
  
}