export default function Home() {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-black">
      <main className="flex flex-col w-full h-screen p-6 gap-6">
        {/* Top section with Messages and Image side by side */}
        <div className="flex gap-6 flex-1">
          {/* Messages Box */}
          <div className="flex-1 bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 overflow-y-auto border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">Messages</h2>
            <div className="space-y-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded text-black dark:text-white">
                <p>Hello! How can I help you today?</p>
              </div>
              <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded text-black dark:text-white ml-auto w-2/3">
                <p>I need some assistance with my project.</p>
              </div>
            </div>
          </div>

          {/* Image Box */}
          <div className="flex-1 bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 flex items-center justify-center border border-gray-200 dark:border-gray-700">
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">Image Placeholder</p>
            </div>
          </div>
        </div>

        {/* Bottom section with Send Message Box */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            />
            <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
