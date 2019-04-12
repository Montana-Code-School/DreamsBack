const allNewImages = {
  body: {
    title: 'all new images test',
    content: 'bee horse neptune woman test',
    userId: 'AlqCIo2zDROu8FlvJPEyZJRr4en2',
    images:[
      { url:
          'https://cdn.pixabay.com/photo/2017/01/06/17/49/honey-1958464_150.jpg',
      keyword: 'honey' },
      { url:
          'https://cdn.pixabay.com/photo/2017/12/10/15/16/white-horse-3010129_150.jpg',
      keyword: 'horse' },
      { url:
          'https://cdn.pixabay.com/photo/2017/09/18/17/34/fantasy-2762571_150.jpg',
      keyword: 'woman' }
    ],
    _id: '5c915014cacbdf608b2aea46'
  }
};

const noImages = {
  body: {
    title: 'no images test',
    content: 'bee horse neptune woman',
    userId: 'AlqCIo2zDROu8FlvJPEyZJRr4en2',
    images: [],
    _id: '5c915014cacbdf608b2aea46'
  }
};

const noNewImages = {
  body: {
    title: 'no new images test',
    content: 'blue green gold',
    userId: 'AlqCIo2zDROu8FlvJPEyZJRr4en2',
    images: [
      { url:
            'https://cdn.pixabay.com/photo/2014/12/24/05/02/drops-of-water-578897_150.jpg',
      keyword: 'blue',
      _id: '5c92754acb358803b7875a0e' },
      { url:
            'https://cdn.pixabay.com/photo/2017/04/09/09/56/avenue-2215317_150.jpg',
      keyword: 'green',
      _id: '5c92754acb358803b7875a0f' },
      { url:
            'https://cdn.pixabay.com/photo/2018/11/01/05/33/british-columbia-3787200_150.jpg',
      keyword: 'gold',
      _id: '5c92754acb358803b7875a10' }
    ],
    _id: '5c92754acb358803b7875a11'
  }
};

const mixedOldAndNewImages = {
  body: {
    title: 'mixed images test',
    content: 'blue green gold black',
    userId: 'AlqCIo2zDROu8FlvJPEyZJRr4en2',
    images:
    [ { url:
          'https://cdn.pixabay.com/photo/2014/12/24/05/02/drops-of-water-578897_150.jpg',
    keyword: 'blue',
    _id: '5c92754acb358803b7875a0e' },
    { url:
          'https://cdn.pixabay.com/photo/2017/04/09/09/56/avenue-2215317_150.jpg',
    keyword: 'green',
    _id: '5c92754acb358803b7875a0f' },
    { url:
          'https://cdn.pixabay.com/photo/2018/11/01/05/33/british-columbia-3787200_150.jpg',
    keyword: 'gold',
    _id: '5c92754acb358803b7875a10' },
    { url:
          'https://cdn.pixabay.com/photo/2015/12/01/15/43/black-1072366_150.jpg',
    keyword: 'black' } ],
    _id: '5c92754acb358803b7875a11'
  }
};

module.exports = {
  allNewImages,
  noNewImages,
  mixedOldAndNewImages,
  noImages,
};
