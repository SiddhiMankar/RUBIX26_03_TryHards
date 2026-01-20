import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Consent-as-Code + Health Passport</h1>
      <p className="text-xl mb-8">Secure Patient Health Data Exchange</p>
      
      <div className="card bg-gray-800 p-6 rounded-lg shadow-lg">
        <button 
          onClick={() => setCount((count) => count + 1)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
        >
          count is {count}
        </button>
      </div>
    </div>
  )
}

export default App
