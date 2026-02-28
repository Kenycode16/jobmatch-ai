import { useState } from 'react'

function JobCard({ title, company, location, jobUrl, jobId, matchScore, matchData, status, onStatusChange }) {
    const [expanded, setExpanded] = useState(false)
    const cleanTitle = title.split('\n')[0]

    const getScoreColor = (score) => {
        if (!score) return 'bg-gray-600'
        if (score >= 80) return 'bg-green-600'
        if (score >= 60) return 'bg-yellow-600'
        return 'bg-red-600'
    }

    const statusColors = {
        saved: 'bg-gray-600',
        applied: 'bg-green-600',
        interview: 'bg-purple-600',
        rejected: 'bg-red-600',
    }

    return (
        <div
            className="bg-gray-800 border border-gray-700 rounded-lg p-5 hover:border-blue-500 transition cursor-pointer"
            onClick={() => setExpanded(!expanded)}
        >
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-lg font-semibold text-white">{cleanTitle}</h2>
                        <span className={`${statusColors[status]} text-white text-xs px-2 py-0.5 rounded-full`}>
                            {status}
                        </span>
                    </div>
                    <p className="text-gray-400">{company}</p>
                    <p className="text-gray-500 text-sm">{location}</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`${getScoreColor(matchScore)} text-white text-sm font-bold px-3 py-1 rounded-full`}>
                        {matchScore ? `${matchScore}% Match` : '⏳ Pending'}
                    </div>
                    <a
                        href={jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        View Job
                    </a>
                </div>
            </div>

            {
                matchScore && (
                    <div className="mt-3">
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                                className={`${getScoreColor(matchScore)} h-2 rounded-full transition-all`}
                                style={{ width: `${matchScore}%` }}
                            />
                        </div>
                    </div>
                )
            }

            {
                expanded && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                        {/* AI Analysis Results */}
                        {matchData && (
                            <div className="mb-4 space-y-2">
                                {matchData.strengths?.length > 0 && (
                                    <div>
                                        <p className="text-green-400 text-sm font-semibold">💪 Strengths:</p>
                                        {matchData.strengths.map((s, i) => (
                                            <p key={i} className="text-gray-300 text-sm ml-4">• {s}</p>
                                        ))}
                                    </div>
                                )}
                                {matchData.gaps?.length > 0 && (
                                    <div>
                                        <p className="text-yellow-400 text-sm font-semibold">⚠️ Gaps:</p>
                                        {matchData.gaps.map((g, i) => (
                                            <p key={i} className="text-gray-300 text-sm ml-4">• {g}</p>
                                        ))}
                                    </div>
                                )}
                                {matchData.suggestion && (
                                    <div>
                                        <p className="text-blue-400 text-sm font-semibold">💡 Suggestion:</p>
                                        <p className="text-gray-300 text-sm ml-4">{matchData.suggestion}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Status Buttons */}
                        <p className="text-gray-400 text-sm mb-3">Update status:</p>
                        <div className="flex gap-2 flex-wrap">
                            {['saved', 'applied', 'interview', 'rejected'].map((s) => (
                                <button
                                    key={s}
                                    className={`text-sm px-4 py-2 rounded transition ${status === s
                                        ? `${statusColors[s]} text-white`
                                        : 'bg-gray-700 text-gray-400 hover:text-white'
                                        }`}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onStatusChange(jobId, s)
                                    }}
                                >
                                    {s === 'saved' && '📌'} {s === 'applied' && '✅'} {s === 'interview' && '🎯'} {s === 'rejected' && '❌'}{' '}
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                )
            }
        </div >
    )
}

export default JobCard