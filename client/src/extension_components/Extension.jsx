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

  const getLocation = () => {
    return axios.get('/location');
  };

  const getYelpSearch = (restaurantName, lat, lng) => {
    return axios.get('/yelp-restaurant', {
      params: {
        restaurantName,
        lat,
        lng,
      },
    });
  };

  const setup = async (restaurantName) => {
    // Get location first as other requests depend on it
    const fetchedLocation = await getLocation();
    const lat = fetchedLocation.data.latitude;
    const lng = fetchedLocation.data.longitude;
    console.log(fetchedLocation.data);
    const yelpSearchData = await getYelpSearch(restaurantName, lat, lng);
    setYelpSearchData(yelpSearchData.data);
    console.log(yelpSearchData.data);
  };

  // componentDidMount
  useEffect(() => {
    // Get query params
    const params = getParams();
    const restaurantName = params.get('name');
    setRestaurantName(restaurantName);

    setup(restaurantName);
  }, []);

  return (
    <div>
      <h1>{restaurantName}</h1>
    </div>
  );
}
