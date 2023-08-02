const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(() => {
    console.log('connection established')
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB: ' + error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3
  },
  number: {
    type: String,
    minlength: 8,
    required: [true, 'Phonenumber required'],
    validate: {
      validator: function(number) {
        return (/(0([1-9]{1,2})-([0-9]{7}))|(0([0-9]{2})-([0-9]{8}))/).test(number)
      },
      message: 'Phonenumber doesn\'t match allowed formats'
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.__v
    delete returnedObject.id
  }
})

module.exports = mongoose.model('Person', personSchema)