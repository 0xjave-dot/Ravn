import React from 'react';
import { ContactButton } from './ContactButton';
import { FadeIn } from './FadeIn';
import { Magnet } from './Magnet';

interface HeroSectionProps {
  onContactClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onContactClick }) => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative h-screen w-full flex flex-col justify-between overflow-x-hidden select-none"
      style={{ background: '#0C0C0C' }}
    >
      {/* 1. NAVBAR - WITH TOP-RIGHT MATRIX ALERT */}
      <FadeIn
        delay={0}
        y={-20}
        tagName="header"
        className="w-full px-6 md:px-10 pt-6 md:pt-8 flex justify-between items-center z-30"
      >
        <nav className="w-full flex justify-end items-center min-h-[2rem]">
          {/* Top-Right Matrix Custom Alert */}
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-[#00FF41]/20 bg-black/60 backdrop-blur-md shadow-[0_0_15px_rgba(0,255,65,0.05)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF41] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF41] shadow-[0_0_8px_#00FF41]"></span>
            </span>
            <span className="font-mono text-[9px] sm:text-[11px] text-[#00FF41] tracking-wider uppercase drop-shadow-[0_0_6px_rgba(0,255,65,0.5)] animate-pulse">
              Agency Website Under Construction (Slowly)
            </span>
          </div>
        </nav>
      </FadeIn>

      {/* 2. HERO HEADING & PORTRAIT WRAPPER WITH TEXT FOREGROUND LAYERING */}
      <div className="relative flex-1 flex flex-col justify-center items-center px-6 md:px-10">
        
        {/* Layer 1: Massive Heading stays consistently in front of the portrait */}
        <div className="w-full text-center overflow-hidden max-w-5xl mx-auto px-4 select-none pointer-events-none z-20">
          <FadeIn delay={0.15} y={40}>
            <h1 className="text-white text-[7vw] sm:text-[8vw] md:text-[8.5vw] lg:text-[9vw] font-black uppercase tracking-tight leading-none text-center drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
              Hey, I&apos;m Raven, I uhh...<br />I build stuff
            </h1>
          </FadeIn>
        </div>

        {/* Layer 2: 3D Portrait stays underneath the text Layer at z-10 */}
        <div className="absolute left-1/2 -translate-x-1/2 w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px] top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0 z-10">
          <FadeIn delay={0.6} y={30} className="w-full h-full flex justify-center items-end">
            <Magnet
              padding={150}
              strength={3}
              activeTransition="transform 0.3s ease-out"
              inactiveTransition="transform 0.6s ease-in-out"
              className="w-full flex justify-center"
            >
              <img
                id="hero-portrait-image"
                src="https://i.ibb.co/Y7fZdrwJ/Zj-Oh-J-removebg-preview.png"
                alt="Raven 3D Portrait"
                className="w-full object-contain select-none pointer-events-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                referrerPolicy="no-referrer"
              />
            </Magnet>
          </FadeIn>
        </div>

      </div>

      {/* 3. BOTTOM BAR */}
      <div className="w-full px-6 md:px-10 pb-7 sm:pb-8 md:pb-10 flex justify-between items-end gap-4 z-20">
        {/* Left text with custom new sentence */}
        <FadeIn delay={0.35} y={20}>
          <p className="text-[#D7E2EA]/90 font-light tracking-wide leading-relaxed max-w-[180px] sm:max-w-[280px] md:max-w-[360px] lg:max-w-[420px]" style={{ fontSize: 'clamp(0.75rem, 1.2vw, 1.15rem)' }}>
            My main agency website is taking it&apos;s sweet time. I promise, it&apos;s not my fault (not entirely at least)
          </p>
        </FadeIn>

        {/* Right Contact Button (defaults to find me & target="_blank" whatsapp) */}
        <FadeIn delay={0.5} y={20}>
          <ContactButton id="hero-contact-button" />
        </FadeIn>
      </div>

      {/* Subtle Side Rails (Artistic Flair Theme) */}
      <div className="hidden md:block absolute left-6 top-1/2 -translate-y-1/2 -rotate-90 origin-left text-[10px] uppercase tracking-[0.4em] opacity-30 pointer-events-none whitespace-nowrap z-25">
        Portfolio / 2026 / Digital Arts
      </div>
      <div className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2 rotate-90 origin-right text-[10px] uppercase tracking-[0.4em] opacity-30 pointer-events-none whitespace-nowrap z-25">
        Based in Los Angeles / Worldwide
      </div>

    </section>
  );
};
