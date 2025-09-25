// src/components/HeroSlider.jsx
import { useState } from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";

const slides = [
  {
    before: { src: "/src/assets/halwai-working-1.jpg", alt: "Hardworking Halwai crafting sweets" },
    after: { src: "/src/assets/delicious-sweets-1.jpg", alt: "Assortment of delicious Indian sweets" },
    title: "From Craft to Culinary Delight",
    description: "Witness the dedication of our Halwais transform into exquisite traditional sweets.",
  },
  {
    before: { src: "/src/assets/halwai-working-2.jpg", alt: "Halwai meticulously preparing sweets" },
    after: { src: "/src/assets/delicious-sweets-2.jpg", alt: "Beautifully arranged Indian sweets" },
    title: "The Art of Sweet Making",
    description: "Generations of expertise, handcrafted with love, bringing you the finest flavors.",
  },
];

export default function HeroSlider() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);

  const currentSlide = slides[currentSlideIndex];

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    setSliderPosition(50);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setSliderPosition(50);
  };

  return (
    <section className="relative w-full h-[600px] overflow-hidden bg-gray-100 flex items-center justify-center">
      <div className="relative w-full h-full max-w-6xl mx-auto overflow-hidden rounded-lg shadow-2xl">
        
        <ReactCompareSlider
          itemOne={
            <ReactCompareSliderImage
              src={currentSlide.before.src || "/api/placeholder/800/600"}
              alt={currentSlide.before.alt}
              style={{ objectFit: "cover" }}
            />
          }
          itemTwo={
            <ReactCompareSliderImage
              src={currentSlide.after.src || "/api/placeholder/800/600"}
              alt={currentSlide.after.alt}
              style={{ objectFit: "cover" }}
            />
          }
          position={sliderPosition}
          onPositionChange={setSliderPosition}
          className="w-full h-full"
          style={{
            '--react-compare-slider-handle-color': '#ffffff',
            '--react-compare-slider-handle-size': '40px',
          }}
          handle={
            <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-lg border-2 border-gray-300 cursor-grab active:cursor-grabbing">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </div>
          }
          boundsPadding={0}
          changePositionOnHover={false} // ✅ This is the key fix - set to false
        />

        {/* Text Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-30 p-8 text-white bg-black/30 pointer-events-none">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-balance mb-4 text-center drop-shadow-lg">
            {currentSlide.title}
          </h2>
          <p className="text-lg md:text-2xl font-sans text-pretty text-center max-w-2xl drop-shadow-md mb-8">
            {currentSlide.description}
          </p>
        </div>

        {/* Slide Navigation */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-4 z-40 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-200 text-white hover:text-gray-200"
              aria-label="Previous slide"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-4 z-40 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-200 text-white hover:text-gray-200"
              aria-label="Next slide"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-40 flex space-x-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentSlideIndex(index);
                    setSliderPosition(50);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentSlideIndex
                      ? 'bg-white scale-125'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}

        <button
          onClick={() => setSliderPosition(50)}
          className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full px-4 py-2 transition-all duration-200 text-white text-sm"
        >
          Reset to Center
        </button>
      </div>
    </section>
  );
}