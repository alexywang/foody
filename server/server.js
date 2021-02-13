require('dotenv').config();
const express = require('express');
const app = express();
const axios = require('axios').default;
const cors = require('cors');
const { getYelpPhotos } = require('./yelp-scraper');

const PORT = process.env.PORT || 4000;
axios.defaults.headers.common = { Authorization: `Bearer ${process.env.YELP_API_KEY}` };

app.use(cors());
app.use(express.json());

function getLocationData() {
  return axios.get('https://geolocation-db.com/json');
}

function getYelpBusinessSearchData(restaurantName, lat, lng) {
  return axios.get('https://api.yelp.com/v3/businesses/search', {
    params: {
      term: restaurantName,
      latitude: lat,
      longitude: lng,
    },
  });
}

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
      fields: 'name,opening_hours,place_id,rating',
    },
  });
}

function getGooglePlaceDetails(googlePlaceId) {
  return axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
    params: {
      key: process.env.GOOGLE_API_KEY,
      place_id: googlePlaceId,
      fields: 'website,photo',
    },
  });
}

// TODO: Use yelp business base url to find and scrape srcs on pictures page
app.get('/yelp-photo-scrape', async (req, res) => {
  // const { yelpUrl } = req.query;
  // getYelpPhotos(yelpUrl);
  res.json({ 'yelp-photo-scrape': 'not implemented' });
});

// !! MAIN ENDPOINT
app.get('/restaurant', async (req, res) => {
  const { restaurantName } = req.query;
  const startTime = new Date().getMilliseconds();

  // Step 1: Get Location Data
  let locationData;
  try {
    locationData = (await getLocationData()).data;
  } catch (err) {
    console.error(err);
    res.status(500).json({ reason: 'LocationFailed' });
  }

  // Step 2: Yelp Business Search and Google Places Search
  let yelpBusinessSearchData;
  let googlePlaceSearchData;
  try {
    let promises = [];
    promises.push(
      getYelpBusinessSearchData(restaurantName, locationData.latitude, locationData.longitude)
    );
    promises.push(
      getGooglePlaceSearchData(restaurantName, locationData.latitude, locationData.longitude)
    );

    let responses = await Promise.all(promises);
    yelpBusinessSearchData = responses[0].data;
    googlePlaceSearchData = responses[1].data;
  } catch (err) {
    console.error(err);
    res.status(500).json({ reason: 'RestaurantSearchFailed' });
    return;
  }

  // Step 2.5: Parse out the top search results
  let yelpBusinessSearchTopResult;
  let googlePlaceSearchTopResult;
  try {
    yelpBusinessSearchTopResult = yelpBusinessSearchData.businesses[0];
  } catch (err) {
    console.error(err);
    res.status(500).json({ reason: 'YelpBusinessSearchResultParseFailed' });
    return;
  }
  try {
    googlePlaceSearchTopResult = googlePlaceSearchData.candidates[0];
  } catch (err) {
    console.error(err);
    res.status(500).json({ reason: 'GooglePlaceSearchResultParseFailed' });
    return;
  }

  // Step 3: Get Google Distance Matrix Data, Google Place Details and Yelp Photos
  let googleDistanceMatrixData = {};
  let googlePlaceDetailsData;
  const travelModes = ['walking', 'driving', 'bicycling', 'transit'];
  try {
    let promises = [];
    const distanceMatrixPromises = getGoogleDistanceMatrixData(
      locationData.lat,
      locationData.lng,
      yelpBusinessSearchTopResult.coordinates.latitude,
      yelpBusinessSearchTopResult.coordinates.longitude,
      travelModes
    );
    promises.push(...distanceMatrixPromises);
    promises.push(getGooglePlaceDetails(googlePlaceSearchTopResult.place_id));

    const responses = await Promise.all(promises);
    const googleDistanceMatrixResponses = responses.splice(0, travelModes.length);

    for (var i = 0; i < travelModes.length; i++) {
      googleDistanceMatrixData[travelModes[i]] =
        googleDistanceMatrixResponses[i].data.rows[0].elements[0];
    }

    googlePlaceDetailsData = responses[0].data;
  } catch (err) {
    console.error(err);
    res.status(500).json({ reason: 'AdvancedGoogleDataFailed' });
    return;
  }

  res.json({
    locationData,
    yelpBusinessSearchData: yelpBusinessSearchTopResult,
    googlePlaceSearchData: googlePlaceSearchTopResult,
    googleDistanceMatrixData,
    googlePlaceDetailsData,
  });
});

app.listen(PORT, () => {
  console.log('Listening on port ' + PORT + '...');
});
