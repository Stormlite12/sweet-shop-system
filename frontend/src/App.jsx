// src/App.jsx
import Navbar from './components/Navbar'
import './App.css'

function App() {
  return (
    <div className="min-h-screen" data-theme="sweetshop">
      <Navbar />
      
      {/* Temporary content to see the navbar */}
      <div className="pt-20 p-8">
        <h1 className="text-4xl font-bold text-center text-primary">
          🍭 Sweet Shop
        </h1>
        <p className="text-center text-lg mt-4 text-base-content/70">
          Navbar is working! Let's build from here.
        </p>
      </div>
    </div>
  )
}

export default App