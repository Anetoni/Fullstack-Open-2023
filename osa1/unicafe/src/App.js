import { useState } from 'react'

const Button = ({handleClick, text}) => {
  return(
    <button onClick={handleClick}>
      {text} 
    </button>
  )
}

const StatisticsLine = ({text, value}) => {
  return(
    <div>
      <table>
        <tbody>
          <tr>
            <td>{text}</td>
            <td>{value}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

const Statistics = (props) => {
  if(props.total === 0) 
    return (
      <div>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </div>
    )
  return (
    <div>
      <StatisticsLine text="good" value={props.good}/>
      <StatisticsLine text="neutral" value={props.neutral}/>
      <StatisticsLine text="bad" value={props.bad}/>
      <StatisticsLine text="all" value={props.total}/>
      <StatisticsLine text="average" value={props.average}/>
      <StatisticsLine text="positive" value={props.positive}/>
    </div>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const total = good + neutral + bad
  const average = (good - bad) / total
  const positive = (good / total) * 100

  const handleGoodClick = () => {
    console.log('good clicked')
    const updatedGood = good + 1
    setGood(updatedGood)
  }

  const handleNeutralClick = () => {
    console.log('neutral clicked')
    const updatedNeutral = neutral + 1
    setNeutral(updatedNeutral)
  }

  const handleBadClick = () => {
    console.log('bad clicked')
    const updatedBad = bad + 1
    setBad(updatedBad)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleGoodClick} text="good"/>
      <Button handleClick={handleNeutralClick} text="neutral"/>
      <Button handleClick={handleBadClick} text="bad"/>
      <Statistics positive={positive} total={total} average={average} good={good} neutral={neutral} bad={bad} />

    </div>
  )
}

export default App
