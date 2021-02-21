import { SERVER_URL } from '../constants.js';
import { useEffect, useState } from 'react';
import 'photoswipe/dist/photoswipe.css';
import 'photoswipe/dist/default-skin/default-skin.css';
import { Gallery, Item } from 'react-photoswipe-gallery';
import axios from 'axios';
import './Pictures.css';
axios.defaults.baseURL = SERVER_URL;

export function Pictures({ yelpPhotos, source }) {
  // Get page n

  if (!yelpPhotos) return null;

  function renderWithPhotoswipe() {
    return (
      <div className="foody-pictures-flexbox">
        <h3>Pictures from Yelp</h3>
        <Gallery>
          {yelpPhotos.map((photo) => {
            var image = new Image();
            image.src = photo.original;
            return (
              <Item
                original={photo.original}
                thumbnial={photo.original}
                width={image.width || 600}
                height={image.height || 600}
              >
                {({ ref, open }) => (
                  <img ref={ref} onClick={open} src={photo.thumbnail} width="125" height="125" />
                )}
              </Item>
            );
          })}
        </Gallery>
      </div>
    );
  }

  // return renderWithPhotoswipe();
  return (
    <div className="picutres-container">
      <h3>Photos from {source}</h3>
      <FoodyGallery photos={yelpPhotos} />
    </div>
  );
}

function FoodyGallery({ photos }) {
  return (
    <div className="foody-gallery">
      {photos.map((photo, id) => {
        return <FoodyGalleryThumbnail key={id} photo={photo} />;
      })}
    </div>
  );
}

function FoodyGalleryThumbnail({ photo }) {
  return (
    <img
      className="foody-gallery-thumbnail grow-on-hover"
      src={photo.thumbnail}
      width="135"
      height="135"
    />
  );
}
