import './App.css'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'

function App() {
  const savedJobs = [
    { company: "Amazon", jobId: "4370116290", jobUrl: "https://www.linkedin.com/jobs/view/4370116290", location: "Middlesex County, MA", title: "Firmware Engineer II, Amazon Industrial Robotics\nFirmware Engineer II, Amazon Industrial Robotics with verification" },
    { company: "Actalent", jobId: "4379251446", jobUrl: "https://www.linkedin.com/jobs/view/4379251446", location: "Wilmington, MA (On-site)", title: "Software Engineer\nSoftware Engineer with verification" },
    { company: "AA Associates", jobId: "4376285598", jobUrl: "https://www.linkedin.com/jobs/view/4376285598", location: "United States (Remote)", title: "Entry-Level Quality Assurance Engineer\nEntry-Level Quality Assurance Engineer" },
    { company: "Helic & Co.", jobId: "4379296939", jobUrl: "https://www.linkedin.com/jobs/view/4379296939", location: "United States (Remote)", title: "Junior Software Quality Engineer\nJunior Software Quality Engineer" },
    { company: "MITRE", jobId: "4379510413", jobUrl: "https://www.linkedin.com/jobs/view/4379510413", location: "Bedford, MA", title: "Internships in Computer Science or Software Engineering\nInternships in Computer Science or Software Engineering with verification" },
    { company: "Raytheon", jobId: "4359467788", jobUrl: "https://www.linkedin.com/jobs/view/4359467788", location: "Tewksbury, MA (On-site)", title: "2026 Full-time - Software Engineer II - Onsite (MA)\n2026 Full-time - Software Engineer II - Onsite (MA) with verification" },
    { company: "Cisco", jobId: "4363831709", jobUrl: "https://www.linkedin.com/jobs/view/4363831709", location: "Boston, MA", title: "Software Engineer Full Stack & Application Development II (Full Time) – United States\nSoftware Engineer Full Stack & Application Development II (Full Time) – United States with verification" },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <Dashboard jobs={savedJobs} />
    </div>
  )
}

export default App