require('dotenv').config();
const express = require('express');
const { performance } = require('perf_hooks');
const app = express();
const axios = require('axios').default;
const cors = require('cors');
const { parseYelpPhotosRequest, yelpPhotosRequest } = require('./yelp-scraper');
const {
  getOpenTableInternalApiSearch,
  scrapeOpenTableLinkFromGoogle,
  parseOpenTableLinkFromGoogleHtml,
  openTableLinkContainsRid,
  parseRidFromOpenTableInternalSearchApi,
  generateOpenTableLinkWithRid,
} = require('./open-table-scraper');
const rateLimit = require('express-rate-limit');

const PORT = process.env.PORT || 4000;
axios.defaults.headers.common = { Authorization: `Bearer ${process.env.YELP_API_KEY}` };

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});

app.use(cors());
app.use(express.json());
app.use(limiter);

function getLocationData() {
  return axios.get('https://geolocation-db.com/json');
}

// YELP

function getYelpBusinessSearchData(restaurantName, lat, lng) {
  return axios.get('https://api.yelp.com/v3/businesses/search', {
    params: {
      term: restaurantName,
      latitude: lat,
      longitude: lng,
    },
  });
}

// GOOGLE

function getGoogleDistanceMatrixData(lat, lng, targetLat, targetLng, travelModes) {
  let promises = [];
  for (const travelMode of travelModes) {
    promises.push(
      axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
        params: {
          origins: `${lat},${lng}`,
          destinations: `${targetLat}, ${targetLng}`,
          mode: travelMode,
          key: process.env.GOOGLE_API_KEY,
        },
      })
    );
  }
  return promises;
}

function getGooglePlaceSearchData(restaurantName, lat, lng) {
  return axios.get('https://maps.googleapis.com/maps/api/place/findplacefromtext/json', {
    params: {
      key: process.env.GOOGLE_API_KEY,
      inputtype: 'textquery',
      input: restaurantName,
      locationbias: `point:${lat},${lng}`,
      fields: 'name,opening_hours,place_id,rating,user_ratings_total',
    },
  });
}

function getGooglePlaceDetails(googlePlaceId) {
  return axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
    params: {
      key: process.env.GOOGLE_API_KEY,
      place_id: googlePlaceId,
      fields: 'website,photo,url',
    },
  });
}

function getGooglePhotoWithReference(photoReference) {
  return axios.get('https://maps.googleapis.com/maps/api/place/photo', {
    params: {
      key: process.env.GOOGLE_API_KEY,
      photoreference: photoReference,
      maxheight: 1600,
      maxwidth: 1600,
    },
  });
}

// Additional endpoint for google photos not required for initial load
app.get('/photos/google', async (req, res) => {
  const { photoReferences } = req.query;
  try {
    let photoRequests = [];
    for (var photoReference of photoReferences) {
      photoRequests.push(getGooglePhotoWithReference(photoReference));
    }

    const photoResponses = await Promise.all(photoRequests);
    const photoResponseData = photoResponses.map((res) => res.data);
    res.send(photoResponseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ reason: 'GooglePhotosFailed' });
  }
});

