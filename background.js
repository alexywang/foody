// background.js are scripts run for chrome actions
const CONTEXT_MENU_ID = 'CONTEXT_MENU';

// Notify a listener defined in content.js that an action has been performed.
function sendMessageToActiveTab(message, content) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {
      message,
      content,
    });
  });
}

chrome.browserAction.onClicked.addListener((tab) => {
  sendMessageToActiveTab('clicked_browser_action', { hello: 'world' });
});

chrome.contextMenus.create({
  title: 'Show "%s" on Foody',
  contexts: ['selection'],
  id: CONTEXT_MENU_ID,
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  sendMessageToActiveTab('clicked_context_menu', {
    info: info,
    tab: tab,
  });
});
