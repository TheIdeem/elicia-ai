'use client';
import { useState } from 'react';
import Image from 'next/image';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

const items = [
  {
    tag: 'Developer Onboarding',
    title: 'Get new developers up to speed, faster',
    desc: 'Automate onboarding tasks like account creation or secrets allocation. Speed information discovery with Catalogs, Plugins, and CQL. Make status clear and action obvious with Scorecards, Catalogs, and the Developer Homepage.',
    img: '/images/home_acc_01.png',
    cta: 'Onboard devs faster',
    ctaHref: '#',
  },
  {
    tag: 'Modernization / Migrations',
    title: 'Shave months off major framework changes',
    desc: 'Define your ideal state for software or teams, and use live feeds from connected tools to track progress against any dimension. Target alerts to only those developers that need to take action to bring software or actions into alignment, speeding transition time.',
    img: '/images/home_acc_02.png',
    cta: 'Modernize now',
    ctaHref: '#',
  },
  {
    tag: 'Production Readiness',
    title: 'Set standards and stay aligned',
    desc: 'Define production requirements for services, resources, APIs, models, and more. Supply templates to reduce risk and time to code, and track on-going alignment to standards with real-time scorecards and reporting that devs can also monitor themselves.',
    img: '/images/home_acc_03.png',
    cta: 'See standards',
    ctaHref: '#',
  },
  {
    tag: 'Incident Response',
    title: 'Find owners, fix faster',
    desc: 'On-call information is only as good as ownership information, accessibility of context, and presence of runbooks. Ensure always-up-to-date ownership and enforce incident preparedness best practice to centralize critical information and cut response time.',
    img: '/images/home_acc_04.png',
    cta: 'Improve response',
    ctaHref: '#',
  },
  {
    tag: 'Self-Service',
    title: 'Unlock self-service that stays on the rails',
    desc: 'Make it easy for developers to build better from the start, without slowing them down. Software scaffolding, workflow automations, and one-click approvals ensure consistency across teams while reducing rote work for developers that need to move quickly.',
    img: '/images/home_acc_05.png',
    cta: 'Enable self-service',
    ctaHref: '#',
  },
  {
    tag: 'Backstage Migration',
    title: 'Ditch the chaos, keep your catalogs',
    desc: 'Define workflows that spin up accounts and allocate secrets. Make it easy to find information about anything. And make action obvious.',
    img: '/images/home_acc_06.avif',
    cta: 'Migrate now',
    ctaHref: '#',
  },
];

