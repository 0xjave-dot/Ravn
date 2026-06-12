import React from 'react';
import { FadeIn } from './FadeIn';
import { AnimatedText } from './AnimatedText';
import { ContactButton } from './ContactButton';

interface AboutSectionProps {
  onContactClick: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onContactClick }) => {
  const paragraphText = `I am an Imaginator (if you got that Space King reference, I'll let you be my friend). I think interfaces are alive, and that data tells stories, and that people can actually feel it when they scroll. I work across a large spectrum, am I on the spectrum? does it matter?.
I properly handle frontend, backend, data, automation, AI, SEO, design, and content. It is not necessarily because I have to, I just like learning to do stuff, and I often turn out to be good at stuff, so I do stuff.`;

  return (
    <section
      id="about-section"
      className="relative min-h-screen bg-[#0C0C0C] px-5 sm:px-8 md:px-10 py-20 flex flex-col justify-center items-center overflow-hidden"
    >
      {/* Absolute Decorative 3D Images with custom fade-in paths */}
      
      {/* 1. Moon Icon (Top-Left) */}
      <div className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] w-[120px] sm:w-[160px] md:w-[210px] z-[5] pointer-events-none select-none">
        <FadeIn delay={0.1} x={-80} y={0} duration={0.9}>
          <img
            id="about-moon-icon"
            src="https://i.ibb.co/tTDKsQTV/Untitled-design-11-removebg-preview.png"
            alt="Moon Icon Decorative"
            className="w-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] animate-pulse"
            style={{ animationDuration: '4s' }}
            referrerPolicy="no-referrer"
          />
        </FadeIn>
      </div>

      {/* 2. 3D Object (Bottom-Left) */}
      <div className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] w-[100px] sm:w-[140px] md:w-[180px] z-[5] pointer-events-none select-none">
        <FadeIn delay={0.25} x={-80} y={0} duration={0.9}>
          <img
            id="about-3d-object-left"
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
            alt="3D Abstract Shape left"
            className="w-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
            referrerPolicy="no-referrer"
          />
        </FadeIn>
      </div>

      {/* 3. Lego Icon (Top-Right) */}
      <div className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] w-[120px] sm:w-[160px] md:w-[210px] z-[5] pointer-events-none select-none">
        <FadeIn delay={0.15} x={80} y={0} duration={0.9}>
          <img
            id="about-lego-icon"
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
            alt="Lego Icon Decorative"
            className="w-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] animate-pulse"
            style={{ animationDuration: '5s' }}
            referrerPolicy="no-referrer"
          />
        </FadeIn>
      </div>

      {/* 4. 3D Group (Bottom-Right) */}
      <div className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] w-[130px] sm:w-[170px] md:w-[220px] z-[5] pointer-events-none select-none">
        <FadeIn delay={0.3} x={80} y={0} duration={0.9}>
          <img
            id="about-3d-group-right"
            src="https://i.ibb.co/Q774JtWS/Untitled-design-13.png"
            alt="3D Group right"
            className="w-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
            referrerPolicy="no-referrer"
          />
        </FadeIn>
      </div>

      {/* Main Container with specific flex gaps */}
      <div className="relative z-10 flex flex-col items-center max-w-4xl text-center">
        {/* About Heading */}
        <FadeIn delay={0} y={40}>
          <h2
            id="about-heading"
            className="hero-heading font-black uppercase leading-none tracking-tight mb-10 sm:mb-14 md:mb-16"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            About me
          </h2>
        </FadeIn>

        {/* Scroll Reveal Progress Text */}
        <div className="w-full max-w-[560px] mb-16 sm:mb-20 md:mb-24 px-4">
          <AnimatedText
            text={paragraphText}
            className="text-[#D7E2EA] font-medium text-center leading-relaxed whitespace-pre-line"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
          />
        </div>

        {/* Contact Me Button */}
        <FadeIn delay={0.2} y={20}>
          <ContactButton id="about-section-contact-button" />
        </FadeIn>
      </div>
    </section>
  );
};
