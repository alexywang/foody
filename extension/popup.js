// Notify a listener defined in content.js that an action has been performed.
function sendSearchMessageToActiveTab(content) {
  console.log('sending message');
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {
      message: 'search_from_popup',
      content,
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document
    .getElementById('search-form')
    .addEventListener('submit', (event) => sendSearchMessageToActiveTab(event.target.value));
});
