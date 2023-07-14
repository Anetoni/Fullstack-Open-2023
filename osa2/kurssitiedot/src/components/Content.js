import Part from './Part'
import Total from './Total'

const Content = ({ parts }) => {
    console.log("Osat: ", parts)
    const sum = parts.reduce((sum, part) => sum + part.exercises, 0)
    return (
        <div>
            {parts.map(part => 
                <Part key={part.id} part={part}></Part>
            )}
            <Total sum={sum}/>
        </div>
    )
}

export default Content