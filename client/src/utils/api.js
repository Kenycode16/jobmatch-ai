const API_URL = 'http://localhost:3001'

export async function getMatchScore(resume, job) {
    const response = await fetch(`${API_URL}/api/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, job }),
    })
    const data = await response.json()
    return data
}