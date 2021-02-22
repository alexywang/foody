const YELP_RATING_ASSET_FOLDER = '/yelp_rating_assets/';
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
      throw Error('NotImplemented');
    }
  }

  let ratingAssetPath;
  switch (source) {
    case 'Yelp':
      ratingAssetPath = `${YELP_RATING_ASSET_FOLDER}${getRating()}.png`;
      break;
    case 'Google':
      ratingAssetPath = '/google_assets';
      break;
  }

  return (
    <div className="rating-container">
      <img className="rating-image" src={ratingAssetPath} style={{ width: '40%', height: '40%' }} />
      <p className="reivew-count" style={{ color: 'gray' }}>
        Based on {getNumReviews()} reviews
      </p>
    </div>
  );
}
