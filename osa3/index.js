const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(morgan(':method :url :status: :res[content-length] - :response-time ms :body'))
app.use(cors())

morgan.token('body', function(req, res) { return JSON.stringify(req.body)})

let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    }
  ]

app.get('/', (req, res) => {
    res.send('<h1>Hello world<h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    
    if(person) {
        res.json(person)
    } else {
        res.status(404).end() // Not found error code
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})


app.post('/api/persons', (req, res) => {
    const randId = Math.floor(Math.random() * (100 - 10) + 10) //ID is a random number 10 and 100

    const person = req.body
    person.id = randId

    if (!person.name || !person.number) {
        return res.status(400).json({
            error: 'name or number missing'
        })
    }

    if (persons.find(p => p.name === person.name)) {
        return res.status(409).json({
            error: "name must be unique"
        })
    }

    persons = persons.concat(person)
    console.log(persons)

    res.json(person)
})

app.get('/info', (req, res) => {
    const info = persons.length
    console.log("Phonebook has info for " + info)
    const request_time = new Date().toString()
    console.log(request_time)
    res.send(`Phonebook has info for ${info} people<br>${request_time}` )
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

