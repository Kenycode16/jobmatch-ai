const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { GoogleGenerativeAI } = require('@google/generative-ai')

const app = express()
app.use(cors())
app.use(express.json())

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

app.get('/', (req, res) => {
    res.json({ message: 'JobMatch AI Server is running!' })
})

app.post('/api/match', async (req, res) => {
    const { resume, job } = req.body

    try {
        const prompt = `You are a job matching expert. Compare this resume against the job posting and return a JSON response.

RESUME:
${resume}

JOB:
Title: ${job.title}
Company: ${job.company}
Location: ${job.location}

Respond ONLY with valid JSON in this exact format, no markdown, no code blocks:
{
  "matchScore": <number 0-100>,
  "strengths": ["strength1", "strength2"],
  "gaps": ["gap1", "gap2"],
  "suggestion": "One sentence advice to improve match"
}`

        const result = await model.generateContent(prompt)
        const text = result.response.text()
        const clean = text.replace(/```json|```/g, '').trim()
        const parsed = JSON.parse(clean)
        res.json(parsed)
    } catch (error) {
        console.error('AI Error:', error.message)
        res.status(500).json({ error: error.message })
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})