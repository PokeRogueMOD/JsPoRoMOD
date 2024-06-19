chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url.includes('https://pokerogue.net/')) {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['injector.js']
      });
    }
  });
  