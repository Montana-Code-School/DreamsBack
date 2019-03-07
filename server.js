// going to build out a simple server and
// respond to / with index.html

// use the dotenv config thing to create a process.env
require('dotenv').config();

// express builds our server framework
const express = require('express');
// for reading parameters attached on the body on a web request
const bodyParser = require('body-parser');

// path for resolving absolute paths
const path = require('path');

// mongoose the ODM that connects to mongodb
const mongoose = require('mongoose');

// add cors into the app
const cors = require('cors')

// Local variables for database
// Destructure our process.env variables
const { MONGODB_URI, PORT, FRONTEND_URL } = process.env;

// build an instance of our app:
const app = express();

const corsOptions = {
  origin: FRONTEND_URL,
  allowedHeaders: 'Origin, X-Requested-With, Content-Type',
  methods: 'GET, PUT, POST, DELETE',
}

app.use(cors(corsOptions));

// connect to your database on localhost through the URI
// now we have our URI, what do we need to pass it here -->
mongoose.connect(MONGODB_URI, {useNewUrlParser: true});

function onDBConnected(){
  console.log('we are connected to mongo db')
}
const db = mongoose.connection;
// <-- like right here, yay!

// Attach an Error handler in case of a connection error:
db.on('error', console.error.bind(console, 'connection error:'))

// Confirm connection when connected:
db.once('open', onDBConnected)


// ROUTES GO HERE
// Make a test route that sends back json and status 200 -->
// Test route yay!  which takes in req and res
const { createDream, getDreams } = require('./routeHandlers')
//Must use body-parser middleware before routes are called
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.get('/test', function(req, res){
  // it should respond with a status of 200
  // res is the response object
  // it has a method on it called status
  res.status(200);
  // it also has a method on it called json
  // which returns a JSON object -> {"somekey": "some value"}
  res.json({'message': 'worked!'})
  // data.message = "worked!"
})
// put dreams in the DB
app.post('/dreams', createDream );
// <--  here

//Get dreams from the DB
app.get('/dreams', getDreams );

// Tell our app to listen for calls
app.listen(PORT, function(){
  console.log('we are running on ' + PORT)
});
