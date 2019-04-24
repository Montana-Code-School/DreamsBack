const mongoose = require('mongoose');

const _id = new mongoose.Types.ObjectId();
const DATE_ONE = new Date().toISOString();
const DATE_TWO = new Date().toISOString();
const FIRST_URL = 'https://cdn.pixabay.com/photo/2016/03/09/09/43/person-1245959_150.jpg';
const SECOND_URL = 'https://cdn.pixabay.com/photo/2016/10/04/23/52/cow-1715829_150.jpg';
const NYT_URL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?&q=dreams+sleep&fq=news_desk:(%22health%22%20%22science%22)&api-key=OQKttP42ZWiOZdLWaBXQ1nfvbUKkU4Hb'
const CAP_ONE = 'a person';
const CAP_TWO = 'a cow';

// Create, Delete, and Update Constants
const DREAM_TITLE_CRUD = 'walk the dog';
const DREAM_CONTENT_CRUD = 'mountain cow dog';
const DREAM_USERID_CRUD = 'AlqCIo1zDrOu8FlvJPEyZJRr4en2';

module.exports = {
  _id,
  DATE_ONE,
  DATE_TWO,
  FIRST_URL,
  SECOND_URL,
  NYT_URL,
  CAP_ONE,
  CAP_TWO,
  DREAM_TITLE_CRUD,
  DREAM_CONTENT_CRUD,
  DREAM_USERID_CRUD
};
