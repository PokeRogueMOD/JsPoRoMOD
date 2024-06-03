// background.js
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url && tab.url.startsWith("https://pokerogue.net/")) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["inject.js"],
        });
    }
});
