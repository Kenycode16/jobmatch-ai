chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.action === "startSearch") {

        // 1. Create tab
        chrome.tabs.create({ url: message.url }, (tab) => {
            console.log("New tab opened with ID:", tab.id);
        // 2. Inside the callback, set up onUpdated listener
        const onUpdatedListener = (tabId, changeInfo, updatedTab) => {
            if (tabId === tab.id && changeInfo.status === "complete") {
                console.log("Tab finished loading:", updatedTab.url);
                // a. Send "scrape" to content script
                chrome.tabs.sendMessage(tabId, { action: "scrape" });
                // b. Remove the listener (prevent memory leak)
                chrome.tabs.onUpdated.removeListener(onUpdatedListener);
            }
        };
        chrome.tabs.onUpdated.addListener(onUpdatedListener);
        });
    }

    if (message.action === "scrapeDone") {
        // Log results
        console.log("Scraping complete!", message.data);
    }
});