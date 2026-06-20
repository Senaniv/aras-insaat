'use html';
'use client';

import { useState, useEffect } from 'react';
import { Project } from '@/lib/db';
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProjectGridProps {
  initialProjects: Project[];
}

export default function ProjectGrid({ initialProjects }: ProjectGridProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(initialProjects.length / 4);

  // Reset page when switching layouts
  useEffect(() => {
    if (!isMobile) {
      setCurrentPage(0);
    }
  }, [isMobile]);

  if (initialProjects.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 font-medium">
        Hələ ki heç bir layihə əlavə edilməyib.
      </div>
    );
  }

  // Display all on desktop, or paginate 4 cards in 2x2 on mobile
  const projectsToDisplay = isMobile
    ? initialProjects.slice(currentPage * 4, (currentPage + 1) * 4)
    : initialProjects;

  return (
    <div className="space-y-6">
      {/* Grid of Projects */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {projectsToDisplay.map((project) => (
          <div
            key={project.id}
            className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-brand-orange/30 active:border-brand-orange/30 shadow-sm hover:shadow-xl active:shadow-xl transition-all duration-300 flex flex-col h-full"
          >
            {/* Image Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
              <img
                src={project.image_url}
                alt={project.title}
                className="object-cover w-full h-full group-hover:scale-110 group-active:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              {/* Region Badge */}
              <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-brand-orange/90 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-[10px] md:text-xs font-bold flex items-center gap-1 shadow">
                <MapPin size={10} className="md:size-[12px]" />
                <span>{project.region}</span>
              </div>
            </div>

            {/* Project Info */}
            <div className="p-3 md:p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-outfit text-sm md:text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-brand-orange group-active:text-brand-orange transition-colors">
                  {project.title}
                </h3>
                {project.description && (
                  <p className="mt-1 md:mt-2 text-xs md:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination controls only on mobile */}
      {isMobile && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1))}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 bg-white shadow-sm active:bg-gray-100 transition-colors"
            aria-label="Əvvəlki"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0))}
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
