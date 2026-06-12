import React, { useState } from 'react';
import { HeroSection } from './HeroSection';
import { MarqueeSection } from './MarqueeSection';
import { AboutSection } from './AboutSection';
import { ServicesSection } from './ServicesSection';
import { ProjectsSection, Project } from './ProjectsSection';
import { ContactModal } from './ContactModal';
import { ProjectDetailModal } from './ProjectDetailModal';

export default function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsProjectModalOpen(true);
  };

  return (
    <div
      id="main-app-container"
      className="relative min-h-screen w-full flex flex-col font-sans"
      style={{
        backgroundColor: '#0C0C0C',
        overflowX: 'clip', // Main wrapper has overflowX: 'clip' as specified
      }}
    >
      {/* 1. HERO SECTION */}
      <HeroSection onContactClick={() => setIsContactOpen(true)} />

      {/* 2. MARQUEE SECTION */}
      <MarqueeSection />

      {/* 3. ABOUT SECTION */}
      <AboutSection onContactClick={() => setIsContactOpen(true)} />

      {/* 4. SERVICES SECTION */}
      <ServicesSection />

      {/* 5. PROJECTS SECTION */}
      <ProjectsSection onProjectClick={handleProjectClick} />

      {/* HIGH FIDELITY OVERLAYS */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <ProjectDetailModal
        project={selectedProject}
        isOpen={isProjectModalOpen}
        onClose={() => {
          setIsProjectModalOpen(false);
          setSelectedProject(null);
        }}
      />
    </div>
  );
}
