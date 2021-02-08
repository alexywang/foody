import { useEffect, useState } from 'react';
import { SERVER_URL } from '../constants.js';
import { Infobar } from './Infobar';
const axios = require('axios').default;
axios.defaults.baseURL = SERVER_URL;

const getParams = () => {
  let search = window.location.search;
  return new URLSearchParams(search);
};

const getTopYelpResult = (yelpSearchData) => {
  return yelpSearchData?.businesses[0];
};

export function Extension() {
  const [restaurantName, setRestaurantName] = useState();
  const [errorReason, setErrorReason] = useState();

  // API data
  const [location, setLocation] = useState();
  const [yelpSearchData, setYelpSearchData] = useState();
  const [googleDistanceData, setGoogleDistanceData] = useState();

  function getLocation() {
    return axios.get('/location');
  }

  function getYelpSearch(restaurantName, lat, lng) {
    return axios.get('/yelp-restaurant', {
      params: {
        restaurantName,
        lat,
        lng,
      },
    });
  }

  function getGoogleDistanceMatrixData(lat, lng, targetLat, targetLng) {
    // TODO: finish client side fetch
    return axios.get('/google-distance-matrix', {
      params: {
        lat,
        lng,
        targetLat,
        targetLng,
      },
    });
  }

  async function setup(restaurantName) {
    // Get location first as other requests depend on it
    let locationResponse, lat, lng;
    try {
      locationResponse = await getLocation();
      lat = locationResponse.data.latitude;
      lng = locationResponse.data.longitude;
      setLocation({ lat, lng });
      console.log(locationResponse.data);
    } catch (error) {
      console.error(error);
      setErrorReason('LocationFailed');
      return;
    }

    // Yelp business search api
    let yelpSearchResponse;
    try {
      yelpSearchResponse = await getYelpSearch(restaurantName, lat, lng);
      setYelpSearchData(yelpSearchResponse.data);
      console.log(yelpSearchResponse.data);
    } catch (error) {
      console.error(error);
      setErrorReason('YelpFailed');
      return;
    }

    // No matches on Yelp API search
    // if (!yelpSearchData || yelpSearchData.businesses.length == 0) {
    //   setErrorReason('YelpNotFound');
    //   return;
    // }

    // Google distance matrix api
    let googleDistanceMatrixResponse;
    const yelpTopSearchResult = getTopYelpResult(yelpSearchResponse.data);
    try {
      const targetLat = yelpTopSearchResult.coordinates.latitude;
      const targetLng = yelpTopSearchResult.coordinates.longitude;
      googleDistanceMatrixResponse = await getGoogleDistanceMatrixData(
        lat,
        lng,
        targetLat,
        targetLng
      );
      console.log(googleDistanceMatrixResponse.data);
      setGoogleDistanceData(googleDistanceMatrixResponse.data);
    } catch (error) {
      console.error(error);
      setErrorReason('GoogleMapsFailed');
      return;
    }
  }

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
      <Infobar
        yelpRestaurant={getTopYelpResult(yelpSearchData)}
        googleDistanceData={googleDistanceData}
        location={location}
      />
    </div>
  );
}
