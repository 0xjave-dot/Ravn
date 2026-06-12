import React from 'react';
import { FadeIn } from './FadeIn';

interface ServiceItem {
  num: string;
  name: string;
  description: string;
}

const servicesList: ServiceItem[] = [
  {
    num: "01",
    name: "Web Development",
    description: "I build websites and web apps that are fast, clean, and actually work. Frontend, backend, full stack. I cover the whole field, and I won't leave until the experience feels right or till you beg me to stop."
  },
  {
    num: "02",
    name: "UI/UX Design",
    description: "Good design shouldn't need a manual, I hate manuals anyway (except cars, manual transmission is amazing). Anyways, I make interfaces that feel obvious in the best possible way, from the first glance, visitors know what your business does, your visuals will be intuitive, refined, and quietly satisfying to use."
  },
  {
    num: "03",
    name: "SEO Optimization",
    description: "I help your site stop being a ghost on the internet. Technical SEO, on-page tweaks, speed gains, all that boring stuff that makes Google notice you exist."
  },
  {
    num: "04",
    name: "Data Analysis & Insights",
    description: "Numbers are fun, especially when someone asks the right questions. I like to dig into data and pull out the parts that actually *mean* something — then tell you what to do with it."
  },
  {
    num: "05",
    name: "Automation & Bot Development",
    description: "If you're doing the same thing more than twice, we should probably automate that (the world is moving, we were never meant to stayyyy). I build bots and systems that handle the monotonous stuff so you don't have to."
  },
  {
    num: "06",
    name: "AI Training & Implementation",
    description: "I build AI that fits your actual problem, not just a generic model dropped into your project that answers FAQs. I mean, useful, tailored and actually intelligent AI."
  },
  {
    num: "07",
    name: "Research & Strategy",
    description: "I can build whatever you want me to, or I can try to understand *why*. I enjoy to study trends, user behavior, and current landscape of your area, so every decision is grounded in something real."
  },
  {
    num: "08",
    name: "Content & Copywriting",
    description: "Clear, sharp words that don't waste your time. Whether it's website copy or a whole content system, I write for clarity first — then make it sound like a human wrote it (I'm an actual bird, in case you haven't noticed)."
  },
  {
    num: "09",
    name: "Stuff",
    description: "I pride myself in happening to know a respectable amount about literature, history, zoology, Lord of the Rings and Warhammer lore, anime arcs, dog breeds, animal behaviour, armored tank engines and weaponry. I like to believe I'll be great at parties (I haven't found out yet, never been to a party). But really, if you want to talk about why giraffes are \"socially homosexual\" or why Sauron may actually not be that bad, you can text too."
  }
];

export const ServicesSection: React.FC = () => {
  return (
    <section
      id="services-section"
      className="relative bg-white text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 z-10"
    >
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <FadeIn delay={0} y={40} className="text-center">
          <h2
            id="services-title"
            className="font-black uppercase text-[#0C0C0C] tracking-tight mb-16 sm:mb-20 md:mb-28"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            Services
          </h2>
        </FadeIn>

        {/* Vertical List of Services */}
        <div id="services-list" className="flex flex-col">
          {servicesList.map((service, index) => (
            <FadeIn
              key={service.num}
              delay={index * 0.1}
              y={30}
              className="w-full"
            >
              <div
                id={`service-item-${service.num}`}
                className="flex flex-col sm:flex-row gap-4 sm:gap-10 md:gap-14 items-start sm:items-center py-8 sm:py-10 md:py-12 border-b border-[rgba(12,12,12,0.15)] last:border-b-0"
              >
                {/* Number indicator */}
                <span
                  className="font-black text-[#0C0C0C] leading-none shrink-0"
                  style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
                >
                  {service.num}
                </span>

                {/* Vertical Stack: Name & Description */}
                <div className="flex flex-col gap-2">
                  <h3
                    className="font-medium uppercase text-[#0C0C0C] leading-tight"
                    style={{ fontSize: 'clamp(1.2rem, 2.2vw, 2.1rem)' }}
                  >
                    {service.name}
                  </h3>
                  <p
                    className="font-light leading-relaxed text-[#0C0C0C]/60 max-w-2xl"
                    style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}
                  >
                    {service.description}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
