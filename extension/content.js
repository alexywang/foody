// content.js runs javascript on active tab

const ENDPOINT = 'http://localhost:3000';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'clicked_browser_action') {
    // Click on icon in extensions tray
    browserAction();
  }
  if (request.message === 'clicked_context_menu') {
    // Click context menu item Show {restaurant} on Foody
    showOnFoody(request.content);
  }
});

function browserAction() {
  console.log('Foddy extension clicked');
}

function getLocation() {}

function showOnFoody(content) {
  console.log(content);
  console.log('Foody context menu clicked for ' + content.info.selectionText);

  const restaurant = content.info.selectionText;
  const location = getLocation();
  const url = `${ENDPOINT}/?name=${restaurant}&location=${location}`;

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
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };
}
