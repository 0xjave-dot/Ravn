import React from 'react';

interface TechItem {
  name: string;
  logoUrl: string;
}

const row1Items: TechItem[] = [
  { name: "HTML5", logoUrl: "https://cdn.simpleicons.org/html5" },
  { name: "CSS3", logoUrl: "https://cdn-icons-png.flaticon.com/512/16183/16183567.png" },
  { name: "JavaScript", logoUrl: "https://cdn.simpleicons.org/javascript" },
  { name: "React", logoUrl: "https://cdn.simpleicons.org/react" },
  { name: "Next.js", logoUrl: "https://cdn.simpleicons.org/nextdotjs" },
  { name: "Tailwind CSS", logoUrl: "https://cdn.simpleicons.org/tailwindcss" },
  { name: "Node.js", logoUrl: "https://cdn.simpleicons.org/nodedotjs" },
  { name: "Express", logoUrl: "https://cdn.simpleicons.org/express" },
  { name: "Python", logoUrl: "https://cdn.simpleicons.org/python" },
  { name: "Django", logoUrl: "https://cdn.simpleicons.org/django" },
  { name: "MongoDB", logoUrl: "https://cdn.simpleicons.org/mongodb" },
  { name: "PostgreSQL", logoUrl: "https://cdn.simpleicons.org/postgresql" },
  { name: "MySQL", logoUrl: "https://cdn.simpleicons.org/mysql" },
  { name: "Firebase", logoUrl: "https://cdn.simpleicons.org/firebase" },
  { name: "Supabase", logoUrl: "https://cdn.simpleicons.org/supabase" },
  { name: "Pandas", logoUrl: "https://cdn.simpleicons.org/pandas" },
  { name: "NumPy", logoUrl: "https://cdn.simpleicons.org/numpy" },
  { name: "Jupyter", logoUrl: "https://cdn.simpleicons.org/jupyter" }
];

const row2Items: TechItem[] = [
  { name: "Figma", logoUrl: "https://cdn.simpleicons.org/figma" },
  { name: "Framer", logoUrl: "https://cdn.simpleicons.org/framer" },
  { name: "Google Analytics", logoUrl: "https://cdn.simpleicons.org/googleanalytics" },
  { name: "Google Search Console", logoUrl: "https://cdn.simpleicons.org/googlesearchconsole" },
  { name: "Ahrefs", logoUrl: "https://companieslogo.com/img/orig/ahrefs-76c3093c.png?t=1720244494" },
  { name: "SEMrush", logoUrl: "https://cdn.simpleicons.org/semrush" },
  { name: "Notion", logoUrl: "https://cdn.simpleicons.org/notion" },
  { name: "Obsidian", logoUrl: "https://cdn.simpleicons.org/obsidian" },
  { name: "WordPress", logoUrl: "https://cdn.simpleicons.org/wordpress" },
  { name: "Medium", logoUrl: "https://cdn.simpleicons.org/medium" },
  { name: "Canva", logoUrl: "https://static.vecteezy.com/system/resources/previews/047/657/562/non_2x/canva-3d-icon-free-png.png" },
  { name: "Git", logoUrl: "https://cdn.simpleicons.org/git" },
  { name: "GitHub", logoUrl: "https://cdn.simpleicons.org/github" },
  { name: "Vercel", logoUrl: "https://cdn.simpleicons.org/vercel" },
  { name: "Netlify", logoUrl: "https://cdn.simpleicons.org/netlify" },
  { name: "Docker", logoUrl: "https://cdn.simpleicons.org/docker" },
  { name: "Postman", logoUrl: "https://cdn.simpleicons.org/postman" }
];

// Duplicate items to ensure a perfect, seamless repeating loop
const repeatedRow1 = [...row1Items, ...row1Items];
const repeatedRow2 = [...row2Items, ...row2Items];

export const MarqueeSection: React.FC = () => {
  return (
    <section
      className="relative bg-[#0C0C0C] pt-20 sm:pt-28 pb-4 overflow-hidden"
    >
      {/* Inject custom Keyframe animations dynamically */}
      <style>{`
        @keyframes marqueeScrollLeft {
          0% {
            transform: translate3d(0%, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        @keyframes marqueeScrollRight {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0%, 0, 0);
          }
        }
        .marquee-track-left {
          display: flex;
          gap: 16px;
          width: max-content;
          animation: marqueeScrollLeft 45s linear infinite;
        }
        .marquee-track-right {
          display: flex;
          gap: 16px;
          width: max-content;
          animation: marqueeScrollRight 45s linear infinite;
        }
        /* Hover pause effect for high fidelity UX */
        .marquee-group:hover .marquee-track-left,
        .marquee-group:hover .marquee-track-right {
          animation-play-state: paused;
        }
      `}</style>

      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Row 1 - Moves LEFT infinitely */}
        <div className="w-full overflow-hidden marquee-group py-2">
          <div className="marquee-track-left">
            {repeatedRow1.map((item, index) => (
              <div
                key={`row1-${item.name}-${index}`}
                className="flex items-center gap-3.5 px-6 py-4 rounded-full border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 backdrop-blur-sm shrink-0 select-none cursor-pointer"
              >
                <img
                  src={item.logoUrl}
                  alt={item.name}
                  className="w-5 h-5 sm:w-6 sm:h-6 object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <span className="font-mono text-[11px] sm:text-[13px] tracking-wider text-[#D7E2EA] font-semibold uppercase">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 - Moves RIGHT infinitely */}
        <div className="w-full overflow-hidden marquee-group py-2">
          <div className="marquee-track-right">
            {repeatedRow2.map((item, index) => (
              <div
                key={`row2-${item.name}-${index}`}
                className="flex items-center gap-3.5 px-6 py-4 rounded-full border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 backdrop-blur-sm shrink-0 select-none cursor-pointer"
              >
                <img
                  src={item.logoUrl}
                  alt={item.name}
                  className="w-5 h-5 sm:w-6 sm:h-6 object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <span className="font-mono text-[11px] sm:text-[13px] tracking-wider text-[#D7E2EA] font-semibold uppercase">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

