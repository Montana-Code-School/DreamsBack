const axios = require('axios');
const { GET_ARTICLES, NYT_URL, CREATE_ARTICLE, GET_ALL_ARTICLES, DELETE_ARTICLE } = require('./constants');
const { Article } = require('./models');

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
  },
  [CREATE_ARTICLE](req, res){
    Article.create(req.body, function(err, savedArticle){
      if (err) return res.status(400).json(err);
      res.status(200).json(savedArticle);
    })
  },
  [GET_ALL_ARTICLES](req, res){
    Article.find({}, function(err, articles){
      if (err) return res.status(400).json(err);
      res.status(200).json(articles);
    })
  },
  [DELETE_ARTICLE]: function(req, res){
    const { _id } = req.body;
    Article.findByIdAndDelete(_id, function(err, deletedArticle){
      if (err) return res.status(400).json(err);
      res.status(200).json(deletedArticle);
    });
  }
}
