import { useEffect, useState } from 'react';
import './Infobar.css';
import { Rating } from './Rating';

export function Infobar({ yelpRestaurant, googleDistanceData, googlePlacesRestaurant, source }) {
  const TRAVEL_MODES = ['walking', 'driving', 'bicycling', 'tranist'];
  const TRAVEL_MODE_LANGUAGE = ['walk', 'drive', 'bike ride', 'transit'];
  const [activeTravelMode, setActiveTravelMode] = useState(0);

  function formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      var intlCode = match[1] ? '+1 ' : '';
      return ['(', match[2], ') ', match[3], '-', match[4]].join('');
    }
    return null;
  }

  function getTravelTime() {
    if (!googleDistanceData) return null;

    return Number.parseInt(googleDistanceData[TRAVEL_MODES[activeTravelMode]].duration.text);
  }

  console.log(googlePlacesRestaurant);
  return (
    <div className="infobar">
      <h1 className="restaurant-title">{googlePlacesRestaurant?.name}</h1>
      <div className="infobar-flex-container">
        <div id="infobar-section-contact" className="infobar-section">
          <a href={googlePlacesRestaurant?.result?.website}>
            {googlePlacesRestaurant?.result?.website}
          </a>
          <br />
          {formatPhoneNumber(yelpRestaurant?.phone)}
        </div>
        <div id="infobar-section-rating" className="infobar-section">
          {/* {ratingSource} Rating: {getRating()} */}
          <Rating
            yelpRestaurant={yelpRestaurant}
            googlePlacesRestaurant={googlePlacesRestaurant}
            source={source}
          />
        </div>
        <div id="infobar-section-distance" className="infobar-section">
          Approx. {getTravelTime()} min {TRAVEL_MODE_LANGUAGE[activeTravelMode]} away.
          <br />
          {yelpRestaurant?.location.address1 + ', ' + yelpRestaurant?.location.city}
        </div>
      </div>
    </div>
  );
}
