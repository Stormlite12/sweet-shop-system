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
      <div className="relative w-full h-[80vh] max-w-5xl mx-auto overflow-hidden rounded-lg shadow-2xl border border-orange-200/40 touch-pan-y">
        
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
          onlyHandleDraggable={true}
        />

        {/* Text Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-30 p-8 pointer-events-none">
          <div className="text-center bg-black/40 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto border border-white/20">
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-white drop-shadow-2xl">
              {currentSlide.title}
            </h2>
            <p className="text-lg md:text-2xl font-sans text-white/90 max-w-2xl mx-auto drop-shadow-lg leading-relaxed">
              {currentSlide.description}
            </p>
          </div>
        </div>

        {/* Slide Navigation */}
        {slides.length > 1 && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-40 flex space-x-3 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2">
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
        )}

      </div>
    </section>
  );
}