const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('Please provide the password as an argument:')
  process.exit(1)  // exit program with error code if no arguments are provided
}

const password = process.argv[2]

const url = `mongodb+srv://ahoqo:${password}@fsopen.u9uwhyc.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(() => {
    console.log('connection established')
  }).catch((error) => {
    console.log('Error connecting to MongoDB: ' + error.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person
    .find({})
    .then(persons => {
      console.log('phonebook:')
      persons.forEach(person => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close()
      console.log('connection closed')
    })
} else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then(() => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
    console.log('connection closed')
  })
}