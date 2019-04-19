const axios = require('axios');
const { GET_ARTICLES, NYT_URL } = require('./constants');

module.exports = {
[GET_ARTICLES](req, res){
  axios.get(`${NYT_URL}`)
      .then(response => {
        console.log('axios response, ', response.data);
        res.status(200).json(response.data);
      })
      .catch((error) => {
        res.status(400).json(error);
      });
 }
}

// [CREATE_ARTICLE](req, res) = {
//     Article.create(req.body, (err, savedArticle) => {
//     if (err) return res.status(400).json(err);
//     res.status(201).json(savedArticle);
//     });
//   }
