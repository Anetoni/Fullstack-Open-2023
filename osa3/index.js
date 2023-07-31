require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(morgan(':method :url :status: :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('build'))

morgan.token('body', function(req, res) { return JSON.stringify(req.body)})

app.get('/', (req, res) => {
    res.send('<h1>Hello world<h1>')
})

// get request to handle all person data
app.get('/api/persons', (req, res) => {
    Person.find({}).then(people => {
        res.json(people)
    })
})

// get specific person information with id
app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).then(person => {
        res.json(person)
    })
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

// post new person data
app.post('/api/persons', (req, res) => {
    const body = req.body

    console.log(body)

    if(!body.name || !body.number) {
        return res.status(400).json({'error': 'Name and number are required'})
    }

    const person = new Person({
        name: body.name,
        number: body.number
    }) 

    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
})
//
app.get('/info', (req, res) => {
    const people = Person.find({})
    console.log("Phonebook has info for " + people.length)
    const request_time = new Date().toString()
    console.log(request_time)
    res.send(`Phonebook has info for ${people.length} people<br>${request_time}` )
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

