import { useEffect, useState } from 'react';
import { SERVER_URL } from '../constants.js';
const axios = require('axios').default;
axios.defaults.baseURL = SERVER_URL;

const getParams = () => {
  let search = window.location.search;
  return new URLSearchParams(search);
};

export function Extension() {
  const [restaurantName, setRestaurantName] = useState();
  const [location, setLocation] = useState();

  // API data
  const [yelpSearchData, setYelpSearchData] = useState();

  const getLocation = async () => {
    const response = await axios.get('/location');
    const geolocation = response.data;
    console.log(geolocation);
    setLocation(geolocation);
  };

  const get;

  // componentDidMount
  useEffect(() => {
    // Get query params
    const params = getParams();
    setRestaurantName(params.get('name'));

    // Get location
    getLocation();
  }, []);

  return (
    <div>
      <h1>{restaurantName}</h1>
    </div>
  );
}
