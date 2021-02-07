import { useEffect, useState } from 'react';

const getParams = () => {
  let search = window.location.search;
  return new URLSearchParams(search);
};

export function Extension() {
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
