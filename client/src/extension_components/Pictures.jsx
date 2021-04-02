import { SERVER_URL } from '../constants.js';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './Pictures.css';
axios.defaults.baseURL = SERVER_URL;

export function Pictures({ yelpPhotos, source, googlePlaceDetails }) {
  const [googlePhotos, setGooglePhotos] = useState();

  useEffect(() => {
    setGooglePhotos(generateGooglePhotos(googlePlaceDetails));
  }, [googlePlaceDetails]);

  function getPhotoUrlWithReference(googlePhotoReference, maxwidth, maxheight) {
    const url = new URL('https://maps.googleapis.com/maps/api/place/photo');
    url.searchParams.append('photoreference', googlePhotoReference);
    url.searchParams.append('key', process.env.REACT_APP_GOOGLE_API_KEY);
    url.searchParams.append('maxwidth', maxwidth);
    url.searchParams.append('maxheight', maxheight);
    return url.toString();
  }

  function generateGooglePhotos(googlePlaceDetails) {
    if (!googlePlaceDetails?.result?.photos) return null;
    return googlePlaceDetails.result.photos.map((photo) => {
      return {
        original: getPhotoUrlWithReference(photo.photo_reference, 1000, 1000),
        thumbnail: getPhotoUrlWithReference(photo.photo_reference, 600, 600),
      };
    });
  }

  function getPhotosForSource() {
    if (source === 'Yelp') {
      return yelpPhotos;
    } else if (source === 'Google') {
      // return googlePhotos;
      return yelpPhotos;
    }
  }

  return (
    <div className="picutres-container">
      {/* <h3>Photos from {source}</h3> */}
      <h3>Photos from Yelp</h3>
      <FoodyGallery photos={getPhotosForSource()} />
    </div>
  );
}

function FoodyGallery({ photos }) {
  const GALLERY_MAX_ROWS = 5;
  const GALLERY_MAX_COLS = 2;
  const photosPerPage = GALLERY_MAX_COLS * GALLERY_MAX_ROWS;

  const [selectedPhoto, setSelectedPhoto] = useState();
  const [currPage, setCurrPage] = useState(1);

  useEffect(() => {
    setCurrPage(1);
  }, [photos]);

  function getNumPages() {
    return Math.ceil(photos.length / photosPerPage);
  }

  function getCurrPage() {
    if (!photos) return [];
    const startIndex = photosPerPage * (currPage - 1);
    const endIndex = startIndex + photosPerPage;
    return photos.slice(startIndex, endIndex);
  }

  function nextPage() {
    setCurrPage(Math.min(currPage + 1, getNumPages()));
  }

  function prevPage() {
    setCurrPage(Math.max(currPage - 1, 1));
  }

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
      <div className="foody-gallery-display">
        <div>
          {getCurrPage().map((photo, id) => {
            return <FoodyGalleryThumbnail onClick={onThumbnailClicked} key={id} photo={photo} />;
          })}
          <FoodyGalleryOverlay onClick={onOverlayClicked} photo={selectedPhoto} />
        </div>
      </div>
      <div className="foody-gallery-navigator">
        <img onClick={prevPage} className="reflect-horizontally" src={'/ui/arrow-right.svg'} />
        <p>
          Page {currPage}/{getNumPages()}
        </p>
        <img onClick={nextPage} src={'/ui/arrow-right.svg'} />
      </div>
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
    />
  );
}
