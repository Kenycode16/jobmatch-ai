function Navbar() {
    return (
        <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-blue-400">🎯 JobMatch AI</h1>
            <div className="flex gap-4">
                <button className="text-gray-300 hover:text-white">Dashboard</button>
                <button className="text-gray-300 hover:text-white">Saved Jobs</button>
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">
                    Upload Resume
                </button>
            </div>
        </nav>
    )
}

export default Navbar