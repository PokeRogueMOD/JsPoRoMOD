chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (
        changeInfo.status === "complete" &&
        tab.url &&
        (tab.url.includes("https://pokerogue.net/") ||
            tab.url.includes("https://mokerogue.net/"))
    ) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["injector.js"],
        });
    }
});
