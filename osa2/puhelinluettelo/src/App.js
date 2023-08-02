/* eslint-disable no-template-curly-in-string */
import { useState, useEffect } from 'react'
import personService from './services/people'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const [notifType, setNotifType] = useState(null)

  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(initialPersons => {
        console.log('promise fulfilled')
        setPersons(initialPersons)
      })
  }, [])

  const peopleToShow = newFilter === ''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  console.log('to show: ', peopleToShow)

  const addPerson = (event) => {
    event.preventDefault()
    if(persons.find(person => person.name === newName)) {
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(person => person.name === newName)
        const updatedPerson = { ...person, number: newNumber}
        console.log('updated ', updatedPerson)
        console.log('old ', person)
        personService
          .update(person._id, updatedPerson)
            .then(updatedReturnedPerson => {
            setPersons(persons.map(p => p._id !== person._id ? p : updatedReturnedPerson))
        })
        .catch(error => {
          setNotifType('error')
          setNotification(`Information of ${person.name} has already been removed from server`)
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
        setNotifType('success')
        setNotification(`${person.name}'s phonenumber successfully changed`)
        setTimeout(() => {
          setNotification(null)
        }, 5000)
        return
      }
    }

    const newPerson = {
      name: newName,
      number: newNumber
    }

    console.log('added ', newPerson)
    personService
      .add(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
      })
      .catch(error => {
        console.log(error.response.data.error)
        setNotifType('error')
        setNotification(error.response.data.error)
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      })
      setNotifType('success')
      setNotification(`${newPerson.name} was successfully added`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
  }

  const removePerson = (person) => {
    console.log(person + ' to be removed')
    if(window.confirm(`Delete ${person.name}?`)) {
        console.log('removed id should be ', person._id)
        personService
        .remove(person._id)
          .then(() => setPersons(persons.filter(p => p._id !== person._id)))
    
        setNotifType('success')
        setNotification(`${person.name} was deleted from the phonebook`)
            setTimeout(() => {
              setNotification(null)
            }, 5000)
      }
    }

  const handlePersonChange = (event) => { 
    console.log('person: ', event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log('number: ', event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log('filter: ', event.target.value)
    setNewFilter(event.target.value)
  }

  console.log('persons: ', persons)

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} type={notifType} />
      <Filter filter={newFilter} handleFilterChange={handleFilterChange}/>
      <h3>Add a new</h3>
      <PersonForm addPerson={addPerson} handlePersonChange={handlePersonChange} handleNumberChange={handleNumberChange} newName={newName} newNumber={newNumber}/>
      <h2>Numbers</h2>
      <Persons peopleToShow={peopleToShow} removePerson={removePerson}/>
    </div>
  )
}

export default App;
