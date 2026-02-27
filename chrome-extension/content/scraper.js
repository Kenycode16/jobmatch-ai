// content/scraper.js
// Unified scraper — detects which LinkedIn page we're on

// Auto-run when page loads
setTimeout(() => {
    detectPage();
}, 3000);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "scrape") {
        detectPage();
    }
});

function detectPage() {
    const url = window.location.href;

    if (url.includes('/jobs/search')) {
        scrapeJobList();
    } else if (url.includes('/jobs/view')) {
        scrapeJobDetail();
    } else {
        console.warn('JobMatch: Unknown LinkedIn page:', url);
    }
}

// ========== MODE 1: Search Results Page ==========
function scrapeJobList() {
    const cards = document.querySelectorAll('[data-job-id]');
    const jobs = [];

    cards.forEach((card) => {

        const jobId = card.getAttribute('data-job-id');

        if (!jobId) return;

        const link = card.querySelector('.job-card-container__link');
        const title = card.querySelector('.artdeco-entity-lockup__title')?.innerText.trim() || '';
        const company = card.querySelector('.artdeco-entity-lockup__subtitle')?.innerText.trim() || '';
        const location = card.querySelector('.artdeco-entity-lockup__caption')?.innerText.trim() || '';
        const jobUrl = `https://www.linkedin.com/jobs/view/${jobId}`;
        jobs.push({
            jobId,
            title,
            company,
            location,
            jobUrl
        });
    });

    chrome.storage.local.get({ jobs: [] }, (result) => {
        const existing = result.jobs;
        const newJobs = jobs.filter(
            (job) => !existing.some((e) => e.jobId === job.jobId)
        );
        const merged = [...newJobs, ...existing];
        chrome.storage.local.set({ jobs: merged }, () => {
            console.log(`Found ${newJobs.length} new jobs. Total: ${merged.length}`);
            try {
                chrome.runtime.sendMessage({ action: "scrapeDone", data: { count: merged.length } });
            } catch (e) { }
        });
    });
}


// ========== MODE 2: Single Job Detail Page ==========
function scrapeJobDetail() {

    const jobDetail = {
        jobId: window.location.pathname.split('/').filter(Boolean).pop(),
        url: window.location.href,
        title: document.querySelector('.job-details-jobs-unified-top-card__job-title')?.innerText.trim() || '',
        company: document.querySelector('.job-details-jobs-unified-top-card__company-name')?.innerText.trim() || '',
        description: document.querySelector('#job-details')?.innerText.trim() || '',
        primaryInfo: document.querySelector('.job-details-jobs-unified-top-card__primary-description-container')?.innerText.trim() || ''
    };
    chrome.storage.local.set({ jobDetail: jobDetail }, () => {
        console.log('Job detail saved:', jobDetail);
        try {
            chrome.runtime.sendMessage({ action: "scrapeDone", data: { jobDetail } });
        } catch (e) { }

    });

}