chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    // Triggered by content/scraper.js after scraping a LinkedIn page
    if (message.action === "scrapeDone") {
        console.log(`Scraping complete! Jobs saved: ${message.data?.count ?? 0}`);
    }

});
