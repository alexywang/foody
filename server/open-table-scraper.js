const Curl = require('node-libcurl').Curl;
const axios = require('axios').default;

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

function scrapeOpenTableLinkFromGoogle(restaurantName, country, city) {
  return axios.get('https://google.com/search', {
    params: {
      q: `${restaurantName} restaurant ${city}, ${country} OpenTable`,
    },
  });
}

function parseOpenTableLinkFromGoogleHtml(rawHtml) {
  let openTableLink = rawHtml.match(/[a-z]+.opentable.[a-z0-9\/]+\/[a-z0-9\/-]+/gim);
  return openTableLink ? 'https://' + openTableLink[0] : null;
}

function openTableLinkContainsRid(link) {
  return link.match(/[0-9]+/gm);
}

function parseRidFromOpenTableInternalSearchApi(data) {
  return data.items[0].rid;
}

function generateOpenTableLinkWithRid(rid) {
  return `https://opentable.com/restaurant/profile/${rid}`;
}

module.exports = {
  getOpenTableInternalApiSearch,
  scrapeOpenTableLinkFromGoogle,
  parseOpenTableLinkFromGoogleHtml,
  openTableLinkContainsRid,
  parseRidFromOpenTableInternalSearchApi,
  generateOpenTableLinkWithRid,
};
