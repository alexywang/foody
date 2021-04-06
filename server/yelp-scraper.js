const axios = require('axios').default.create();

// Return a list of photo url's based off a business's base url
async function getYelpPhotos(businessUrl) {
  const photosResponse = (await yelpPhotosRequest(businessUrl)).data;
  return parseYelpPhotosRequest(photosResponse);
}

function getYelpPhotosUrl(businessUrl) {
  const terms = businessUrl.split('/');
  const restaurantId = terms[4].split('?')[0];
  return `https://yelp.com/biz_photos/${restaurantId}`;
}

// Makes a get request to the public photos url of a yelp business
function yelpPhotosRequest(businessUrl) {
  console.log('Getting Yelp Photos');
  return axios.get(getYelpPhotosUrl(businessUrl), {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36',
    },
  });
}

// Parse the HTML page from the photos request and return a list of photo urls
function parseYelpPhotosRequest(htmlData) {
  let photos = [];
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
    const thumbnailUrl = urls[0]; // Get smallest thumbnail
    const splitUrl = thumbnailUrl.split('/');
    // if (splitUrl.length > 6) {
    //   matches[i] = null;
    //   continue; // Not a picture of the restaurant
    // }
    const slug = splitUrl[4];
    photos.push({
      thumbnail: thumbnailUrl,
      original: `https://s3-media0.fl.yelpcdn.com/bphoto/${slug}/o.jpg`,
    });
  }
  // index 0 is for some reason a tiny version of index 1, and last is not a picture of the restaurant
  return photos.splice(1, photos.length - 2);
}

// TESTING
const testurl = 'https://www.yelp.ca/biz/la-luncheonette-montr%C3%A9al';
const photos = getYelpPhotos(testurl);

module.exports = {
  getYelpPhotos,
  yelpPhotosRequest,
  parseYelpPhotosRequest,
};