export default function AccordionSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="container-dark-borders py-24">
      <div className="flex flex-col gap-12 md:gap-20">
        <div className="flex flex-col gap-6 items-center text-center section-x">
          <h3 className="title-1 text-w1">Accelerate any engineering excellence initiative</h3>
          <p className="body text-w2 w-full !text-balance">Spend less time building the basics, and more time capturing value. Learn how Elicia AI is driving measurable business outcomes for enterprise customers.</p>
        </div>
        <div className="w-full section-x">
          <div className="w-full flex flex-col gap-6 px-4 sm:px-8 lg:px-0">
            {items.map((item, i) => (
              <div key={i} className="relative box-border">
                {/* Top/Bottom border lines for desktop */}
                <div className="absolute top-[-1px] left-[calc(50%-50vw)] w-[150vw] h-[1px] bg-card-border/10 hidden md:block" />
                <div className="absolute bottom-[-1px] left-[calc(50%-50vw)] w-[150vw] h-[1px] bg-card-border/10 hidden md:block" />
                <div className="w-full outline outline-1 outline-card-border/20 p-2 relative box-border pb-4 md:pb-2 overflow-hidden md:min-h-[160px] lg:min-h-[200px] bg-bg2 rounded-xl transition-shadow duration-300" style={{ boxShadow: open === i ? '0 4px 32px 0 rgba(101,62,232,0.08)' : 'none', background: open === i ? '#18142a' : undefined }}>
                  {/* Coins blancs */}
                  <div className="size-0.5 absolute z-10 bg-white top-0 left-0 -translate-x-1/2 -translate-y-1/2"></div>
                  <div className="size-0.5 absolute z-10 bg-white bottom-0 left-0 -translate-x-1/2 translate-y-1/2"></div>
                  <div className="size-0.5 absolute z-10 bg-white top-0 right-0 translate-x-1/2 -translate-y-1/2"></div>
                  <div className="size-0.5 absolute z-10 bg-white bottom-0 right-0 translate-x-1/2 translate-y-1/2"></div>
                  {/* Image desktop toujours visible, opacité selon état */}
                  <div className="hidden md:block absolute top-0 right-0 sm:w-[350px] sm:h-[322px] lg:w-[495px] lg:h-[456px] overflow-hidden">
                    <Image src={item.img} alt="Accordion illustration" width={495} height={456} className={`rounded border border-batch-bg object-cover transition-opacity duration-300 ${open === i ? 'opacity-100' : 'opacity-60'} md:group-hover:!opacity-100`} style={{position:'absolute',height:'100%',width:'100%',left:0,top:0,right:0,bottom:0,color:'transparent'}} />
                  </div>
                  {/* Header clickable */}
                  <button
                    type="button"
                    className="flex items-start w-full relative group cursor-pointer select-none"
                    aria-expanded={open === i}
                    onClick={() => setOpen(open === i ? null : i)}
                  >
                    <div className="flex flex-col justify-center gap-4 md:max-w-[300px] mobile-lg:max-w-[340px] text-start pt-2 pb-4 md:pb-0 pl-2 lg:pl-8 lg:pt-6 w-full">
                      <div className="flex justify-between items-center">
                        <div className="w-fit inline-flex items-center justify-center whitespace-nowrap rounded-full text-xs !leading-none bg-batch-bg text-w1 px-[8px] py-[6px]">{item.tag}</div>
                      </div>
                      <h4 className="title-2 text-w1 mobile-lg:text-[27px] md:text-lg md:group-hover:drop-shadow-neon-white/50">{item.title}</h4>
                      {/* Texte partiel si fermé, complet si ouvert */}
                      <div className="relative">
                        {open === i ? (
                          <p className="body text-w2 md:text-sm lg:body mb-2 transition-all duration-500">{item.desc}</p>
                        ) : (
                          <div className="overflow-hidden max-h-[2.7em] relative">
                            <p className="body text-w2 md:text-sm lg:body mb-2 whitespace-nowrap overflow-hidden text-ellipsis pr-8">{item.desc}</p>
                            <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-bg2 to-transparent pointer-events-none" />
                          </div>
                        )}
                      </div>
                    </div>
                    <ChevronDownIcon className={`w-7 h-7 text-w2 ml-2 mt-4 transition-transform duration-300 ${open === i ? 'rotate-180' : 'rotate-0'}`} />
                  </button>
                  {/* Content + image mobile */}
                  <div className={`transition-all duration-500 ease-in-out overflow-hidden ${open === i ? 'max-h-[500px] opacity-100 py-4 md:py-2' : 'max-h-0 opacity-0 py-0'}`} style={{ pointerEvents: open === i ? 'auto' : 'none' }}>
                    <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                      <div className="flex-1 flex flex-col gap-4 lg:gap-6">
                        {/* Texte complet et bouton quand ouvert */}
                        {open === i && (
                          <>
                            <a href={item.ctaHref} className="w-fit inline-flex gap-1 items-center justify-center whitespace-nowrap rounded-md caption-cta border border-p1 bg-p1/90 text-w1 hover:bg-p1/100 px-4 py-3 md:px-5 mt-2">{item.cta}</a>
                          </>
                        )}
                      </div>
                      {/* Image mobile dans le contenu rétractable */}
                      <div className="block md:hidden w-full h-full">
                        <Image src={item.img} alt="Accordion illustration" width={400} height={250} className="rounded border border-batch-bg object-cover" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 