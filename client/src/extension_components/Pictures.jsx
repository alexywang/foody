import { SERVER_URL } from '../constants.js';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './Pictures.css';
axios.defaults.baseURL = SERVER_URL;

const THUMBNAIL_HEIGHT = 135;
const THUMBNAIL_WIDTH = 135;

const GALLERY_MAX_ROWS = 3;
const GALLERY_MAX_COLS = 5;

export function Pictures({ yelpPhotos, source, googlePhotos }) {
  if (!yelpPhotos) return null;

  function getPhotosForSource() {
    if (source === 'Yelp') {
      return yelpPhotos;
    } else if (source === 'Google') {
      return googlePhotos;
    }
  }

  return (
    <div className="picutres-container">
      <h3>Photos from {source}</h3>
      <FoodyGallery photos={getPhotosForSource()} />
    </div>
  );
}

function FoodyGallery({ photos }) {
  const [selectedPhoto, setSelectedPhoto] = useState();

  function onThumbnailClicked(photo) {
    setSelectedPhoto(photo);
  }
  function onOverlayClicked() {
    setSelectedPhoto(null);
  }
  // Calculate dimensions of gallery
  if (!photos) {
    return null; // TODO: Return a loading spinner here
  }

  return (
    <div className="foody-gallery">
      {photos.map((photo, id) => {
        return <FoodyGalleryThumbnail onClick={onThumbnailClicked} key={id} photo={photo} />;
      })}
      <FoodyGalleryOverlay onClick={onOverlayClicked} photo={selectedPhoto} />
    </div>
  );
}

function FoodyGalleryOverlay({ photo, onClick }) {
  if (!photo) return null;

  return (
    <div onClick={onClick} className="overlay">
      <img className="foody-gallery-fullsize" src={photo.original} />
    </div>
  );
}

function FoodyGalleryThumbnail({ photo, onClick }) {
  return (
    <img
      onClick={() => onClick(photo)}
      className="foody-gallery-thumbnail grow-on-hover"
      src={photo.thumbnail}
      max-={THUMBNAIL_WIDTH}
      height={THUMBNAIL_HEIGHT}
    />
  );
}
