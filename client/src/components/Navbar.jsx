function Navbar() {
    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto">
                <div className="flex justify-between items-center">
                    <div className="text-white font-bold text-xl">JobMatch AI</div>
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-300 hover:text-white">Dashboard</a>
                        <a href="#" className="text-gray-300 hover:text-white">Saved Jobs</a>
                        <a href="#" className="text-gray-300 hover:text-white">Upload Resume</a>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;