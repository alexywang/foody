const axios = require('axios').default;

// Return a list of photo url's based off a business's base url
async function getYelpPhotos(businessUrl) {
  const photosUrl = getYelpPhotosUrl(businessUrl);
  const photosResponse = (await yelpPhotosRequest(photosUrl)).data;
  console.log(photosResponse);
  return parsePhotosRequest(htmlData);
}

function getYelpPhotosUrl(businessUrl) {
  const terms = businessUrl.split('/');
  console.log(terms);
  const restaurantId = terms[4].split('?')[0];
  return `https://yelp.com/biz_photos/${restaurantId}`;
}

// Makes a get request to the public photos url of a yelp business
function yelpPhotosRequest(photosUrl) {
  return axios.get(photosUrl);
}

// Parse the HTML page from the photos request and return a list of photo urls
async function parsePhotosRequest(htmlData) {}

module.exports = {
  getYelpPhotos,
};
