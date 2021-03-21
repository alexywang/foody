// content.js runs javascript on active tab

const ENDPOINT = 'http://localhost:3000/restaurants';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'clicked_browser_action') {
    // Click on icon in extensions tray
    browserAction();
  }
  if (request.message === 'clicked_context_menu') {
    // Click context menu item Show {restaurant} on Foody
    const restaurantName = request.content.info.selectionText;
    showOnFoody(restaurantName);
  }
  if (request.message === 'search_from_popup') {
    const restaurantName = request.content;
    showOnFoody(restaurantName);
  }
});

function browserAction() {
  console.log('Foddy extension clicked');
}

// Remove modal so on subsequent context menu clicks the first one doesn't keep showing up.
function removeModal() {
  const modal = document.getElementById('foody-modal');
  modal.remove();
}

function showOnFoody(restaurant) {
  const url = `${ENDPOINT}?name=${restaurant}`;

  document.body.innerHTML += `
    <div id="foody-modal" class="foody-modal">
      <div class="foody-modal-content">
      <span class="foody-modal-close">&times;</span>
        <iframe class="foody-iframe" src="${url}"://www.w3schools.com" title="W3Schools Free Online Web Tutorials"></iframe>   
      </div>
    </div>
  `;

  let modal = document.getElementById('foody-modal');
  modal.style.display = 'block';

  // Setup close button
  let closeButtonSpan = document.getElementsByClassName('foody-modal-close')[0];
  closeButtonSpan.onclick = function () {
    modal.style.display = 'none';
    removeModal();
  };

  // When the user clicks anywhere outside of the modal, close it
  // window.onclick = function (event) {
  //   if (event.target == modal) {
  //     modal.style.display = 'none';
  //     removeModal();
  //   }
  // };
}
