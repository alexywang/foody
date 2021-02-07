const app = require('express')();
const axios = require('axios');
const cors = require('cors');

app.use(cors());

app.use('/location', async (req, res) => {
  const getResponse = await axios.get('https://geolocation-db.com/json');
  res.json(getResponse.data);
});

app.listen(4000);
