import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Cpu, Layers, Hourglass, Sparkles, AlertCircle, Quote } from 'lucide-react';

interface Project {
  num: string;
  name: string;
  category: string;
  images: {
    col1_1: string;
    col1_2: string;
    col2: string;
  };
}

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, isOpen, onClose }) => {
  const [activeImage, setActiveImage] = useState<string>('');

  if (!project) return null;

  // Initialize activeImage if empty
  if (!activeImage) {
    setActiveImage(project.images.col2);
  }

  // Specifications based on project name
  const getSpecs = (name: string) => {
    switch (name) {
      case "Project 01":
      case "Project 04":
        return {
          software: "Blender 3.6 LTS & Octane Render",
          geometry: "1,450,000 Polygons (Subdiv-Ready)",
          timeframe: "3 Weeks Design to Master Render",
          clientNotes: "This project needed a striking, abstract spatial aesthetic to showcase dynamic depth. We integrated high-contrast dark metals with ambient cyan emission accents to establish an unforgettable high-tech atmosphere.",
          process: "Procedural space-voyage elements layered with physical glass shaders and volumetrics for deep space cloud aesthetics.",
          testimonial: "Raven's 3D work took our vision to an entire secondary atmosphere. Absolute visual genius!"
        };
      case "Project 02":
      case "Project 05":
        return {
          software: "Houdini FX, Redshift & Adobe After Effects",
          geometry: "850,000 Polygons (Procedural Meshes)",
          timeframe: "2 Weeks Exploratory Phase",
          clientNotes: "A brand exploratory project centering on kinetic iridescence, procedural glass refractions, and bubble geometry. Crafted to show how dynamic refractions can transform digital static mockups.",
          process: "Procedural geometry generation based on a noise velocity field, using a highly complex custom absorption glass shader in Redshift.",
          testimonial: "Highly professional study in iridescence and color absorption that challenges standard web typography."
        };
      default: // Project 03 and Project 06
        return {
          software: "Autodesk Maya, Cinema 4D & Substance 3D Painter",
          geometry: "2,200,000 Polygons (Heavy Particle Cache)",
          timeframe: "4 Weeks Production Cycle",
          clientNotes: "An organic, fluid core engine showcasing clean light beams. We built detailed robotic joints overlaid with marvelous designer soft body simulation templates.",
          process: "Rigged hydraulic pistons coupled with soft fabric collision. Hand-painted metallic scratches in Substance Painter for grit and high tactile fidelity.",
          testimonial: "Raven demonstrated master-class understanding of physics-based mechanical models. Highly recommended!"
        };
    }
  };

  const specs = getSpecs(project.name);

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md cursor-pointer"
          />

          {/* Centered Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed inset-x-4 inset-y-8 sm:inset-x-8 sm:inset-y-12 md:inset-x-16 md:inset-y-16 lg:inset-x-24 lg:inset-y-20 z-50 bg-[#0C0C0C] border-2 border-[#D7E2EA]/15 rounded-[40px] p-6 md:p-10 flex flex-col justify-between overflow-y-auto max-w-6xl mx-auto"
            style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)' }}
          >
            {/* Top Close Bar */}
            <div className="flex justify-between items-center pb-4 border-b border-[#D7E2EA]/10 mb-6 md:mb-8 shrink-0">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs uppercase tracking-widest text-[#D7E2EA]/50">
                  {project.category} Core Render / Specs
                </span>
                <span className="h-1.5 w-1.5 bg-[#BBCCD7] rounded-full" />
                <span className="font-mono text-xs text-white uppercase tracking-widest font-black">
                  {project.num}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-[#D7E2EA] hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Main Modal Split Layout */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-[55%_45%] gap-6 md:gap-10 items-stretch min-h-0">
              
              {/* Left Column: Full-featured Interactive Lightbox */}
              <div className="flex flex-col gap-4">
                {/* Active Heavy Resolution Canvas */}
                <div className="relative flex-1 bg-black/40 rounded-[28px] border border-[#D7E2EA]/10 overflow-hidden min-h-[220px] sm:min-h-[350px] flex items-center justify-center group">
                  <img
                    src={activeImage || project.images.col2}
                    alt={`${project.name} Active Render`}
                    className="w-full h-full object-cover rounded-[28px] transition-all duration-500 scale-100 group-hover:scale-105 pointer-events-none select-none"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                    <span className="font-mono text-[10px] text-white tracking-widest uppercase">
                      4K Production Master Output
                    </span>
                  </div>
                </div>

                {/* Sub Image Thumbnails */}
                <div className="grid grid-cols-3 gap-3 shrink-0">
                  {[project.images.col2, project.images.col1_1, project.images.col1_2].map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(imgUrl)}
                      className={`relative aspect-video rounded-xl border-2 overflow-hidden transition-all bg-black cursor-pointer ${
                        activeImage === imgUrl || (!activeImage && idx === 0)
                          ? 'border-[#D7E2EA]'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt="Thumbnail"
                        className="w-full h-full object-cover pointer-events-none select-none"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Spec Sheet & Workflow notes */}
              <div className="flex flex-col justify-between gap-6 overflow-y-auto pr-2">
                <div className="flex flex-col gap-5 sm:gap-6">
                  {/* Title block */}
                  <div>
                    <h2 className="hero-heading font-black text-3xl sm:text-4xl uppercase tracking-tight leading-none mb-2">
                      {project.name}
                    </h2>
                    <p className="font-light text-[#D7E2EA]/85 text-sm sm:text-base leading-relaxed">
                      {specs.clientNotes}
                    </p>
                  </div>

                  {/* Specification Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/5 border border-[#D7E2EA]/10 p-4 rounded-3xl">
                    {/* Tool */}
                    <div className="flex items-start gap-2.5">
                      <Cpu className="w-5 h-5 text-[#BBCCD7] shrink-0 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="font-mono text-[10px] text-[#D7E2EA]/40 uppercase tracking-wider">Software Stack</span>
                        <span className="text-white text-xs font-medium uppercase tracking-wide">{specs.software}</span>
                      </div>
                    </div>

                    {/* Polycount */}
                    <div className="flex items-start gap-2.5">
                      <Layers className="w-5 h-5 text-[#BBCCD7] shrink-0 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="font-mono text-[10px] text-[#D7E2EA]/40 uppercase tracking-wider">Geometry Density</span>
                        <span className="text-white text-xs font-medium uppercase tracking-wide">{specs.geometry}</span>
                      </div>
                    </div>

                    {/* Timeframe */}
                    <div className="flex items-start gap-2.5">
                      <Hourglass className="w-5 h-5 text-[#BBCCD7] shrink-0 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="font-mono text-[10px] text-[#D7E2EA]/40 uppercase tracking-wider">Timeline</span>
                        <span className="text-white text-xs font-medium uppercase tracking-wide">{specs.timeframe}</span>
                      </div>
                    </div>

                    {/* Quality */}
                    <div className="flex items-start gap-2.5">
                      <Sparkles className="w-5 h-5 text-[#BBCCD7] shrink-0 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="font-mono text-[10px] text-[#D7E2EA]/40 uppercase tracking-wider">Master Quality</span>
                        <span className="text-white text-xs font-medium uppercase tracking-wide">4K Volumetrics // EXR</span>
                      </div>
                    </div>
                  </div>

                  {/* Behind the scenes workflow */}
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#D7E2EA]/45">Technical Pipeline Process</span>
                    <p className="text-xs sm:text-sm text-[#D7E2EA]/75 font-light leading-relaxed">
                      {specs.process}
                    </p>
                  </div>

                  {/* Feedback block */}
                  <div className="border-l-2 border-[#BBCCD7] pl-4 py-1 flex items-start gap-3 mt-1 bg-white/[0.02] p-3 rounded-r-2xl">
                    <Quote className="w-4 h-4 text-[#BBCCD7] shrink-0 mt-1 opacity-70" />
                    <div>
                      <p className="text-xs italic text-[#D7E2EA]/85 leading-relaxed">
                        &ldquo;{specs.testimonial}&rdquo;
                      </p>
                      <span className="block font-mono text-[9px] text-[#BBCCD7] uppercase tracking-wider mt-1.5">
                        &mdash; Project Reviewer Feedback
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info block */}
                <div className="bg-white/5 border border-yellow-500/20 px-3.5 py-3 rounded-2xl flex items-center gap-2 text-yellow-200/90 shrink-0 mt-4">
                  <AlertCircle className="w-4 h-4 stroke-[2]" />
                  <span className="font-mono text-[9px] uppercase tracking-widest leading-none">
                    Preview environment simulates high-fidelity active web3 nodes.
                  </span>
                </div>
              </div>

            </div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
};
