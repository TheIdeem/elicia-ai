"use client";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="container-dark relative lg:pt-14 lg:pb-28 overflow-hidden">
      {/* SVG pulse background - left */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full w-full max-w-screen pointer-events-none z-0 opacity-100">
        <div className="relative w-full h-fit flex justify-center items-center rotate-90 translate-y-[120px] scale-[1.7] sm:translate-y-[56px] sm:scale-[1.4] md:translate-x-[55%] md:translate-y-[-160px] lg:scale-[0.8] lg:translate-y-[-20px]">
          <div style={{ maskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 45%)', maskSize: '100% 100%', maskPosition: 'center' }} className="scale-100 lg:scale-[1.8] absolute w-full min-h-full top-0 left-0 -translate-y-1/2">
            <div className="flex items-center justify-center w-full h-screen relative scale-[0.7]">
              {/* SVG pulse */}
              <svg width="1497" height="1498" viewBox="0 0 1497 1498" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="pulse" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop stopColor="rgba(255,255,255,0)" offset="-103.85%" />
                    <stop stopColor="rgba(255,255,255,0.4)" offset="2.15%" />
                    <stop stopColor="rgba(255,255,255,0.95)" offset="10.15%" />
                    <stop stopColor="rgba(255,255,255,0)" offset="11.15%" />
                  </linearGradient>
                </defs>
                {/* ...paths omitted for brevity, see cortex.io hero ... */}
                {/* You can copy the full SVG paths from the HTML provided */}
              </svg>
            </div>
          </div>
        </div>
      </div>
      {/* SVG pulse background - right (mirrored) */}
      <div className="absolute w-full h-fit flex justify-center items-center -translate-x-[55%] md:-translate-x-[54.5%] rotate-90 -translate-y-[160px] sm:scale-[1.4] lg:scale-[0.8] lg:translate-y-[-20px] pointer-events-none z-0 opacity-100">
        <div style={{ maskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 45%)', maskSize: '100% 100%', maskPosition: 'center' }} className="scale-100 lg:scale-[1.8] absolute w-full min-h-full top-0 left-0 -translate-y-1/2">
          <div className="flex items-center justify-center w-full h-screen relative scale-[0.7]">
            {/* SVG pulse (same as above) */}
            <svg width="1497" height="1498" viewBox="0 0 1497 1498" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="pulse" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop stopColor="rgba(255,255,255,0)" offset="-103.85%" />
                  <stop stopColor="rgba(255,255,255,0.4)" offset="2.15%" />
                  <stop stopColor="rgba(255,255,255,0.95)" offset="10.15%" />
                  <stop stopColor="rgba(255,255,255,0)" offset="11.15%" />
                </linearGradient>
              </defs>
              {/* ...paths omitted for brevity... */}
            </svg>
          </div>
        </div>
      </div>
      {/* Mobile background image */}
      <Image alt="Hero Background" width={1220} height={1076} className="md:hidden opacity-100 absolute translate-y-36 -bottom-0 w-[160%] max-w-[920px]" style={{ color: 'transparent' }} src="/images/hero-mobile.png" />
      {/* Main content */}
      <div className="container-fluid flex flex-col gap-10 lg:gap-12 items-center justify-center max-w-screen-xl relative z-10">
        <div className="flex flex-col gap-6 items-center text-center max-w-3xl">
          <h1 className="display text-w1 !text-balance">
            <span className="text-shadow-heading">Your </span>
            <span className="text-p2 text-shadow-highlight">Portal</span>
            <span className="text-shadow-heading"> to Engineering Excellence</span>
          </h1>
          <p className="body text-w2 !text-balance">
            Elicia AI is the enterprise-grade AI assistant built to accelerate your path to engineering excellence. Abstract away complexity, ensure ownership, enforce standards, and unlock developer self-service.
          </p>
          <div className="flex gap-2">
            <div className="relative group/main">
              <div className="absolute w-[calc(100%+0.75rem)] h-[calc(100%+0.75rem)] rounded-[12px] !z-[-9] top-[-0.375rem] left-[-0.375rem] overflow-hidden transition-opacity duration-300 ease-in-out group-hover/main:opacity-100 opacity-0">
                <div className="relative w-full h-full p-px overflow-hidden flex justify-start items-start z-[-10] opacity-0">
                  <div className="absolute bg-main-button-glow size-[120px]" style={{ transform: 'translate(-60px, -60px)' }} />
                  <div className="absolute bg-main-button-glow size-[120px]" style={{ transform: 'translate(130px, -60px)' }} />
                  <div className="absolute bg-main-button-glow size-[160px]" style={{ transform: 'translate(-80px, -27px)' }} />
                  <div className="absolute bg-main-button-glow size-[160px]" style={{ transform: 'translate(110px, -27px)' }} />
                  <div className="absolute bg-main-button-glow size-[80px]" style={{ transform: 'translate(-40px, -40px)' }} />
                  <div className="absolute bg-main-button-glow size-[80px]" style={{ transform: 'translate(150px, -40px)' }} />
                </div>
                <div className="translate-y-[calc(-100%-1px)] translate-x-[1px] bg-bg1 w-[calc(100%-2px)] h-[calc(100%-2px)] rounded-[12px] z-[10]" />
              </div>
              <Link href="/demo-request" className="w-fit inline-flex gap-1 items-center justify-center whitespace-nowrap rounded-md caption-cta ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-p1 bg-p1/90 text-w1 hover:bg-p1/100 relative px-4 py-3 md:px-5 max-h-[39px] md:max-h-none">
                Book a live demo
                <Image alt="" width={16} height={16} className="ml-1" style={{ color: 'transparent' }} src="/icons/caret-right.svg" />
              </Link>
            </div>
            <div className="relative group/main">
              <a className="w-fit inline-flex gap-1 items-center justify-center whitespace-nowrap rounded-md caption-cta ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-batch-bg bg-bg4/30 text-w1 hover:bg-bg4/35 px-4 py-3 md:px-5 max-h-[39px] md:max-h-none" target="_blank" href="https://app.demo.cortex.io/admin/home?utm_source=demo-trial">Try now</a>
            </div>
          </div>
        </div>
        {/* Hero asset image with border, corners, and lines */}
        <div className="w-full max-w-[1024px] mt-8">
          <div className="w-full h-full p-2 relative z-20" alt="Hero Asset">
            {/* White corners */}
            <div className="absolute w-[2px] h-[2px] top-0 left-0 translate-x-[-1px] translate-y-[-1px] bg-w1" />
            <div className="absolute w-[2px] h-[2px] top-0 left-1/2 -translate-x-1/2 translate-y-[-1px] bg-w1" />
            <div className="absolute w-[2px] h-[2px] top-0 right-0 translate-x-[1px] translate-y-[-1px] bg-w1" />
            <div className="absolute w-[2px] h-[2px] top-1/2 right-0 translate-x-[1px] -translate-y-1/2 bg-w1" />
            <div className="absolute w-[2px] h-[2px] bottom-0 right-0 translate-x-[1px] translate-y-[1px] bg-w1" />
            <div className="absolute w-[2px] h-[2px] bottom-0 left-1/2 -translate-x-1/2 translate-y-[1px] bg-w1" />
            <div className="absolute w-[2px] h-[2px] bottom-0 left-0 translate-x-[-1px] translate-y-[1px] bg-w1" />
            <div className="absolute w-[2px] h-[2px] top-1/2 left-0 translate-x-[-1px] -translate-y-1/2 bg-w1" />
            {/* Border lines */}
            <div className="absolute top-0 left-0 w-full h-px overflow-hidden bg-card-border/20">
              <div className="w-full h-full overflow-hidden flex flex-row" style={{ transform: 'translate3d(48.0652%, 0px, 0px)' }}>
                <div className="h-px" style={{ width: '200px', background: 'linear-gradient(to right, transparent 0%, rgba(255,255,255, 0.5) 95%, transparent 100%)' }} />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-px overflow-hidden bg-card-border/20">
              <div className="w-full h-full overflow-hidden flex flex-row" style={{ transform: 'translate3d(184.317px, 0px, 0px)' }}>
                <div className="h-px" style={{ width: '200px', background: 'linear-gradient(to left, transparent 0%, rgba(255,255,255, 0.5) 95%, transparent 100%)' }} />
              </div>
            </div>
            <div className="absolute top-0 left-0 w-px h-full overflow-hidden bg-card-border/20">
              <div className="w-full h-full overflow-hidden flex flex-col" style={{ transform: 'translate3d(0px, 510.729px, 0px)' }}>
                <div className="w-px" style={{ height: '200px', background: 'linear-gradient(to top, transparent 0%, rgba(255,255,255, 0.5) 95%, transparent 100%)' }} />
              </div>
            </div>
            <div className="absolute top-0 right-0 w-px h-full overflow-hidden bg-card-border/20">
              <div className="w-full h-full overflow-hidden flex flex-col" style={{ transform: 'translate3d(0px, -64.9024%, 0px)' }}>
                <div className="w-px" style={{ height: '200px', background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255, 0.5) 95%, transparent 100%)' }} />
              </div>
            </div>
            {/* Main hero image */}
            <Image alt="Hero Asset" width={1400} height={1400} className="w-full h-full object-cover z-0 border border-batch-bg rounded-md" style={{ color: 'transparent' }} src="/images/hero-preview-application.avif" />
          </div>
        </div>
      </div>
    </section>
  );
} 