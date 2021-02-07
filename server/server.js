const express = require('express');
const app = express();
const axios = require('axios').default;
const cors = require('cors');

const PORT = process.env.PORT || 4000;
console.log(process.env.YELP_API_KEY);
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
  const { name, lat, lng } = req.params;
  try {
    const apiResponse = await axios.get('https://api.yelp.com/v3/business/search', {
      params: {
        term: name,
        latitude: lat,
        longitude: lng,
      },
    });
    res.json(apiResponse.data);
  } catch (err) {
    console.error(err);
  }
});

app.listen(PORT, () => {
  console.log('Listening on port ' + PORT + '...');
});
