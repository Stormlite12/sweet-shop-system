import { useState, useEffect } from 'react'

export default function CurtainEffect({ onComplete, children }) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Simplified timeline:
    // 1. Start with curtains closed
    // 2. After 500ms, start opening curtains (3 seconds)
    // 3. When curtains finish opening, show main app

    const openCurtainsTimer = setTimeout(() => {
      setIsOpen(true)
      
      // Call onComplete after curtains finish opening
      setTimeout(() => {
        onComplete?.()
      }, 3000) // Curtains take 3 seconds to open
    }, 500)

    return () => clearTimeout(openCurtainsTimer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Left Curtain */}
      <div 
        className={`absolute top-0 left-0 w-1/2 h-full transition-transform duration-[3000ms] ease-in-out ${
          isOpen ? '-translate-x-full' : 'translate-x-0'
        }`}
        style={{
          backgroundImage: 'url("/curtain-texture.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-black/30 to-transparent"></div>
      </div>

      {/* Right Curtain */}
      <div 
        className={`absolute top-0 right-0 w-1/2 h-full transition-transform duration-[3000ms] ease-in-out`}
        style={{
          backgroundImage: 'url("/curtain-texture.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
          backgroundRepeat: 'no-repeat',
          transform: isOpen ? 'translateX(100%) scaleX(-1)' : 'scaleX(-1)',
        }}
      >
        <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-black/30 to-transparent"></div>
      </div>

      {/* Main App Content - Always visible behind curtains */}
      <div className="absolute inset-0 z-[-1]">
        {children}
      </div>
    </div>
  )
}