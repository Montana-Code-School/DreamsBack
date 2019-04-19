const {
  _id,
  FIRST_URL,
  SECOND_URL,
  DATE_ONE,
  DATE_TWO,
  CAP_ONE,
  CAP_TWO
} = require('../../constants');

const imageData = [
  {
    _id: `${_id}a`,
    url: FIRST_URL, 
    keyword: CAP_ONE,
    createdAt: DATE_ONE,
    updatedAt: DATE_ONE,
  },
  {
    _id: `${_id}b`,
    url: SECOND_URL, 
    keyword: CAP_TWO,
    createdAt: DATE_TWO,
    updatedAt: DATE_TWO,
  }
];

const bodyImagesData = [
  {
    url: FIRST_URL, 
    keyword: CAP_ONE
  },
  {
    url: SECOND_URL, 
    keyword: CAP_TWO
  }
];

module.exports = {
  imageData,
  bodyImagesData,
};