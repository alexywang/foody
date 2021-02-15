export function Rating({ value, source }) {
  let ratingAssetPath;
  switch (source) {
    case 'Yelp':
      ratingAssetPath = `/yelp_assets/${value}.png`;
      break;
    case 'Google':
      ratingAssetPath = '/google_assets';
      break;
  }

  return (
    <div className="rating-container">
      <img className="rating-image" src={ratingAssetPath} style={{ width: '40%', height: '40%' }} />
    </div>
  );
}
