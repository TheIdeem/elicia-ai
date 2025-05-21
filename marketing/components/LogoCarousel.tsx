'use client';
import { useRef } from 'react';
import Image from 'next/image';

interface LogoCarouselProps {
  logos: {
    src: string;
    alt: string;
  }[];
}

const LogoCarousel: React.FC<LogoCarouselProps> = ({ logos }) => {
  const marqueeRef = useRef<HTMLDivElement>(null);

  // On duplique les logos pour l'effet infini
  const allLogos = [...logos, ...logos, ...logos];

  return (
    <div className="overflow-hidden py-2 border-border/15 border-y mt-6 lg:mt-0 min-h-[58px] lg:min-h-[68px]">
      <div
        ref={marqueeRef}
        className="flex w-fit min-w-max animate-logo-marquee"
        style={{ animation: 'logo-marquee 40s linear infinite' }}
      >
        {allLogos.map((logo, index) => (
          <div
            key={index}
            className="flex flex-shrink-0 gap-x-2 pr-2 lg:gap-x-4 lg:pr-4"
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={150}
              height={50}
              className="w-[112px] h-[40px] object-contain lg:w-[150px] lg:h-[50px]"
              draggable={false}
              loading="lazy"
            />
          </div>
        ))}
      </div>
      <style jsx global>{`
        @keyframes logo-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </div>
  );
};

export default LogoCarousel; 