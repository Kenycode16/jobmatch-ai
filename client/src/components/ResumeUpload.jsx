import { useState } from 'react'

function ResumeUpload({ onResumeText }) {
    const [fileName, setFileName] = useState(null)

    const handleFile = (file) => {
        if (file && file.type === 'application/pdf') {
            setFileName(file.name)
            const reader = new FileReader()
            reader.onload = async (e) => {
                // For now, we'll send the raw text
                // In production, use a PDF parser library
                const text = await file.text()
                onResumeText(text)
            }
            reader.readAsText(file)
        } else {
            alert('Please upload a PDF file')
        }
    }

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">📄 Your Resume</h3>
            {fileName ? (
                <div>
                    <p className="text-green-400 text-sm">✅ {fileName}</p>
                    <button className="mt-2 text-xs text-gray-400 hover:text-red-400" onClick={() => { setFileName(null); onResumeText(null) }}>
                        Remove
                    </button>
                </div>
            ) : (
                <label className="block text-center border-2 border-dashed border-gray-600 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition">
                    <p className="text-gray-400 text-sm">Drop PDF or click to upload</p>
                    <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
                </label>
            )}
        </div>
    )
}

export default ResumeUpload