// !! MAIN ENDPOINT
app.get('/restaurant', async (req, res) => {
  const { restaurantName, latitude, longitude, country, city } = req.query;
  const startTime = performance.now();

  // Step 1: Yelp Business Search and Google Places Search
  let yelpBusinessSearchData;
  let googlePlaceSearchData;
  let openTableLink;
  try {
    let promises = [];
    promises.push(getYelpBusinessSearchData(restaurantName, latitude, longitude));
    promises.push(getGooglePlaceSearchData(restaurantName, latitude, longitude));
    promises.push(scrapeOpenTableLinkFromGoogle(restaurantName, country, city));

    let responses = await Promise.all(promises);
    yelpBusinessSearchData = responses[0].data;
    googlePlaceSearchData = responses[1].data;
    try {
      openTableLink = parseOpenTableLinkFromGoogleHtml(responses[2].data);
    } catch (err) {
      console.err(err);
      // TODO: Internally log this so I know when this algorithm could be outdated.
      res.status(500).json({ reason: 'OpenTableLinkParseFailed' });
      return;
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ reason: 'RestaurantSearchFailed' });
    return;
  }

  // Step 1.5: Parse out the top search results
  let yelpBusinessSearchTopResult;
  let googlePlaceSearchTopResult;
  try {
    yelpBusinessSearchTopResult = yelpBusinessSearchData.businesses[0];
  } catch (err) {
    console.error(err);
    // TODO: Internally log this so I know when this algorithm could be outdated.
    res.status(500).json({ reason: 'YelpBusinessSearchResultParseFailed' });
    return;
  }

  try {
    googlePlaceSearchTopResult = googlePlaceSearchData.candidates[0];
  } catch (err) {
    console.error(err);
    // TODO: Internally log this so I know when this algorithm could be outdated.
    res.status(500).json({ reason: 'GooglePlaceSearchResultParseFailed' });
    return;
  }

  // Step 2: Get Google Distance Matrix Data, Google Place Details and Yelp Photos
  let googleDistanceMatrixData = {};
  let googlePlaceDetailsData;
  let yelpPhotos;
  const travelModes = ['walking', 'driving', 'bicycling', 'transit'];
  try {
    let promises = [];
    const distanceMatrixPromises = getGoogleDistanceMatrixData(
      latitude,
      longitude,
      yelpBusinessSearchTopResult.coordinates.latitude,
      yelpBusinessSearchTopResult.coordinates.longitude,
      travelModes
    );
    promises.push(...distanceMatrixPromises);
    promises.push(getGooglePlaceDetails(googlePlaceSearchTopResult.place_id));
    promises.push(yelpPhotosRequest(yelpBusinessSearchTopResult.url));

    // If the open table link is null, then we need to
    if (openTableLinkContainsRid(openTableLink) == null) {
      promises.push(getOpenTableInternalApiSearch(openTableLink));
    }

    const responses = await Promise.all(promises);
    const googleDistanceMatrixResponses = responses.splice(0, travelModes.length);

    for (var i = 0; i < travelModes.length; i++) {
      googleDistanceMatrixData[travelModes[i]] =
        googleDistanceMatrixResponses[i].data.rows[0].elements[0];
    }

    googlePlaceDetailsData = responses[0].data;
    yelpPhotos = parseYelpPhotosRequest(responses[1].data);

    if (openTableLinkContainsRid(openTableLink) == null) {
      openTableLink = generateOpenTableLinkWithRid(
        parseRidFromOpenTableInternalSearchApi(JSON.parse(responses[2]))
      );
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      reason: 'AdvancedGoogleDataOrYelpPhotoScrapeFailed',
      yelpBusinessSearchData: yelpBusinessSearchData,
      googlePlaceSearchData: googlePlaceSearchTopResult,
      googleDistanceMatrixData,
      googlePlaceDetailsData,
      yelpPhotos,
      openTableLink,
    });
    return;
  }

  const endTime = performance.now();
  console.log(`[Performance] Request took server ${endTime - startTime}ms to handle`);
  res.json({
    yelpBusinessSearchData: yelpBusinessSearchTopResult,
    googlePlaceSearchData: googlePlaceSearchTopResult,
    googleDistanceMatrixData,
    googlePlaceDetailsData,
    yelpPhotos,
    openTableLink,
  });
});

app.get('/', (req, res) => {
  res.send('Hello its Foody!');
});

app.get('/open-table-test', async (req, res) => {
  const x = await getOpenTableInternalApiSearch('opentable.com/r/sotto-sotto-ristorante');
  res.send(x);
});

app.listen(PORT, () => {
  console.log('Listening on port ' + PORT + '...');
});
