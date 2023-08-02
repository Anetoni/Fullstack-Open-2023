require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status: :res[content-length] - :response-time ms :body'))
app.use(express.static('build'))

morgan.token('body', function(req) { return JSON.stringify(req.body)})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// get request to handle all person data
app.get('/api/persons', (req, res) => {
  Person.find({}).then(people => {
    res.json(people)
  })
})

// get specific person information with id
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id).then(person => {
    if(person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  })
    .catch(error => next(error))
})

// delete the specified person from the database and the phonebook
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

// post new person data
app.post('/api/persons', (req, res, next) => {
  const body = req.body

  console.log(body)

  if(!body.name || !body.number) {
    return res.status(400).json({ 'error': 'Name and number are required' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
    .catch(error => next(error))
})

// updates person data with new number if person already exists in the phonebook
app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findByIdAndUpdate(req.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

//shows how many people are stored in the phonebook, and the current time
app.get('/info', (req, res) => {
  const request_time = new Date().toString()

  Person.countDocuments({}).then(count => {
    res.send(`Phonebook has info for ${count} people<br>${request_time}` )
  })
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

