const YELP_RATING_ASSET_FOLDER = '/yelp_rating_assets/';
const GOOGLE_RATING_ASSET_FOLDER = '/default_rating_assets/';

export function Rating({ yelpRestaurant, googlePlacesRestaurant, source }) {
  function getRating() {
    const ratings = [yelpRestaurant?.rating, googlePlacesRestaurant?.rating];
    if (source === 'Yelp') {
      // Yelp
      return yelpRestaurant?.rating;
    } else if (source === 'Google') {
      // Google
      return googlePlacesRestaurant?.rating;
    }
  }

  function getNumReviews() {
    if (source === 'Yelp') {
      return yelpRestaurant?.review_count;
    } else if (source === 'Google') {
      return googlePlacesRestaurant?.user_ratings_total;
    }
  }

  let ratingAssetPath;
  switch (source) {
    case 'Yelp':
      ratingAssetPath = `${YELP_RATING_ASSET_FOLDER}${getRating()}.png`;
      break;
    case 'Google':
      ratingAssetPath = `${GOOGLE_RATING_ASSET_FOLDER}${Math.round(getRating())}.png`;
      break;
  }

  return (
    <div className="rating-container">
      {getRating() + ' '}
      <img
        className="rating-image"
        src={ratingAssetPath}
        style={{ height: '1.3em', marginTop: '-0.3em' }}
      />
      <p className="reivew-count" style={{ color: 'gray' }}>
        Based on {getNumReviews()} reviews
      </p>
    </div>
  );
}
