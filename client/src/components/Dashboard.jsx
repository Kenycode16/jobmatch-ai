import { useState } from 'react'
import JobCard from './JobCard'
import ResumeUpload from './ResumeUpload'
import { getMatchScore } from '../utils/api'

function Dashboard({ jobs }) {
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('all')
    const [jobStatuses, setJobStatuses] = useState({})
    const [matchScores, setMatchScores] = useState({})
    const [resumeText, setResumeText] = useState(null)
    const [analyzing, setAnalyzing] = useState(false)

    const updateStatus = (jobId, status) => {
        setJobStatuses((prev) => ({ ...prev, [jobId]: status }))
    }

    const analyzeAllJobs = async () => {
        if (!resumeText) return alert('Upload your resume first!')
        setAnalyzing(true)

        for (const job of jobs) {
            try {
                const result = await getMatchScore(resumeText, job)
                setMatchScores((prev) => ({ ...prev, [job.jobId]: result }))
            } catch (error) {
                console.error(`Failed to analyze ${job.company}:`, error)
            }
        }

        setAnalyzing(false)
    }

    const filteredJobs = jobs.filter((job) => {
        const query = search.toLowerCase()
        const matchesSearch =
            job.title.toLowerCase().includes(query) ||
            job.company.toLowerCase().includes(query) ||
            job.location.toLowerCase().includes(query)

        const status = jobStatuses[job.jobId] || 'saved'
        const matchesFilter = filter === 'all' || status === filter

        return matchesSearch && matchesFilter
    })

    const counts = {
        all: jobs.length,
        saved: jobs.filter((j) => !jobStatuses[j.jobId] || jobStatuses[j.jobId] === 'saved').length,
        applied: jobs.filter((j) => jobStatuses[j.jobId] === 'applied').length,
        interview: jobs.filter((j) => jobStatuses[j.jobId] === 'interview').length,
        rejected: jobs.filter((j) => jobStatuses[j.jobId] === 'rejected').length,
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Stats Section */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-blue-400">{counts.all}</p>
                    <p className="text-gray-400 text-sm">Total Jobs</p>
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-green-400">{counts.applied}</p>
                    <p className="text-gray-400 text-sm">Applied</p>
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-purple-400">{counts.interview}</p>
                    <p className="text-gray-400 text-sm">Interviews</p>
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-red-400">{counts.rejected}</p>
                    <p className="text-gray-400 text-sm">Rejected</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-4">
                {['all', 'saved', 'applied', 'interview', 'rejected'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === tab
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:text-white'
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)} ({counts[tab]})
                    </button>
                ))}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-3 gap-6">
                {/* Left - Jobs List */}
                <div className="col-span-2 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">
                            {filter === 'all' ? 'All Jobs' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </h2>
                        <input
                            type="text"
                            placeholder="Search jobs..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map((job) => (
                            <JobCard
                                key={job.jobId}
                                {...job}
                                status={jobStatuses[job.jobId] || 'saved'}
                                onStatusChange={updateStatus}
                                matchScore={matchScores[job.jobId]?.matchScore}
                                matchData={matchScores[job.jobId]}
                            />
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-8">No jobs found</p>
                    )}
                </div>

                {/* Right - Sidebar */}
                <div className="flex flex-col gap-4">
                    <ResumeUpload onResumeText={setResumeText} />

                    {resumeText && (
                        <button
                            onClick={analyzeAllJobs}
                            disabled={analyzing}
                            className={`w-full py-3 rounded-lg font-bold text-white transition ${analyzing
                                    ? 'bg-gray-600 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                                }`}
                        >
                            {analyzing ? '🔄 Analyzing...' : '🤖 Analyze All Jobs with AI'}
                        </button>
                    )}

                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-3">Quick Stats</h3>
                        <div className="flex flex-col gap-2 text-sm">
                            <p className="text-gray-400">🏢 Top Company: <span className="text-white">{jobs[0]?.company || 'N/A'}</span></p>
                            <p className="text-gray-400">📍 Most Common: <span className="text-white">MA</span></p>
                            <p className="text-gray-400">🔄 Last Scraped: <span className="text-white">Today</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard