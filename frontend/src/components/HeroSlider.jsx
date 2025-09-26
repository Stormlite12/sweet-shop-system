// src/components/HeroSlider.jsx
import { useState } from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";

const slides = [
  {
    before: { src: "/halwai-working-1.jpg", alt: "Hardworking Halwai crafting sweets" },
    after: { src: "/delicious-sweets-1.jpg", alt: "Assortment of delicious Indian sweets" },
    title: "From Craft to Culinary Delight",
    description: "Witness the dedication of our Halwais transform into exquisite traditional sweets.",
  },
  {
    before: { src: "/halwai-working-2.jpg", alt: "Halwai meticulously preparing sweets" },
    after: { src: "/delicious-sweets-2.jpg", alt: "Beautifully arranged Indian sweets" },
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
    <section className="relative w-full overflow-hidden flex items-center justify-center py-16 bg-gradient-to-b from-orange-50 to-white">
      <div className="relative w-full h-[80vh] max-w-5xl mx-auto overflow-hidden rounded-lg shadow-2xl border border-orange-200/40">
        
        <ReactCompareSlider
          itemOne={
    <ReactCompareSliderImage
      src={currentSlide.before.src || "/api/placeholder/800/600"}
      alt={currentSlide.before.alt}
      // Change this back to 'cover'
      style={{ objectFit: "cover" }}
    />
  }
  itemTwo={
    <ReactCompareSliderImage
      src={currentSlide.after.src || "/api/placeholder/800/600"}
      alt={currentSlide.after.alt}
      // Change this back to 'cover'
      style={{ objectFit: "cover" }}
    />
  }
          position={sliderPosition}
          onPositionChange={setSliderPosition}
          className="w-full h-full"
          style={{
            '--react-compare-slider-handle-color': '#f97316',
            '--react-compare-slider-handle-size': '12px',
          }}
          handle={
            <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg border-4 border-orange-200 cursor-grab active:cursor-grabbing hover:border-orange-300 transition-colors">
              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </div>
          }
          boundsPadding={0}
          changePositionOnHover={false}
        />

        {/* Text Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-30 p-8 text-white bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-balance mb-4 text-center drop-shadow-2xl bg-gradient-to-r from-white via-orange-100 to-amber-100 bg-clip-text text-transparent">
            {currentSlide.title}
          </h2>
          <p className="text-lg md:text-2xl font-sans text-pretty text-center max-w-2xl drop-shadow-lg mb-8">
            {currentSlide.description}
          </p>
        </div>

        {/* Slide Navigation */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-40 bg-orange-100/80 hover:bg-orange-200/90 backdrop-blur-sm rounded-full p-3 transition-all duration-200 text-orange-700 hover:text-orange-800 border border-orange-200"
              aria-label="Previous slide"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-40 bg-orange-100/80 hover:bg-orange-200/90 backdrop-blur-sm rounded-full p-3 transition-all duration-200 text-orange-700 hover:text-orange-800 border border-orange-200"
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
                  className={`w-4 h-4 rounded-full transition-all duration-200 border-2 ${
                    index === currentSlideIndex
                      ? 'bg-orange-500 border-orange-300 scale-125'
                      : 'bg-orange-200/50 border-orange-300/50 hover:bg-orange-300/75 hover:border-orange-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}

        <button
          onClick={() => setSliderPosition(50)}
          className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40 bg-orange-100/80 hover:bg-orange-200/90 backdrop-blur-sm rounded-full px-4 py-2 transition-all duration-200 text-orange-700 text-sm border border-orange-200"
        >
          Reset to Center
        </button>
      </div>
    </section>
  );
}