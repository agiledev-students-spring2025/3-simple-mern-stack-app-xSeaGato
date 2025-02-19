require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const express = require('express') // CommonJS import style!
const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const cors = require('cors') // middleware for enabling CORS (Cross-Origin Resource Sharing) requests.
const mongoose = require('mongoose')


const app = express() // instantiate an Express object
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors()) // allow cross-origin resource sharing

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data
app.use(cors({ origin: 'http://localhost:7002' }));
// connect to database
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(data => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

// load the dataabase models we want to deal with
const { Message } = require('./models/Message')
const { User } = require('./models/User')

// a route to handle fetching all messages
app.get('/messages', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({})
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle fetching a single message by its id
app.get('/messages/:messageId', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({ _id: req.params.messageId })
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})
// a route to handle logging out users
app.post('/messages/save', async (req, res) => {
  // try to save the message to the database
  try {
    const message = await Message.create({
      name: req.body.name,
      message: req.body.message,
    })
    return res.json({
      message: message, // return the message we just saved
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to save the message to the database',
    })
  }
})
const path = require('path');
app.use('/public', express.static(path.join(__dirname, 'front-end', 'public')));

app.get('/app', async (req, res) => {
  const aboutMeSpecs = {
    name: "Emily Yang",
    description: `Hi, my name is Emily Yang. I am a third year student at New York University majoring in Computer Science. My main interests lie in software engineering and full-stack development. I also have experience in UI-UX and Information Technology. I am passionate about problem solving and creating innovative solutions.`,
    hobbies: [
      {
        title: "Ornithology",
        description: `Outside of computer science, I am intrigued by Ornithology. I own a cockatiel parrot named Boba. I enjoy identifying birds by their appearance and calls. I also like going for bird-watching walks in Central Park. However, so far I've only seen chickadees, blue jays, red cardinals, titmouses, and white-throated sparrows there.`,
      },
      {
        title: "Analog Photography",
        description: `I also really enjoy analog photography. I have developed my own films and printed them in a dark room before. My favorite camera is the Olympus OM-1. Spending time in the dark room teaches me patience and tenacity.`,
      }
    ],
    image: '/public/IMG_6839.JPG',
  }
  res.json(aboutMeSpecs);
});



// export the express app we created to make it available to other modules
module.exports = app // CommonJS export style!
