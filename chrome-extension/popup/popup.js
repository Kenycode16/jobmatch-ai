// popup/popup.js

document.getElementById("searchBtn").addEventListener("click", () => {
    const jobTitle = document.getElementById('jobTitle').value;
    const jobLocation = document.getElementById('jobLocation').value;
    const experience = document.getElementById('experience').value;
    const workType = document.getElementById('workType').value;
    const timePosted = document.getElementById('timePosted').value;

    let url = 'https://www.linkedin.com/jobs/search/?keywords=' 
        + encodeURIComponent(jobTitle) 
        + '&location=' + encodeURIComponent(jobLocation);

    if (experience !== "Any") {
        url += '&f_E=' + encodeURIComponent(experience);
    }
    if (workType !== "Any") {
        url += '&f_WT=' + encodeURIComponent(workType);
    }
    if (timePosted !== "Any") {
        url += '&f_TPR=' + encodeURIComponent(timePosted);
    }

    document.getElementById('status').innerText = 'Searching LinkedIn...';

    chrome.tabs.create({ url: url, active: false }, (tab) => {
        chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
            if (tabId === tab.id && info.status === 'complete') {
                chrome.tabs.onUpdated.removeListener(listener);

                // Wait extra 3 seconds for LinkedIn to load dynamic content
                setTimeout(() => {
                    chrome.scripting.executeScript({
                        target: { tabId: tabId },
                        func: scrapeLinkedInJobs
                    }, (results) => {
                        if (results && results[0] && results[0].result) {
                            const count = results[0].result;
                            document.getElementById('status').innerText = 
                                ` Done! Found ${count} jobs.`;
                        }
                    });
                }, 3000);
            }
        });
    });
});

// This function gets injected into the LinkedIn page
function scrapeLinkedInJobs() {
    const cards = document.querySelectorAll('[data-job-id]');
    const jobs = [];

    cards.forEach((card) => {
        const jobId = card.getAttribute('data-job-id');
        const title = card.querySelector('.artdeco-entity-lockup__title')?.innerText?.trim() || '';
        const company = card.querySelector('.artdeco-entity-lockup__subtitle')?.innerText?.trim() || '';
        const location = card.querySelector('.artdeco-entity-lockup__caption')?.innerText?.trim() || '';
        const jobUrl = 'https://www.linkedin.com/jobs/view/' + jobId;

        jobs.push({ jobId, title, company, location, jobUrl });
    });

    chrome.storage.local.get({ jobs: [] }, (result) => {
        const existing = result.jobs;
        const newJobs = jobs.filter(
            (job) => !existing.some((e) => e.jobId === job.jobId)
        );
        const merged = [...newJobs, ...existing];
        chrome.storage.local.set({ jobs: merged });
    });

    console.log('JobMatch AI scraped ' + jobs.length + ' jobs');
    return jobs.length;
}