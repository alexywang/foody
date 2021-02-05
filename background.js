const CONTEXT_MENU_ID = 'CONTEXT_MENU';

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
