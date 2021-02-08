require('dotenv').config();
const express = require('express');
const app = express();
const axios = require('axios').default;
const cors = require('cors');

const PORT = process.env.PORT || 4000;
axios.defaults.headers.common = { Authorization: `Bearer ${process.env.YELP_API_KEY}` };

app.use(cors());
app.use(express.json());

// GeolocationDB API
app.use('/location', async (req, res) => {
  const apiResponse = await axios.get('https://geolocation-db.com/json');
  res.json(apiResponse.data);
});

// Yelp API business search.
app.use('/yelp-restaurant', async (req, res) => {
  const { restaurantName, lat, lng } = req.query;
  try {
    const apiResponse = await axios.get('https://api.yelp.com/v3/businesses/search', {
      params: {
        term: restaurantName,
        latitude: lat,
        longitude: lng,
      },
    });
    res.json(apiResponse.data);
  } catch (err) {
    res.sendStatus(500);
  }
});

// Google Distance Matrix API
app.use('/google-distance-matrix', async (req, res) => {
  const { lat, lng, targetLat, targetLng } = req.query;
  const travelModes = ['walking', 'driving', 'bicycling', 'transit'];
  let promises = [];
  for (const travelMode of travelModes) {
    promises.push(
      axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
        params: {
          origins: `${lat},${lng}`,
          destinations: `${targetLat}, ${targetLng}`,
          mode: travelMode,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      })
    );
  }

  const responses = await Promise.all(promises);
  let distanceData = {};
  for (var i = 0; i < travelModes.length; i++) {
    distanceData[travelModes[i]] = responses[i].data.rows[0].elements[0];
  }
  res.json(distanceData);
});

app.listen(PORT, () => {
  console.log('Listening on port ' + PORT + '...');
});
