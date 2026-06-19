'use html';
'use client';

import { useState } from 'react';
import { Project } from '@/lib/db';
import { MapPin } from 'lucide-react';

interface ProjectGridProps {
  initialProjects: Project[];
}

export default function ProjectGrid({ initialProjects }: ProjectGridProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>('Hamısı');

  const regions = ['Hamısı', 'Tovuz', 'Qazax', 'Ağstafa', 'Şəmkir'];

  const filteredProjects = selectedRegion === 'Hamısı'
    ? initialProjects
    : initialProjects.filter(p => p.region === selectedRegion);

  return (
    <div className="space-y-8">
      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-3">
        {regions.map((region) => (
          <button
            key={region}
            onClick={() => setSelectedRegion(region)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${
              selectedRegion === region
                ? 'bg-brand-orange border-brand-orange text-white shadow-md shadow-brand-orange/20'
                : 'bg-white/80 border-gray-200 text-gray-700 hover:bg-brand-orange hover:text-white hover:border-brand-orange'
            }`}
          >
            {region}
          </button>
        ))}
      </div>

      {/* Grid of Projects */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Bu bölgədə hələ ki layihə əlavə edilməyib.
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-brand-orange/30 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
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
                  <h3 className="font-outfit text-sm md:text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-brand-orange transition-colors">
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
      )}
    </div>
  );
}
