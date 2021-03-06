const {
  CREATE_DREAM,
  DELETE_DREAM,
  EDIT_DREAM,
  GET_DREAMS_BY_USERID,
  ERR_ARR,
  ERR_BODY,
  ERR_IMG,
  ERR_QUERY,
  ERR_ID,
  ERR_CONTENT,
  ERR_USERID,
  STEM,
  CHUNK,
  AUTHENTICATE_USER,
  LOGOUT,
} = require('./constants');

const { Dream, Image } = require('./models');

const axios = require('axios');

// add firebase auth to our server
const admin = require('firebase-admin');

const { allNewImages, noNewImages, mixedOldAndNewImages, noImages } = require('./test/data/dream');

const bodyValid = (req, res, type) => {
  switch (type) {
  case STEM:
    if(!req.body) {
      return res.status(400).json({ error: ERR_BODY });
    } else {
      return true;
    }
  case CREATE_DREAM:
    if(!req.body) {
      return res.status(400).json({ error: ERR_BODY });
    } else {
      if (!req.body.images) {
        return res.status(400).json({ error: ERR_IMG });
      } else if (!Array.isArray(req.body.images)) {
        return res.status(400).json({ error: ERR_ARR });
      } else {
        return true;
      }
    }
    break;
  case GET_DREAMS_BY_USERID:
    if (!req.query) {
      return res.status(400).json({ error: ERR_QUERY });
    } else {
      if (!req.query.userId) {
        return res.status(400).json({ error: ERR_USERID });
      } else {
        return true;
      }
    }
    break;
  case EDIT_DREAM:
    if(!req.body) {
      return res.status(400).json({ error: ERR_BODY });
    } else {
      if (!req.body._id) {
        return res.status(400).json({ error: ERR_ID });
      } else if (!req.body.title || !req.body.content || !req.body.userId) {
        return res.status(400).json({ error: ERR_CONTENT });
      } else {
        return true;
      }
    }
    break;
  case DELETE_DREAM:
    if(!req.body) {
      return res.status(400).json({ error: ERR_BODY });
    } else {
      if (!req.body._id) {
        return res.status(400).json({ error: ERR_ID });
      } else {
        return true;
      }
    }
    break;
  default:
    break;
  }
};

