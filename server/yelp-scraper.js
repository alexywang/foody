const axios = require('axios').default;

// Return a list of photo url's based off a business's base url
async function getYelpPhotos(businessUrl) {
  const photosUrl = getYelpPhotosUrl(businessUrl);
  const photosResponse = (await yelpPhotosRequest(photosUrl)).data;
  return parsePhotosRequest(photosResponse);
}

function getYelpPhotosUrl(businessUrl) {
  const terms = businessUrl.split('/');
  const restaurantId = terms[4].split('?')[0];
  return `https://yelp.com/biz_photos/${restaurantId}`;
}

// Makes a get request to the public photos url of a yelp business
function yelpPhotosRequest(photosUrl) {
  return axios.get(photosUrl);
}

// Parse the HTML page from the photos request and return a list of photo urls
function parsePhotosRequest(htmlData) {
  // Look for srcset tags
  const matches = htmlData.match(/srcset=".*"/gm);
  if (!matches) {
    throw Error('YelpPhotoScrapeError');
  }
  // Take the first url in the srcset
  for (var i = 0; i < matches.length; i++) {
    const urls = matches[i].match(
      /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/
    );
    if (!urls) {
      matches[i] = null;
      continue;
    }
    const thumbnailUrl = urls[0];
    const splitUrl = thumbnailUrl.split('/');
    if (splitUrl.length > 5) {
      matches[i] = null;
      continue; // Not a picture of the restaurant
    }
    const slug = splitUrl[4];
    matches[i] = `https://s3-media0.fl.yelpcdn.com/bphoto/${slug}/o.jpg`;
  }

  // index 0 is for some reason a tiny version of index 1
  console.log(matches);
  return matches.splice(1, matches.length - 1);
}

// TESTING
const testurl = 'https://www.yelp.ca/biz/la-luncheonette-montr%C3%A9al';
const photos = getYelpPhotos(testurl);

module.exports = {
  getYelpPhotos,
};
