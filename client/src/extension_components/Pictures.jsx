import { SERVER_URL } from '../constants.js';
import { useEffect, useState } from 'react';
import axios from 'axios';
axios.defaults.baseURL = SERVER_URL;

export function Pictures({ yelpPhotos }) {
  return (
    <div className="foody-pictures-flexbox">
      <p>Google pictures here</p>
    </div>
  );
}
