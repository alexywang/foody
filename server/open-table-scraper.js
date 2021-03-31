const Curl = require('node-libcurl').Curl;

function getOpenTableInternalApiSearch(openTableLink) {
  const slug = getSlugFromOpenTableLink(openTableLink);
  const curl = new Curl();
  return new Promise((resolve, reject) => {
    curl.setOpt(
      Curl.option.URL,
      'https://www.opentable.com/widget/reservation/restaurant-search?query=sotto-sotto-ristorante&pageSize=3'
    );
    curl.setOpt('FOLLOWLOCATION', true);

    curl.on('end', (statusCode, body, headers) => {
      resolve(body);
    });

    curl.on('error', () => {
      curl.close.bind(curl);
      reject();
    });

    curl.perform();
  });
}

function getSlugFromOpenTableLink(openTableLink) {
  const splitLink = openTableLink.split('/');
  let slug;
  slug = splitLink[splitLink.length - 1];
  return slug;
}

module.exports = {
  getOpenTableInternalApiSearch,
};
