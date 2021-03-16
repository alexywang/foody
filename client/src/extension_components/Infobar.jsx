import { useEffect, useState } from 'react';
import './Infobar.css';
import { Rating } from './Rating';

export function Infobar({ yelpRestaurant, googleDistanceData, googlePlacesRestaurant, source }) {
  const TRAVEL_MODE_ASSET_FOLDER = '/travel_mode_assets';
  const TRAVEL_MODES = ['walking', 'driving', 'bicycling', 'transit'];
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

  function getTravelModeIcon() {
    return `${TRAVEL_MODE_ASSET_FOLDER}/${TRAVEL_MODES[activeTravelMode]}.png`;
  }

  function getTravelTime() {
    if (!googleDistanceData) return null;

    return Number.parseInt(googleDistanceData[TRAVEL_MODES[activeTravelMode]].duration.text);
  }

  console.log(googlePlacesRestaurant);
  return (
    <div className="infobar">
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
          <span
            className="travel-mode"
            onClick={() => setActiveTravelMode((activeTravelMode + 1) % TRAVEL_MODES.length)}
          >
            <img style={{ height: '1.5vw' }} src={getTravelModeIcon()} /> Approx. {getTravelTime()}{' '}
            min {TRAVEL_MODE_LANGUAGE[activeTravelMode]} away.
          </span>
          <br />
          <a href={googlePlacesRestaurant?.result?.url}>
            {yelpRestaurant?.location.address1 + ', ' + yelpRestaurant?.location.city}
          </a>
        </div>
      </div>
    </div>
  );
}
