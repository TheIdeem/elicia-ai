import { useEffect, useRef } from 'react';
import Image from 'next/image';

interface LogoCarouselProps {
  logos: {
    src: string;
    alt: string;
  }[];
}

const LogoCarousel: React.FC<LogoCarouselProps> = ({ logos }) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroll = () => {
      if (!carouselRef.current) return;
      
      const scrollAmount = 1;
      carouselRef.current.scrollLeft += scrollAmount;

      if (
        carouselRef.current.scrollLeft >=
        carouselRef.current.scrollWidth - carouselRef.current.clientWidth
      ) {
        carouselRef.current.scrollLeft = 0;
      }

      requestAnimationFrame(scroll);
    };

    const animation = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animation);
  }, []);

  return (
    <div className="overflow-hidden py-2 border-border/15 border-y mt-6 lg:mt-0 min-h-[58px] lg:min-h-[68px]">
      <div
        ref={carouselRef}
        className="!flex will-change-transform !w-fit min-w-max"
      >
        {/* Repeat logos 3 times to create infinite scroll effect */}
        {[0, 1, 2].map((set) => (
          <div
            key={set}
            className="flex flex-shrink-0 gap-x-2 pr-2 lg:gap-x-4 lg:pr-4"
          >
            {logos.map((logo, index) => (
              <Image
                key={`${set}-${index}`}
                src={logo.src}
                alt={logo.alt}
                width={150}
                height={50}
                className="w-[112px] h-[40px] object-contain lg:w-[150px] lg:h-[50px]"
                draggable={false}
                loading="lazy"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoCarousel; 