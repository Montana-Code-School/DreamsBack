// use the dotenv config thing to create a process.env
require('dotenv').config();

// express builds our server framework
const express = require('express');

// for reading parameters attached on the body on a web request
const bodyParser = require('body-parser');

// cookie parser
const cookieParser = require('cookie-parser');

// mongoose the ODM that connects to mongodb
const mongoose = require('mongoose');

// add cors into the app
const cors = require('cors');

// add firebase auth to our server
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert({
    "type": process.env.FIREBASE_TYPE,
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY,
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": process.env.FIREBASE_AUTH_URI,
    "token_uri": process.env.FIREBASE_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL
  }),
  databaseURL: 'https://dream-journal-test.firebaseio.com'
});

// Local variables for database
// Destructure our process.env variables
const { MONGODB_URI, PORT, FRONTEND_URL } = process.env;

// build an instance of our app:
const app = express();

// routeHandlers are imported and destructured from our exported routeHandlers file
const {
  createDream,
  getDreamsByUserId,
  editDream,
  deleteDream,
  editDreamCases,
  stem,
  chunk,
  authenticateUser,
  logout,
} = require('./routeHandlers');

// CorsOptions allows 3rd party apps to be used
// origin is where our requests begin
// allowedHeaders is what kind of meta-data we are selecting
// methods are action-types allowed on database requests
const corsOptions = {
  origin: FRONTEND_URL,
  allowedHeaders: 'Origin, X-Requested-With, Content-Type',
  methods: 'GET, PUT, POST, DELETE',
  credentials: true,
};

// middleware to attach cors with corsOptions passed to it.
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// connect to your database on localhost through the URI
// now we have our URI, what do we need to pass it here -->
mongoose.connect(MONGODB_URI, {useNewUrlParser: true});

// notifying us that mongoose is connected to the server
function onDBConnected(){
  console.log('we are connected to mongo db');
}

/**
 * Attaches a CSRF token to the request.
 * @param {string} url The URL to check.
 * @param {string} cookie The CSRF token name.
 * @param {string} value The CSRF token value to save.
 * @return {function} The middleware function to run.
 */
function attachCsrfToken(url, cookie, value) {
  return function(req, res, next) {
    if (req.url == url) {
      res.cookie(cookie, value);
    }
    next();
  }
}

/**
 * Checks if a user is signed in and if so, redirects to profile page.
 * @param {string} url The URL to check if signed in.
 * @return {function} The middleware function to run.
 */
function checkIfSignedIn(url) {
  return function(req, res, next) {
    if (req.url == url) {
      var sessionCookie = req.cookies.session || '';
      // User already logged in.
      console.log("Session cookie being checked")
      admin.auth().verifySessionCookie(sessionCookie).then(function(decodedClaims) {
        console.log("Session cookie success")
        res.status(200).json({signedIn: true, status: "success"})
      }).catch(function(error) {
        console.log("Session cookie error, ", error)
        next();
      });
    } else {
      next();
    }
  }
}

// stashing this in a variable that we can call methods on
const db = mongoose.connection;

// Attach an Error handler in case of a connection error:
db.on('error', console.error.bind(console, 'connection error:'));

// Confirm connection when connected:
db.once('open', onDBConnected);

//import route handler for LitPage from articles.js
const { getArticles, createArticle, getAllArticles, deleteArticle } = require('./articles');

// Must use body-parser middleware before routes are called
app.use(bodyParser.urlencoded({ extended: true }));
// parse the response body back into a json object
app.use(bodyParser.json());

const debug = false;
if (debug) {
  app.use((req, res, next)=>{
    if(req.body.images) {
      req.body.images.forEach(e => {
        // console.log('image obj saved to db, ', e);
      });
    };
    next();
  });
}

// Routes
// Check all routes for session info
app.use(attachCsrfToken('/', 'csrfToken', (Math.random()* 100000000000000000).toString()));
app.use(checkIfSignedIn('/',));

app.get('/test', (req, res)=>{
  res.status(200);
  res.json({'message': 'worked!'})
})

// Get articles
app.get('/articles', getArticles);

//Get ALL articles
app.get('/articles/all', getAllArticles);

// Post articles
app.post('/articles', createArticle);

// Delete articles
app.delete('/articles', deleteArticle);

// verify firebase user via routehandler
app.post('/auth', authenticateUser );

app.get('/logout', logout);

// make a request to the stemmer
app.post('/stem', stem );

// make a request to the chunker
app.post('/chunk', chunk );

// put dreams in the DB
app.post('/dreams', createDream );

// Get dreams by user id from the DB
app.get('/dreams', getDreamsByUserId );

// editing a dream, saving it in the DB and recieving edited dreams from the DB
app.put('/dreams', editDream);

// delete a dream
app.delete('/dreams', deleteDream);

// Tell our app to listen for calls
app.listen(PORT, function(){
  console.log('we are running on ' + PORT);
});
