import { SERVER_URL } from '../constants.js';
import { useEffect, useState } from 'react';
import 'photoswipe/dist/photoswipe.css';
import 'photoswipe/dist/default-skin/default-skin.css';
import { Gallery, Item } from 'react-photoswipe-gallery';
import axios from 'axios';
axios.defaults.baseURL = SERVER_URL;

export function Pictures({ yelpPhotos }) {
  // Add required metadata to photos for react-photo-gallery
  function formatPhotosForReactPhotoGallery(photos) {
    let formattedPhotos = [];
    if (!photos) return [];
    for (var i = 0; i < photos.length; i++) {
      formattedPhotos.push({
        src: photos[i],
        width: 1,
        height: 1,
      });
    }
    return formattedPhotos;
  }
  if (!yelpPhotos) {
    return null;
  }
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
              width={image.width}
              height={image.height}
            >
              {({ ref, open }) => (
                <img ref={ref} onClick={open} src={photo.thumbnail} width="150" height="150" />
              )}
            </Item>
          );
        })}
      </Gallery>
    </div>
  );
}
