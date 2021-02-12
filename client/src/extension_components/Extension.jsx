import { useEffect, useState } from 'react';
import { SERVER_URL } from '../constants.js';
import { Infobar } from './Infobar';
import { Pictures } from './Pictures';
import './Extension.css';
const axios = require('axios').default;
axios.defaults.baseURL = SERVER_URL;

const getParams = () => {
  let search = window.location.search;
  return new URLSearchParams(search);
};

const getTopYelpResult = (yelpSearchData) => {
  return yelpSearchData?.businesses[0];
};

const getTopGooglePlacesResult = (googlePlacesData) => {
  if (!googlePlacesData || !googlePlacesData.candidates) return null;
  return googlePlacesData?.candidates[0];
};

export function Extension() {
  const [restaurantName, setRestaurantName] = useState();
  const [errorReason, setErrorReason] = useState();

  // API data
  const [location, setLocation] = useState();
  const [yelpSearchData, setYelpSearchData] = useState();
  const [googleDistanceData, setGoogleDistanceData] = useState();
  const [googlePlacesData, setGooglePlacesData] = useState();

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
    return axios.get('/google-distance-matrix', {
      params: {
        lat,
        lng,
        targetLat,
        targetLng,
      },
    });
  }

  function getGooglePlacesData(restaurantName) {
    return axios.get('/google-places', {
      params: {
        restaurantName,
      },
    });
  }

  function getGooglePlaceDetailsData(googlePlaceId) {
    return axios.get('/google-place-details', {
      params: {
        googlePlaceId,
      },
    });
  }

  async function setup(restaurantName) {
    // Get location first as other requests depend on it
    let locationResponse, lat, lng, postal;
    try {
      locationResponse = await getLocation();
      lat = locationResponse.data.latitude;
      lng = locationResponse.data.longitude;
      postal = locationResponse.data.postal;
      setLocation({ lat, lng, postal });
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
    if (!yelpSearchResponse.data || yelpSearchResponse.data.businesses.length == 0) {
      setErrorReason('YelpNotFound');
      return;
    }

    // Google distance matrix api and google places, concurrently
    // parallel requests to Google APIs
    let parallel = [];
    let callbacks = [];

    let googleDistanceMatrixData;
    let googlePlacesSearchData;

    try {
      const yelpTopSearchResult = getTopYelpResult(yelpSearchResponse.data);
      const targetLat = yelpTopSearchResult.coordinates.latitude;
      const targetLng = yelpTopSearchResult.coordinates.longitude;

      parallel.push(getGoogleDistanceMatrixData(lat, lng, targetLat, targetLng));
      callbacks.push((data) => {
        setGoogleDistanceData(data);
        googleDistanceMatrixData = data;
      });
      parallel.push(getGooglePlacesData(restaurantName));
      callbacks.push((data) => {
        // setGooglePlacesData(data);
        googlePlacesSearchData = data;
      });

      let parallelResponses = await Promise.all(parallel);
      for (var i = 0; i < parallelResponses.length; i++) {
        console.log(parallelResponses[i].data);
        callbacks[i](parallelResponses[i].data);
      }
    } catch (err) {
      setErrorReason('GoogleApiError');
      return;
    }

    // Google place details
    const topGooglePlacesSearchResult = getTopGooglePlacesResult(googlePlacesSearchData);
    const googlePlaceId = topGooglePlacesSearchResult?.place_id;
    const googlePlaceDetailsResponse = await getGooglePlaceDetailsData(googlePlaceId);
    console.log(googlePlaceDetailsResponse);
    setGooglePlacesData({ ...topGooglePlacesSearchResult, ...googlePlaceDetailsResponse.data });
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
      <div className="left-section">
        <Infobar
          yelpRestaurant={getTopYelpResult(yelpSearchData)}
          googleDistanceData={googleDistanceData}
          googlePlacesRestaurant={googlePlacesData}
          location={location}
        />
        <Pictures
          yelpRestaurant={getTopYelpResult(yelpSearchData)}
          googlePlacesRestaurant={googlePlacesData}
        />
      </div>
    </div>
  );
}
