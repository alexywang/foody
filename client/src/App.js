import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function getParams() {
  let search = window.location.search;
  return new URLSearchParams(search);
}

function App() {
  const [params, setParams] = useState();

  useEffect(() => {
    // Get query params
    const params = getParams();
    setParams({
      name: params.get('name'),
      location: params.get('location'),
    });
  }, []);

  return (
    <div>
      <h1>{params?.name}</h1>
    </div>
  );
}

export default App;
