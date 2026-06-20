'use html';
'use client';

import { useState, useEffect } from 'react';
import { PricingPackage } from '@/lib/db';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';

interface PackageGridProps {
  packages: PricingPackage[];
}

export default function PackageGrid({ packages }: PackageGridProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, packages.length - 2);

  // Reset index on resize
  useEffect(() => {
    if (!isMobile) {
      setActiveIndex(0);
      setIsPlaying(true);
    }
  }, [isMobile]);

  // Autoplay effect
  useEffect(() => {
    if (!isMobile || packages.length <= 2 || !isPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [isMobile, packages.length, maxIndex, isPlaying]);

  const handlePrev = () => {
    setIsPlaying(false);
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const getWhatsAppUrl = (pkg: PricingPackage) => {
    const phone = '994518885599';
    const text = pkg.whatsapp_text || `Salam, Men "${pkg.name}" (${pkg.price} AZN / m²) temir paketi haqqinda melumat almaq isteyirem.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  if (isMobile) {
    return (
      <div className="space-y-6 relative">
        {/* Carousel Container */}
        <div className="overflow-hidden w-full px-1">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${activeIndex * 50}%)` }}
          >
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="w-1/2 shrink-0 px-1.5"
                onClick={() => setIsPlaying(false)}
              >
                <div className="group relative flex flex-col justify-between rounded-2xl bg-white border border-gray-200/60 p-3 transition-all duration-300 shadow-sm hover:shadow-xl active:shadow-xl hover:border-brand-orange/40 active:border-brand-orange/40 hover:-translate-y-1 active:-translate-y-1 h-full">
                  {/* Card Accent (Oval Indicator on Hover) */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-[6px] bg-transparent group-hover:bg-brand-orange group-active:bg-brand-orange transition-all duration-300 rounded-b-full" />

                  <div className="space-y-3">
                    {/* Package Name */}
                    <h3 className="font-outfit text-xs font-bold text-gray-900 group-hover:text-brand-orange group-active:text-brand-orange transition-colors line-clamp-1">
                      {pkg.name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-baseline text-gray-900">
                      <span className="text-lg font-extrabold font-outfit text-brand-orange">
                        {pkg.price}
                      </span>
                      <span className="ml-0.5 text-[10px] font-semibold text-gray-500">
                        ₼ / m²
                      </span>
                    </div>

                    {/* Feature List */}
                    <ul className="space-y-1.5 pt-2 border-t border-gray-100">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <div className="mt-0.5 shrink-0 rounded-full bg-brand-orange/10 p-0.5 text-brand-orange">
                            <Check size={8} />
                          </div>
                          <span className="text-[9px] text-gray-600 leading-tight line-clamp-2">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* WhatsApp CTA */}
                  <div className="mt-4 pt-2">
                    <a
                      href={getWhatsAppUrl(pkg)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 w-full py-2 px-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-bold transition-all duration-300 shadow shadow-emerald-600/10"
                    >
                      <svg
                        className="w-3.5 h-3.5 fill-current shrink-0"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.394 9.806-9.799.002-2.597-1.006-5.04-2.838-6.874-1.832-1.832-4.272-2.84-6.877-2.842-5.409 0-9.809 4.394-9.812 9.8.001 2.052.541 4.053 1.564 5.823l-.99 3.616 3.71-.973zm10.457-7.112c-.29-.145-1.713-.845-1.979-.942-.266-.097-.459-.145-.653.145-.193.29-.749.942-.918 1.134-.169.193-.338.217-.628.072-1.29-.647-2.133-1.085-2.943-2.502-.213-.372.213-.346.61-.1.356-.22.399-.29.593-.483.193-.193.097-.362-.048-.653-.145-.29-.653-1.573-.894-2.152-.236-.569-.475-.491-.653-.5-.169-.008-.362-.01-.555-.01-.193 0-.507.072-.773.362-.266.29-1.014.99-1.014 2.415 0 1.425 1.038 2.802 1.182 2.995.145.193 2.043 3.12 4.95 4.378.691.299 1.232.478 1.654.612.695.22 1.329.19 1.83.115.559-.085 1.713-.7 1.954-1.377.242-.676.242-1.256.169-1.377-.073-.121-.266-.193-.556-.338z" />
                      </svg>
                      <span>Ətraflı məlumat</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        {packages.length > 2 && (
          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 bg-white shadow-sm active:bg-gray-100 transition-colors"
              aria-label="Əvvəlki"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 bg-white shadow-sm active:bg-gray-100 transition-colors"
              aria-label="Növbəti"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6 [&>*:last-child]:col-span-2 lg:[&>*:last-child]:col-span-1">
      {packages.map((pkg) => (
        <div
          key={pkg.id}
          className="group relative flex flex-col justify-between rounded-2xl bg-white border border-gray-200/60 p-4 md:p-6 transition-all duration-300 shadow-sm hover:shadow-xl hover:border-brand-orange/40 hover:-translate-y-1 h-full"
        >
          {/* Card Accent (Oval Indicator on Hover) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-[6px] bg-transparent group-hover:bg-brand-orange transition-all duration-300 rounded-b-full" />

          <div className="space-y-4">
            {/* Package Name */}
            <h3 className="font-outfit text-sm md:text-lg font-bold text-gray-900 group-hover:text-brand-orange transition-colors">
              {pkg.name}
            </h3>

            {/* Price */}
            <div className="flex items-baseline text-gray-900">
              <span className="text-xl md:text-3xl font-extrabold font-outfit text-brand-orange">
                {pkg.price}
              </span>
              <span className="ml-1 text-xs md:text-sm font-semibold text-gray-500">
                ₼ / m²
              </span>
            </div>

            {/* Feature List */}
            <ul className="space-y-2 pt-2 border-t border-gray-100">
              {pkg.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className="mt-1 shrink-0 rounded-full bg-brand-orange/10 p-0.5 text-brand-orange">
                    <Check size={10} className="md:size-3" />
                  </div>
                  <span className="text-[11px] md:text-xs text-gray-600 leading-tight">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* WhatsApp CTA */}
          <div className="mt-6 pt-2">
            <a
              href={getWhatsAppUrl(pkg)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs md:text-sm font-bold transition-all duration-300 shadow shadow-emerald-600/10 hover:shadow-lg hover:shadow-emerald-600/20"
            >
              {/* WhatsApp Custom SVG Icon */}
              <svg
                className="w-4 h-4 fill-current shrink-0"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.394 9.806-9.799.002-2.597-1.006-5.04-2.838-6.874-1.832-1.832-4.272-2.84-6.877-2.842-5.409 0-9.809 4.394-9.812 9.8.001 2.052.541 4.053 1.564 5.823l-.99 3.616 3.71-.973zm10.457-7.112c-.29-.145-1.713-.845-1.979-.942-.266-.097-.459-.145-.653.145-.193.29-.749.942-.918 1.134-.169.193-.338.217-.628.072-1.29-.647-2.133-1.085-2.943-2.502-.213-.372.213-.346.61-.1.356-.22.399-.29.593-.483.193-.193.097-.362-.048-.653-.145-.29-.653-1.573-.894-2.152-.236-.569-.475-.491-.653-.5-.169-.008-.362-.01-.555-.01-.193 0-.507.072-.773.362-.266.29-1.014.99-1.014 2.415 0 1.425 1.038 2.802 1.182 2.995.145.193 2.043 3.12 4.95 4.378.691.299 1.232.478 1.654.612.695.22 1.329.19 1.83.115.559-.085 1.713-.7 1.954-1.377.242-.676.242-1.256.169-1.377-.073-.121-.266-.193-.556-.338z" />
              </svg>
              <span>Ətraflı məlumat</span>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
