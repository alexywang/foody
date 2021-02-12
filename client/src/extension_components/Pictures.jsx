import { SERVER_URL } from '../constants.js';
import { useEffect, useState } from 'react';
import axios from 'axios';
axios.defaults.baseURL = SERVER_URL;

export function Pictures({ yelpRestaurant, googlePlacesRestaurant }) {
  const [yelpPictureData, setYelpPictureData] = useState();
  const [googlePictureData, setGooglePictureData] = useState();

  useEffect(() => {
    if (!yelpRestaurant) return;
    yelpPhotoScrape();
  }, [yelpRestaurant]);

  function getGooglePhotoReferences() {
    return googlePlacesRestaurant?.result?.photos;
  }

  async function yelpPhotoScrape() {
    if (!yelpRestaurant) return;
    const yelpPhotoScrapeResponse = await axios.get('/yelp-photo-scrape', {
      params: {
        yelpUrl: yelpRestaurant.url,
      },
    });

    console.log(yelpPhotoScrapeResponse.data);
  }

  console.log(getGooglePhotoReferences());

  return (
    <div class="foody-pictures-flexbox">
      <p>Google pictures here</p>
    </div>
  );
}
