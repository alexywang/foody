import axios from 'axios';
axios.defaults.baseURL = SERVER_URL;
import { useEffect, useState } from 'react';

export function Pictures({ yelpRestaurant, googlePlacesRestaurant }) {
  const [yelpPictureData, setYelpPictureData] = useState();
  const [googlePictureData, setGooglePictureData] = useState();

  useEffect(() => {
    if (!googlePlacesRestaurant) return;
  }, [googlePlacesRestaurant]);

  function getGooglePhotoReferences() {
    return googlePlacesRestaurant?.result?.photos;
  }

  async function getScrapedYelpPhotos() {
    const photos = await axios.get('/yelp-photo-scrape');
  }

  console.log(getGooglePhotoReferences());

  return (
    <div class="foody-pictures-flexbox">
      <p>Google pictures here</p>
    </div>
  );
}
