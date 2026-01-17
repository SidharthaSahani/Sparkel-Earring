import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CarouselBanner } from '../lib/types';

type CarouselProps = {
  banners: CarouselBanner[];
};

export default function Carousel({ banners }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  if (banners.length === 0) {
    return (
      <div className="relative h-[500px] bg-gradient-to-r from-pink-100 via-rose-100 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            Welcome to Sparkle & Shine
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Discover your perfect jewelry piece
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[500px] overflow-hidden">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-all duration-500 ${
            index === currentIndex ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
          }`}
        >
          <div className="relative h-full">
            <img
              src={banner.image_url}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-xl">
                  {banner.title && (
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                      {banner.title}
                    </h2>
                  )}
                  {banner.subtitle && (
                    <p className="text-xl md:text-2xl text-white mb-8">
                      {banner.subtitle}
                    </p>
                  )}
                  {banner.link_url && (
                    <a
                      href={banner.link_url}
                      className="inline-block bg-white text-gray-800 px-8 py-3 rounded-full font-semibold hover:bg-pink-50 transition-colors"
                    >
                      Shop Now
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-all"
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white w-8' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
