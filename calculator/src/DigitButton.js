import {ACTIONS} from './App'
import click from "./assets/click.mp3"


export default function DigitButton({dispatch, digit}){
  //new Audio(click).play()
  return  <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })}>{digit}</button>
    
}