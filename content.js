console.log('Foody extension running');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'clicked_browser_action') {
    browserAction();
  }
  if (request.message === 'clicked_context_menu') {
    showOnFoody(request.content);
  }
});

function browserAction() {
  console.log('Foddy extension clicked');
}

function showOnFoody(content) {
  console.log(content);
  console.log('Foody context menu clicked for ' + content.info.selectionText);

  document.body.innerHTML += `
    <div id="foody-modal" class="foody-modal">
      <div class="foody-modal-content">
      <span class="foody-modal-close">&times;</span>
        <p>Some text in the Modal..</p>
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
