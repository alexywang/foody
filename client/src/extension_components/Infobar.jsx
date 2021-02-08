import { useEffect, useState } from 'react';

export function Infobar({ yelpRestaurant, googleDistanceData, location }) {
  const TRAVEL_MODES = ['walking', 'driving', 'bicycling', 'tranist'];
  const [ratingSource, setRatingSource] = useState('Yelp');
  const [activeTravelMode, setActiveTravelMode] = useState(0);

  function getRating() {
    if (ratingSource == 'Yelp') {
      return yelpRestaurant?.rating;
    } else {
      return 'TODO!';
    }
  }

  return (
    <div className="infobar">
      <h1>{yelpRestaurant?.name}</h1>
      <div id="infobar-section-contact" className="infobar-section">
        {yelpRestaurant?.phone}
      </div>
      <div id="infobar-section-rating" className="infobar-section">
        {ratingSource} Rating: {getRating()}
      </div>
      <div id="infobar-section-distance" className="infobar-section">
        {googleDistanceData
          ? googleDistanceData[TRAVEL_MODES[activeTravelMode]].duration.text
          : null}{' '}
        by {TRAVEL_MODES[activeTravelMode]}
      </div>
    </div>
  );
}