module.exports = {
  [LOGOUT](req, res) {
    // Clear cookie.
    var sessionCookie = req.cookies._session || '';
    res.clearCookie('session');
    // Revoke session too. Note this will revoke all user sessions.
    if (sessionCookie) {
      admin.auth().verifySessionCookie(sessionCookie, true).then(function(decodedClaims) {
        return admin.auth().revokeRefreshTokens(decodedClaims.sub);
      })
      .then(function() {
        // Redirect to login page on success, handle in react router.
        return res.status(200).json({logout: "true"})
      })
      .catch(function() {
        // Redirect to login page on error, handle in react router.
      });
    } else {
      // Redirect to login page when no session cookie available, handle in react router.
      res.status(200).json({logout: "true"});
    }
  },
  [AUTHENTICATE_USER](req, res) {
    const idToken = req.body.idToken.toString();

    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    admin.auth().verifyIdToken(idToken).then(function(decodedClaims) {
      if (new Date().getTime() / 1000 - decodedClaims.auth_time < 5 * 60) {
        return admin.auth().createSessionCookie(idToken, {expiresIn: expiresIn});
      }
      throw new Error('UNAUTHORIZED REQUEST!');
    })
    .then(function(sessionCookie) {
      const options = {maxAge: expiresIn, httpOnly: true, secure: false /** to test in localhost */};
      res.cookie('session', sessionCookie, options);
      res.end(JSON.stringify({status: 'success'}));
    })
    .catch(function(error) {
      console.log(error);
      res.status(401).send('UNAUTHORIZED REQUEST!');
    });
  },
  [STEM](req, res) {

    const params = new URLSearchParams();
    console.log('req body ', req.body);
    params.append('text', req.body.text);
    params.append('stemmer', 'wordnet');
    axios.post('http://text-processing.com/api/stem/', params)
      .then(response => {
        console.log('axios response, ', response.data);
        res.status(200).json(response.data);
      })
      .catch((error) => {
        res.status(400).json(error);
      });

  },
  [CHUNK](req, res) {
    const params = new URLSearchParams();
    console.log('req body ', req.body);
    params.append('text', req.body.text);
    axios.post('http://text-processing.com/api/tag/', params)
      .then(response => {
        console.log('axios response, ', response.data);
        res.status(200).json(response.data);
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  },
  [CREATE_DREAM](req, res) {
    if(bodyValid(req, res, CREATE_DREAM)) {
      Image.create(req.body.images, (err, savedImages) => {
        if (err) return res.status(400).json(err);
        Dream.create({...req.body, images: savedImages}, (err, savedDream) => {
          if (err) return res.status(400).json(err);
          res.status(201).json(savedDream);
        });
      });
    }
  },
  [GET_DREAMS_BY_USERID](req, res) {
    if(bodyValid(req, res, GET_DREAMS_BY_USERID)) {
      Dream.find(req.query).populate('images').then(function(dreams, err){
        if (err) return res.status(500).json(err);
        res.status(200).json(dreams);
      });
    }
  },
  [EDIT_DREAM](req, res){
    let noImgs = !req.body.images.length;
    let allNew = !req.body.images.filter( image => image._id).length;
    let someNew = (req.body.images.filter( image => image._id).length !== req.body.images.length);
    let noNew = (req.body.images.filter( image => image._id).length === req.body.images.length);
    if(noImgs) {
      if(bodyValid(req, res, EDIT_DREAM)) {
        const { _id, title, content, userId, images } = req.body;
        const imagePromises = [];
        for (let i = 0; i < images.length; i++) {
          imagePromises.push(Image.findByIdAndUpdate(
            images[i]._id,
            { keyword: images[i].keyword, lastViewedIndex: images[i].lastViewedIndex },
            { new: true },
            (err, savedImage) => {
              if (err) return res.status(400).json(err);
            }).exec());
        }
        Promise.all(imagePromises)
          .then(()=> {
            Dream.findByIdAndUpdate(
              _id,
              {title, content, userId, images},
              {new: true},
            ).populate('images')
              .exec(function(err, editedDream){
                if (err) return res.status(400).json(err);
                res.status(200).json(editedDream);
              });
          });
      }
    } else if (allNew) {
      if(bodyValid(req, res, EDIT_DREAM)) {
        const { _id, title, content, userId, images } = req.body;
        Image.create(images, (err, savedImages) => {
          if (err) return res.status(400).json(err);
          Dream.findByIdAndUpdate(
            _id,
            {title, content, userId, images: savedImages},
            {new: true},
          ).populate('images')
            .exec(function(err, editedDream){
              if (err) return res.status(400).json(err);
              res.status(200).json(editedDream);
            });
        });
      }
    } else if (someNew) {
      if(bodyValid(req, res, EDIT_DREAM)) {
        const { _id, title, content, userId, } = req.body;
        let { images } = req.body;
        const imagesWithoutId = [];
        let imagesWithId = [];
        for (let i = 0; i < images.length; i++){
          if(!images[i]._id){
            imagesWithoutId.push(images[i]);
          } else {
            imagesWithId.push(images[i]);
          }
        }
        Image.create(imagesWithoutId, (err, savedImages) => {
          if (err) return res.status(400).json(err);
          images = imagesWithId.concat(savedImages);
          Dream.findByIdAndUpdate(
            _id,
            {title, content, userId, images},
            {new: true},
          ).populate('images')
            .exec(function(err, editedDream){
              if (err) return res.status(400).json(err);
              res.status(200).json(editedDream);
            });
        });
      }
    } else if (noNew){
      if(bodyValid(req, res, EDIT_DREAM)) {
        const { _id, title, content, userId, images } = req.body;
        const imagePromises = [];
        for (let i = 0; i < images.length; i++) {
          imagePromises.push(Image.findByIdAndUpdate(
            images[i]._id,
            { keyword: images[i].keyword, lastViewedIndex: images[i].lastViewedIndex },
            { new: true },
            (err, savedImage) => {
              if (err) return res.status(400).json(err);
            }).exec());
        }
        Promise.all(imagePromises)
          .then(()=> {
            Dream.findByIdAndUpdate(
              _id,
              {title, content, userId, images},
              {new: true},
            ).populate('images')
              .exec(function(err, editedDream){
                if (err) return res.status(400).json(err);
                res.status(200).json(editedDream);
              });
          });
      }
    }
  },
  [DELETE_DREAM]: function(req, res){
    if(bodyValid(req, res, DELETE_DREAM)) {
      const { _id } = req.body;
      Dream.findByIdAndDelete(_id, function(err, deletedDream){
        if (err) return res.status(400).json(err);
        res.status(200).json(deletedDream);
      });
    }
  },
};
