
// auth version using regular firebase, not firebase-admin

const firebase = require('firebase');
require('firebase/auth');
require('firebase/database');
// Initialize Firebase for the application
const config = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID
};

firebase.initializeApp(config); 

module.exports = {
  isAuthenticated: function (req, res, next) {
    const user = firebase.auth().currentUser;
    if (user !== null) {
      console.log("middleware firebase currentuser ", user)
      req.user = user;
      next();
    } else {
      console.log("no user detected")
      // res.redirect('/login');
    }
  },
}


// // add firebase auth to our server
// const admin = require('firebase-admin');
// module.exports={
//   authMe(req, res, next) {
//     console.log('req body ', req.body);
//     admin.auth().verifyIdToken(req.body.idToken)
//       .then(function(decodedToken) {
//         var uid = decodedToken.uid;
//         // ...
//         console.log("verifiedId ", uid);
//         // return res.status(200).json();
//         next.apply(this, arguments);
//       }).catch(function(error) {
//         return res.status(401).end();
//       });
//     // }
//     //console.log("next: ", next);
//   }
// }




