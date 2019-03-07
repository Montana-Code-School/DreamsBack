const { Dream } = require('./models');

module.exports = {
  createDream: function createDream(req, res){
    Dream.create(req.body, function(err, savedDream){
      if (err) return res.status(400).json(err);
      res.status(201).json(savedDream);
    })
  },
  getDreams: function getDreams(req, res) {
    Dream.find(function(err, dreams){
      if (err) return res.status(500).json(err);
      res.status(200).json(dreams);
    })
  },
  editDream(req, res){
    console.log("edited")
    const { title, content, _id } = req.body;
    Dream.findByIdAndUpdate(_id, {title, content}, {new: true}, function(err, editedDream){
      if (err) return res.status(400).json(err);
      res.status(200).json(editedDream);
    });
  }
}