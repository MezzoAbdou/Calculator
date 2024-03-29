import logo from './logo.svg';
import './App.css';
import { useReducer } from 'react';
import DigitButton from "./DigitButton"
import OperationButton from "./OperationButton"
import ping from "./assets/ping.mp3"
import click from "./assets/click.mp3"

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}
// switch statement
function reducer(state, {type, payload}){ //type is the action we want to take, payload is the data(information), 
  //state is current state before we started. reducers always return what will become the new state
  switch(type){
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite){
        return{
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.currentOperand === "0"){
        return state
      }  //this keeps you from adding too many zeros
      if (payload.digit === "." && state.currentOperand.includes(".")) {return state } 
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }
    case ACTIONS.CHOOSE_OPERATION:
      if(state.currentOperand == null && state.previousOperand == null){
        return state //makes sure that if you click an operand it doesnt click
      }

      if(state.currentOperand == null) { //if you click one operand and decide to do another
        return {
          ...state,
          operation: payload.operation
        }
      }

      if(state.previousOperand == null){
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }
    case ACTIONS.CLEAR: 
      return {}
    case ACTIONS.DELETE_DIGIT:   
    if(state.overwrite){
      return {
        ...state,
        overwrite: false,
        currentOperand: null,
      }
    }
    if (state.currentOperand == null) return state
    if (state.currentOperand.length === 1) {
      return {
        ...state, currentOperand: null
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
    }
    case ACTIONS.EVALUATE:  
  
      if(
        state.operation == null || 
        state.currentOperand == null ||
        state.previousOperand == null){
          return state
        }
        return {
          ...state,
          overwrite: true,
          previousOperand: null,
          operation: null,
          currentOperand: evaluate(state),
          
        }
          
        default:
          break;
  }
}

function evaluate({ currentOperand, previousOperand, operation}){
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch (operation){
    case "+":
      computation = prev + current
      break
    case  "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "/":
      computation = prev / current    
  }
  
    new Audio(ping).play()
  
  return computation.toString()
}
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {maximumFractionDigits: 0,})

function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}
function App() {
  function playSound() {
    new Audio(ping).play()
  }
  function playClick(){
    new Audio(click).play()
  }


  //reducer starts off as a variable array with an object and dispatch that equals the useReducer method
  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {})

  // dispatch({type: ACTIONS.ADD_DIGIT, payload: {digit: 1}})

  return (
    <div>
     <h1 onClick={playSound}>Lindsay's Calculator (sound on!)</h1>
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR})}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationButton operation="/" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className="span-two"  onClick={() => dispatch({ type: ACTIONS.EVALUATE})} >=</button>
</div>
</div>
  );
}

export default App;
