import React from 'react';

interface ContactButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  label?: string;
}

export const ContactButton: React.FC<ContactButtonProps> = ({
  label = "Find Me",
  className = "",
  style,
  href = "https://wa.me/2349013406288",
  ...props
}) => {
  return (
    <a
      id="contact-button-main"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`relative inline-flex items-center justify-center rounded-full font-medium uppercase tracking-widest text-[#D7E2EA] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer 
        px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base ${className}`}
      style={{
        background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), inset 4px 4px 12px #7721B1',
        outline: '2px solid white',
        outlineOffset: '-3px',
        ...style
      }}
      {...props}
    >
      <span className="relative z-10">{label}</span>
    </a>
  );
};

