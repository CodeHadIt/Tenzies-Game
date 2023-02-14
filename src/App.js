import {useState, useEffect} from 'react';
import Die from './components/Die';
import {nanoid} from "nanoid"
import Confetti from "react-confetti"
import './App.css';

function App() {

  const [dice, setDice] = useState(AllNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [rolls, setRolls] = useState(0);
  const [firstClick, setFirstClick] = useState(true);
  const [startTime, setStartTime] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
    
  //checks if we hold every single die and if the value of a die is equal to the value of the other dice. If so, we set tenzies to true(meaning the game has ended)
  useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
            setTimeElapsed(time => {
              let newTime = Date.now()
              time = Math.floor((newTime/1000) - (startTime/1000));
              return time
            });
        }
    }, [dice])

    //generates each individual die with three properties.
  function GenerateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
  function AllNewDice () {
        const newDice = []
        //we are looping 10x because thats the number of indivuidual dices we want to render
        for (let i = 0; i < 10; i++) {
            newDice.push(GenerateNewDie())
        }
        return newDice
    }
    
    //Ensures that any dice that has been held is not rolled again.
  function RollDice () {
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    GenerateNewDie()
            }));
            setRolls(rolls + 1);
        } else {
            setTenzies(false);
            setDice(AllNewDice());
            setRolls(0);
            setFirstClick(true);
            setStartTime(0);
        }
    }
    
    //handles the holding of each die by flipping its isHeld property to true.
  function HoldDice (id) {

    if(firstClick) {
      setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }));
        setStartTime(Date.now)
        setFirstClick(false)
    }

    else {
      setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }));
      }
    }

  const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            //When you're to pass a function to prop, you should use a CBF that calls that function instead.
            holdDice={() => HoldDice(die.id)}
        />
    ))
    
  return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={RollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
            {tenzies && <h2>Yaay🥳! congratulations. It took you <span className='accent'>{`${rolls} rolls`}</span> to victory!</h2>}
            {tenzies && <h2>And <span className='accent'>{`${timeElapsed} seconds`}</span> to complete the game.</h2>}
        </main>
    )
}

export default App;
