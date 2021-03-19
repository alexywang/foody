import { useEffect, useState } from 'react';
import { SERVER_URL } from '../constants.js';
import { Infobar } from './Infobar';
import { Pictures } from './Pictures';
import { SourceSelector } from './SourceSelector';
import { FoodyOpenTable } from './OpenTable';
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
  const [openTableLink, setOpenTableLink] = useState();
  const [yelpPhotos, setYelpPhotos] = useState();
  const [source, setSource] = useState('Yelp');

  const [error, setError] = useState(null);

  async function fetchRestaurantData(restaurantName) {
    const locationData = (await axios.get('https://geo.risk3sixty.com/me')).data;
    let response;
    try {
      response = await axios.get('/restaurant', {
        params: {
          restaurantName,
          latitude: locationData.ll[0],
          longitude: locationData.ll[1],
          country: locationData.country,
          city: locationData.city,
        },
      });
    } catch (err) {
      setError(err);
    }

    setYelpBusinessSearchData(response.data.yelpBusinessSearchData);
    setGooglePlaceSearchData(response.data.googlePlaceSearchData);
    setGoogleDistanceMatrixData(response.data.googleDistanceMatrixData);
    setGooglePlaceDetailsData(response.data.googlePlaceDetailsData);
    setYelpPhotos(response.data.yelpPhotos);
    setOpenTableLink(response.data.openTableLink);
    return response.data;
  }

  // componentDidMount
  useEffect(() => {
    // Get query params
    const params = getParams();
    const restaurantName = params.get('name');
    setRestaurantName(restaurantName);
    fetchRestaurantData(restaurantName);
  }, []);

  // If no error detected and some fields are null, we are loading
  if (
    !error &&
    (!yelpBusinessSearchData ||
      !googlePlaceSearchData ||
      !googleDistanceMatrixData ||
      !googlePlaceDetailsData ||
      !openTableLink ||
      !yelpPhotos)
  ) {
    return (
      <div className="loading">
        <div class="spinner-border text-success loading" role="status"></div>
      </div>
    );
  }

  return (
    <div className="extension-container">
      <div className="left-section">
        <div className="topbar">
          <h1 className="restaurant-title">{googlePlaceSearchData?.name}</h1>
          <SourceSelector setSource={setSource} source={source} />
        </div>
        <Infobar
          yelpRestaurant={yelpBusinessSearchData}
          googleDistanceData={googleDistanceMatrixData}
          googlePlacesRestaurant={{ ...googlePlaceSearchData, ...googlePlaceDetailsData }}
          source={source}
        />
        <Pictures
          yelpPhotos={yelpPhotos}
          source={source}
          googlePlaceDetails={googlePlaceDetailsData}
        />
      </div>
      <div className="right-section">
        <FoodyOpenTable openTableLink={openTableLink} />
      </div>
    </div>
  );
}
