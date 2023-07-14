import personService from '../services/people'

const Persons = ({ peopleToShow, removePerson }) => {
    console.log(peopleToShow)
    return (
      <div>
        {peopleToShow.map(person =>
          <p 
            key={person.name}>{person.name} {person.number} <button onClick={() => removePerson(person)}>delete</button>
          </p>)}
      </div>
    )
}

export default Persons
