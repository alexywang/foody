import { useEffect, useState } from 'react';
import { SERVER_URL } from '../constants.js';
import { Infobar } from './Infobar';
import { Pictures } from './Pictures';
import { SourceSelector } from './SourceSelector';
import './Extension.css';
const axios = require('axios').default;
axios.defaults.baseURL = SERVER_URL;

const getParams = () => {
  let search = window.location.search;
  return new URLSearchParams(search);
};

export function Extension() {
  const [restaurantName, setRestaurantName] = useState();
  const [location, setLocation] = useState();

  const [yelpBusinessSearchData, setYelpBusinessSearchData] = useState();
  const [googlePlaceSearchData, setGooglePlaceSearchData] = useState();
  const [googleDistanceMatrixData, setGoogleDistanceMatrixData] = useState();
  const [googlePlaceDetailsData, setGooglePlaceDetailsData] = useState();
  const [yelpPhotos, setYelpPhotos] = useState();
  const [googlePhotos, setGooglePhotos] = useState();
  const [source, setSource] = useState('Yelp');

  async function fetchRestaurantData(restaurantName) {
    const locationData = (await axios.get('https://geo.risk3sixty.com/me')).data;
    const response = await axios.get('/restaurant', {
      params: {
        restaurantName,
        latitude: locationData.ll[0],
        longitude: locationData.ll[1],
      },
    });

    console.log(response.data);

    setYelpBusinessSearchData(response.data.yelpBusinessSearchData);
    setGooglePlaceSearchData(response.data.googlePlaceSearchData);
    setGoogleDistanceMatrixData(response.data.googleDistanceMatrixData);
    setGooglePlaceDetailsData(response.data.googlePlaceDetailsData);
    setYelpPhotos(response.data.yelpPhotos);
    return response.data;
  }

  async function getGooglePhotos() {
    if (!googlePlaceDetailsData?.result?.photos) return null;
    const photoReferences = googlePlaceDetailsData.result.photos.map(
      (photo) => photo.photo_reference
    );
    const googlePhotosResponse = await axios.get('/photos/google', {
      params: {
        photoReferences,
      },
    });
    console.log('Google photos');
    console.log(googlePhotosResponse.data);
  }

  // componentDidMount
  useEffect(() => {
    // Get query params
    const params = getParams();
    const restaurantName = params.get('name');
    setRestaurantName(restaurantName);
    fetchRestaurantData(restaurantName);
  }, []);

  return (
    <div>
      <div className="left-section">
        <div className="topbar">
          <h1 className="restaurant-title">{googlePlaceSearchData?.name}</h1>
          <SourceSelector setSource={setSource} source={source} onGoogleClick={getGooglePhotos} />
        </div>
        <Infobar
          yelpRestaurant={yelpBusinessSearchData}
          googleDistanceData={googleDistanceMatrixData}
          googlePlacesRestaurant={{ ...googlePlaceSearchData, ...googlePlaceDetailsData }}
          source={source}
        />
        <Pictures yelpPhotos={yelpPhotos} source={source} googlePhotos={googlePhotos} />
      </div>
    </div>
  );
}
