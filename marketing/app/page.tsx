'use client';
import Link from 'next/link';
import Image from 'next/image';
import LogoCarousel from '../components/LogoCarousel';
import HowItWorksTabs from '../components/HowItWorksTabs';
import { useState } from 'react';
import AccordionSection from '../components/AccordionSection';
import HeroSection from '../components/HeroSection';

const logos = [
  { src: '/logos/logo1.svg', alt: 'Enterprise Logo' },
  { src: '/logos/logo2.svg', alt: 'Global Co Logo' },
  { src: '/logos/logo3.svg', alt: 'TechCorp Logo' },
  { src: '/logos/logo4.svg', alt: 'Innovate Logo' },
];

const howItWorks = [
  {
    title: 'Connect',
    icon: '/icons/connect.svg',
    description: 'Connect your teams and tools. Elicia AI integrates seamlessly with your stack to centralize knowledge and workflows.',
    image: '/images/connect-tab.svg',
  },
  {
    title: 'Assess',
    icon: '/icons/assess.svg',
    description: 'Assess your engineering maturity. Get instant visibility into standards, ownership, and technical debt.',
    image: '/images/assess-tab.svg',
  },
  {
    title: 'Act',
    icon: '/icons/act.svg',
    description: 'Act on insights. Automate onboarding, migrations, and incident response with AI-powered workflows.',
    image: '/images/act-tab.svg',
  },
];

const benefits = [
  { value: '2x', label: 'Deployment frequency' },
  { value: '20%', label: 'Improved dev productivity' },
  { value: '33%', label: 'Faster migrations' },
  { value: '67%', label: 'Reduction of MTTR' },
  { value: '25%', label: 'Faster time to market' },
];

const useCases = [
  { title: 'Developer Onboarding', desc: 'Accelerate onboarding with automated documentation and guided workflows.' },
  { title: 'Modernization', desc: 'Drive modernization initiatives with visibility and automation.' },
  { title: 'Production Readiness', desc: 'Ensure every service meets your standards before going live.' },
  { title: 'Incident Response', desc: 'Reduce MTTR with AI-powered incident workflows and knowledge surfacing.' },
  { title: 'Self-Service', desc: 'Empower teams to ship faster with self-service tools and templates.' },
  { title: 'Backstage Migration', desc: 'Migrate to Backstage or other platforms with confidence and automation.' },
];

const testimonials = [
  {
    quote: "Elicia AI transformed our engineering culture. We ship faster, with more confidence, and our onboarding is seamless.",
    name: 'Marie Dupont',
    title: 'VP Engineering, Innovate',
    logo: '/logos/logo-testimonial-bigcommerce.svg',
    profileIcon: '/profiles/marie-dupont.png',
  },
  {
    quote: "The visibility and automation Elicia AI provides is a game changer for our platform teams.",
    name: 'John Smith',
    title: 'Head of Platform, TechCorp',
    logo: '/logos/logo-testimonial-rapid.svg',
    profileIcon: '/profiles/john-smith.jpg',
  },
  {
    quote: "Good solution for our sales team, working perfectly !",
    name: 'Marc Ferlip',
    title: 'CEO, DosliRealEstate',
    logo: '/logos/logo-testimonial-letsgetkicked.svg',
    profileIcon: '/profiles/marc-ferlip.jpg',
  },

  {
    quote: "Very nice software that I have now been using for 2 weeks and which is performing very well.    Good solution for our sales team, working perfectly !",
    name: 'Kevin Kacev',
    title: 'Business Development Manager, Ladem',
    logo: '/logos/logo-testimonial-bigcommerce.svg',
    profileIcon: '/profiles/kevin-kacev.jpg',
  },
];

const partnerLogos = [
  { src: 'https://a-us.storyblok.com/f/1021527/152x55/2fdfeea307/64d2493582f41e59b4c088ff_affirm.svg', alt: 'Affirm' },
  { src: 'https://a-us.storyblok.com/f/1021527/300x108/0d0db1e542/canva-logo.svg', alt: 'Canva' },
  { src: 'https://a-us.storyblok.com/f/1021527/152x55/31f143646b/66a93bb62e703eb3e11c4131_attentive-logo-180-64-light.svg', alt: 'Attentive' },
  { src: 'https://a-us.storyblok.com/f/1021527/153x55/9de7720235/66a93d0ece92bf0b0ff36795_oreilly-logo-180-64-light.svg', alt: 'OReilly' },
  { src: 'https://a-us.storyblok.com/f/1021527/152x55/7b7e5dde51/65bbbff2010b3d19fbda85f0_logo-nubank.svg', alt: 'Nubank' },
  { src: 'https://a-us.storyblok.com/f/1021527/152x55/4a8e69a4a3/6622dec49bf9dbd99d74f64f_skyscanner.svg', alt: 'Skyscanner' },
  { src: 'https://a-us.storyblok.com/f/1021527/152x55/2ac73ee42e/64d2494c9f412fb1a1e41658_avianca.svg', alt: 'Avianca' },
  { src: 'https://a-us.storyblok.com/f/1021527/152x55/183f2cbba8/64d248fd7e819903941d6018_tripadvisor.svg', alt: 'Tripadvisor' },
  { src: 'https://a-us.storyblok.com/f/1021527/153x55/b1e5dc5664/64f10aa218c8f16a35b3426e_chegg.svg', alt: 'Chegg' },
  { src: 'https://a-us.storyblok.com/f/1021527/152x55/69cf3fe65f/6633fb6a345c88c5059058ab_logo-grammarly.svg', alt: 'Grammarly' },
  { src: 'https://a-us.storyblok.com/f/1021527/152x55/48bc406023/64f0b14eeac4d00b3e9d3d90_national-geographic.svg', alt: 'National Geographic' },
  { src: 'https://a-us.storyblok.com/f/1021527/152x55/3bf9323002/bumble-logo-banner.svg', alt: 'Bumble' },
  { src: 'https://a-us.storyblok.com/f/1021527/153x55/c5801f5bb6/65720e02da87bd0b916cff32_logo-xero.svg', alt: 'Xero' },
  { src: 'https://a-us.storyblok.com/f/1021527/153x55/ba6f7e9f21/64d2490e8718fb26707ba839_sofi.svg', alt: 'Sofi' },
  { src: 'https://a-us.storyblok.com/f/1021527/152x55/c2ef33fd8c/fanatics-logo-banner.svg', alt: 'Fanatics' },
];

// Section: Measurable Benefits (déjà présente, enrichie)
function MeasurableBenefits() {
  // Données des KPIs
  const kpis = [
    {
      value: '2x',
      label: 'deployment frequency',
      link: 'case-studies/letsgetchecked',
      linkLabel: 'Case study',
      external: false,
    },
    {
      value: '20%',
      label: 'improved dev productivity',
      link: 'https://go.cortex.io/forrester-tei_report_reg.html',
      linkLabel: 'Report',
      external: true,
    },
    {
      value: '33%',
      label: 'faster migrations',
      link: 'case-studies/letsgetchecked',
      linkLabel: 'Case study',
      external: false,
    },
    {
      value: '67%',
      label: 'reduction of MTTR',
      link: 'case-studies/letsgetchecked',
      linkLabel: 'Case study',
      external: false,
    },
    {
      value: '25%',
      label: 'faster time to market',
      link: 'https://go.cortex.io/forrester-tei_report_reg.html',
      linkLabel: 'Report',
      external: true,
    },
    {
      value: '5',
      label: 'eng headcount reallocated',
      link: 'https://go.cortex.io/forrester-tei_report_reg.html',
      linkLabel: 'Report',
      external: true,
    },
  ];

  return (
    <section className="container-dark py-24 opacity-100">
      <div className="container-fluid flex flex-col gap-12 items-center justify-center">
        <div className="flex flex-col gap-6 items-center text-center text-pretty max-w-3xl section-x">
          <h2 className="large-title text-w1">Actually measurable benefits</h2>
          <p className="text-w2 body">
            How are you quantifying the impact of your Internal Developer Portal?{' '}
            <a
              className="relative transition-all duration-500 will-change-[background-size] text-p2 bg-[linear-gradient(#B4A4EF,#B4A4EF)] bg-left-bottom bg-no-repeat bg-[length:0%_1px] hover:bg-[length:100%_1px]"
              href="/products/eng-intelligence"
            >
              Cortex Eng Intelligence
            </a>{' '}
            makes it easy to track metrics that accrue to real business and developer value like deployment frequency or SLO attainment. For everything else, check out our{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="relative transition-all duration-500 will-change-[background-size] text-p2 bg-[linear-gradient(#B4A4EF,#B4A4EF)] bg-left-bottom bg-no-repeat bg-[length:0%_1px] hover:bg-[length:100%_1px]"
              href="https://go.cortex.io/forrester-tei_report_reg.html"
            >
              Total Economic Impact Report
            </a>.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 grid-rows-5 md:grid-rows-4 lg:grid-rows-2 w-full relative mt-8">
          {/* Lignes horizontales top/bottom */}
          <div className="absolute top-[8px] left-[calc(50%-50vw)] w-[150vw] h-[1px] bg-card-border/10"></div>
          <div className="absolute bottom-[8px] left-[calc(50%-50vw)] w-[150vw] h-[1px] bg-card-border/10"></div>

          {/* Bloc image principal (grande case à gauche) */}
          <div className="col-start-1 col-end-3 row-start-1 row-end-3 sm:row-end-4 sm:col-end-4 lg:col-end-3 lg:row-end-3 m-1 sm:m-2 relative border border-border/20 lg:border-y-border/10 box-border aspect-square bg-bg2 flex items-center justify-center">
            {/* Coins blancs */}
            <div className="size-0.5 absolute z-10 bg-white top-0 left-0 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="size-0.5 absolute z-10 bg-white bottom-0 left-0 -translate-x-1/2 translate-y-1/2"></div>
            <div className="size-0.5 absolute z-10 bg-white top-0 right-0 translate-x-1/2 -translate-y-1/2"></div>
            <div className="size-0.5 absolute z-10 bg-white bottom-0 right-0 translate-x-1/2 translate-y-1/2"></div>
            <div className="size-0.5 absolute z-10 bg-white top-0 left-1/2 -translate-x-1/2 -translate-y-px"></div>
            <div className="size-0.5 absolute z-10 bg-white bottom-0 left-1/2 -translate-x-1/2 translate-y-px"></div>
            <div className="size-0.5 absolute z-10 bg-white left-0 top-1/2 -translate-y-1/2 -translate-x-px"></div>
            <div className="size-0.5 absolute z-10 bg-white right-0 top-1/2 -translate-y-1/2 translate-x-px"></div>
            <img
                    alt="" 
              draggable="false"
              loading="lazy"
              width={500}
              height={500}
              decoding="async"
              className="w-full h-full aspect-square object-contain"
              style={{ color: 'transparent' }}
              src="/images/home_measure.png"
            />
          </div>

          {/* Blocs KPI */}
          {/* 1 */}
          <div className="aspect-square relative border border-border/20 m-1 sm:m-2 col-span-1 row-span-1 col-start-1 row-start-3 sm:col-start-1 sm:row-start-4 lg:col-start-3 lg:row-start-1 lg:border-t-border/10 flex flex-col items-center justify-center bg-bg2 p-2">
            <KPIBlock {...kpis[0]} />
              </div>
          {/* 2 */}
          <div className="aspect-square relative border border-border/20 m-1 sm:m-2 col-span-1 row-span-1 col-start-2 row-start-3 sm:col-start-2 sm:row-start-4 lg:col-start-4 lg:row-start-1 lg:border-t-border/10 flex flex-col items-center justify-center bg-bg2 p-2">
            <KPIBlock {...kpis[1]} />
              </div>
          {/* 3 */}
          <div className="aspect-square relative border border-border/20 m-1 sm:m-2 col-span-1 row-span-1 col-start-1 row-start-4 sm:col-start-3 sm:row-start-4 lg:col-start-5 lg:row-start-1 lg:border-t-border/10 flex flex-col items-center justify-center bg-bg2 p-2">
            <KPIBlock {...kpis[2]} />
            </div>
          {/* 4 */}
          <div className="aspect-square relative border border-border/20 m-1 sm:m-2 col-span-1 row-span-1 col-start-2 row-start-4 sm:col-start-1 sm:row-start-5 lg:col-start-3 lg:row-start-2 flex flex-col items-center justify-center bg-bg2 p-2">
            <KPIBlock {...kpis[3]} />
          </div>
          {/* 5 */}
          <div className="aspect-square relative border border-border/20 m-1 sm:m-2 col-span-1 row-span-1 col-start-1 row-start-5 sm:col-start-2 sm:row-start-5 lg:col-start-4 lg:row-start-2 flex flex-col items-center justify-center bg-bg2 p-2">
            <KPIBlock {...kpis[4]} />
          </div>
          {/* 6 */}
          <div className="aspect-square relative border border-border/20 m-1 sm:m-2 col-span-1 row-span-1 col-start-2 row-start-5 sm:col-start-3 sm:row-start-5 lg:col-start-5 lg:row-start-2 flex flex-col items-center justify-center bg-bg2 p-2">
            <KPIBlock {...kpis[5]} />
            </div>
          </div>
        </div>
      </section>
  );
}

function KPIBlock({ value, label, link, linkLabel, external }) {
  return (
    <div className="flex justify-center items-center flex-col sm:gap-1 bg-bg2 w-full h-full p-2 text-pretty relative">
      <div className="measure-title text-7xl bg-gradient-to-b from-[#ECEAF4] to-[rgba(236,234,244,0.80)] bg-clip-text text-transparent sm:mt-[11px]">{value}</div>
      <p className="body text-p2 text-center h-[44px] sm:h-auto flex items-center justify-center leading-none">{label}</p>
      <a
        className="w-fit inline-flex gap-1 items-center justify-center whitespace-nowrap rounded-md caption-cta ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-w1 hover:text-link-hover px-4 py-3 md:px-5"
        href={link}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {linkLabel}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
          <g clipPath="url(#clip0_2734_972)"><path d="M4.5 2.25L8.25 6L4.5 9.75" stroke="#ECEAF4" strokeWidth="1.2" strokeLinejoin="round"></path></g>
          <defs><clipPath id="clip0_2734_972"><rect width="12" height="12" fill="white"></rect></clipPath></defs>
        </svg>
      </a>
    </div>
  );
}

// Section: Architecture/DevEx
function ArchitectureSection() {
  const features = [
    {
      icon: "https://a-us.storyblok.com/f/1021527/20x20/527a3190c4/database.svg",
      title: "A true engineering system of record",
      desc: "To ensure adoption, your IDP must model data in a way that matches business logic. Cortex does the heavy lifting of that process for you, while preserving the customization you need.",
    },
    {
      icon: "https://a-us.storyblok.com/f/1021527/20x20/bb83225d26/listchecks.svg",
      title: "Always-on standards that stick",
      desc: "Passive software standards get ignored. Continuously assess software and teams for progress towards your ideal state. Build via GUI or GitOps—no custom scripts required.",
    },
    {
      icon: "https://a-us.storyblok.com/f/1021527/20x20/304190d219/sharenetwork2.png",
      title: "Self-service that stays on the rails",
      desc: "Eliminate toil without losing track. Centralize developer workflows across other tools, and add one-click templates and approvals to keep gates from becoming bottlenecks.",
    },
  ];

  return (
    <section className="container-dark opacity-100 py-24">
      <div className="flex flex-col gap-10 md:gap-20 items-center">
        <div className="flex flex-col gap-6 items-center text-center section-x">
          <h2 className="large-title text-w1">A different kind of DevEx</h2>
          <p className="body text-w2 w-full !text-balance">
            Information access is the first step towards a positive developer experience. Cortex abstracts away the work required to connect all your tools so developers spend less time finding and fixing, and more time building—no matter how complex your platform gets.
          </p>
        </div>
        {/* Video desktop / image mobile */}
        <div className="hidden sm:flex relative w-full h-auto justify-center items-center px-4 md:px-12">
          <video
            className="w-full h-full object-cover rounded-md mix-blend-lighten"
            preload="none"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="https://a-us.storyblok.com/f/1021527/x/f4d27f0e4b/homepage_compressed.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="flex sm:hidden relative w-full h-auto justify-center items-center px-4 md:px-12">
          <img
            alt=""
            draggable="false"
            loading="lazy"
            width={1000}
            height={1000}
            decoding="async"
            className="object-cover"
            style={{ color: "transparent" }}
            src="https://a-us.storyblok.com/f/1021527/750x2839/0a29382e98/cortex_home_mobile_asset.png"
          />
        </div>
        {/* Features */}
        <div className="flex flex-col md:flex-row w-full justify-center items-center lg:container-fluid">
          <div className="flex flex-col gap-12 m-4 md:gap-12 md:flex-row md:mx-12 relative lg:mx-0">
            {features.map((f, i) => (
              <div key={i} className="flex flex-col gap-2 md:gap-6 items-start md:w-full lg:flex-1">
                <div className="text-w1 flex gap-2 md:px-2 items-start">
                  <div className="flex items-center justify-center body text-w1 w-6 h-6">
                    <img
                      alt=""
                      draggable="false"
                      loading="lazy"
                      width={20}
                      height={20}
                      decoding="async"
                      className="pt-0 md:pt-1"
                      style={{ color: "transparent" }}
                      src={f.icon}
                    />
                  </div>
                  <h3 className="subtitle w-fit">{f.title}</h3>
                </div>
                <p className="body text-w2 md:px-2">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Nouvelle section FAQ fidèle à cortex.io
const faqsCortex = [
  {
    q: "What are Internal Developer Portals?",
    a: (
      <>
        Internal Developer Portals (IDPs) are the engineering system of record. They use connections to all tooling to provide golden paths for new software builds, and ensure continuous alignment to standards of excellence.<br /><br />
        From services and APIs to Kubernetes clusters and data pipelines—IDPs eliminate "swivel chair" for devs by centralizing the information they need to build, deploy, and maintain healthy software. LetsGetChecked, BigCommerce, and Grammarly see results like decreased incident frequency and duration, and increased in deployment velocity with Cortex's IDP.
      </>
    ),
  },
  {
    q: "What does Cortex do that my existing tool stack can't?",
    a: (
      <>
        Cortex unifies your engineering data and workflows, providing a single source of truth and actionable insights that are not possible with disconnected tools. It enables continuous improvement, golden paths, and measurable business outcomes.
      </>
    ),
  },
  {
    q: "How does Cortex solve software ownership?",
    a: (
      <>
        Cortex automatically maps ownership across all your services, APIs, and resources, keeping information up to date and actionable. This ensures the right people are always accountable and informed.
      </>
    ),
  },
  {
    q: "How does Cortex help with production readiness?",
    a: (
      <>
        Cortex enforces production standards and readiness requirements, providing real-time scorecards and reporting. Teams can track and remediate gaps before going live, reducing risk and improving reliability.
      </>
    ),
  },
  {
    q: "How does Cortex help improve developer productivity?",
    a: (
      <>
        By centralizing information, automating workflows, and surfacing actionable insights, Cortex reduces context switching and manual work, so developers spend more time building and less time searching or fixing.
      </>
    ),
  },
  {
    q: "How is Cortex different from Backstage?",
    a: (
      <>
        Cortex is a fully managed, enterprise-grade platform with deep integrations, automation, and analytics out of the box. It requires no custom scripts, scales with your needs, and delivers measurable business value faster than open-source alternatives.
      </>
    ),
  },
];

function FAQSectionCortex() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="container-dark opacity-100 py-24" id="faq">
      <div className="flex flex-col gap-16 md:gap-24 container-fluid section-x">
        <div className="flex flex-col gap-6 w-full items-center text-center">
          <h3 className="title-1 text-w1">FAQs</h3>
        </div>
        <div className="flex flex-col w-full" data-orientation="vertical">
          {faqsCortex.map((faq, i) => (
            <div
              key={i}
              data-state={open === i ? 'open' : 'closed'}
              data-orientation="vertical"
              className={`relative before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[1px] before:bg-w1 before:opacity-20 last:after:content-[''] last:after:absolute last:after:bottom-0 last:after:left-0 last:after:right-0 last:after:h-[1px] last:after:bg-w1 last:after:opacity-20 border-t border-bg1/10 last:border-b`}
            >
              <h3 data-orientation="vertical" data-state={open === i ? 'open' : 'closed'} className="flex">
                <button
                  type="button"
                  aria-controls={`faq-panel-${i}`}
                  aria-expanded={open === i}
                  data-state={open === i ? 'open' : 'closed'}
                  data-orientation="vertical"
                  id={`faq-trigger-${i}`}
                  className={`flex flex-1 items-center justify-between title-2 text-w1 text-start transition-all [&[data-state=open]>svg]:rotate-90 py-6 [&_path]:stroke-w1 [&[data-state=open]_path]:stroke-p2`}
                  onClick={() => setOpen(open === i ? null : i)}
                  data-radix-collection-item=""
                >
                  <h4 className="title-2 text-w1">{faq.q}</h4>
                  {/* Flèche SVG */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 text-muted-foreground transition-transform duration-200">
                    <g clipPath="url(#clip0_2747_860)">
                      <path d="M6 18L18 6" stroke="#ECEAF4" strokeLinejoin="round"></path>
                      <path d="M8.25 6H18V15.75" stroke="#ECEAF4" strokeLinejoin="round"></path>
                    </g>
                    <defs>
                      <clipPath id="clip0_2747_860"><rect width="24" height="24" fill="white"></rect></clipPath>
                    </defs>
                  </svg>
                </button>
              </h3>
              <div
                data-state={open === i ? 'open' : 'closed'}
                id={`faq-panel-${i}`}
                role="region"
                aria-labelledby={`faq-trigger-${i}`}
                data-orientation="vertical"
                className={`overflow-hidden body text-w2 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down transition-all duration-300 ${open === i ? 'max-h-96 py-4' : 'max-h-0 py-0'}`}
                style={{ pointerEvents: open === i ? 'auto' : 'none' }}
              >
                <div className="pb-4 pt-0">
                  <p className="body text-w1">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
      </section>
  );
}

// Section: Blog/News
const blogPosts = [
  { title: "How AI is transforming DevOps", excerpt: "Discover how AI-driven automation is changing the way teams build and operate software.", image: "/images/hero-preview-application.avif", link: "#" },
  { title: "Best practices for onboarding engineers", excerpt: "Learn the secrets to fast, effective onboarding with Elicia AI.", image: "/images/home_acc_01.png", link: "#" },
  { title: "Measuring engineering excellence", excerpt: "What metrics matter most for high-performing teams?", image: "/images/home_measure.png", link: "#" },
];
function BlogSection() {
  return (
    <div className="bg-transparent flex justify-center items-center w-full h-full gap-28 relative py-24">
      <section className="container-dark opacity-100 w-full">
        <div className="container-fluid">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-12 bg-banner-p border-banner-p-border border-[1px] p-5 sm:p-10 shadow-banner-p-shadow relative rounded-xl">
            {/* Coins blancs */}
            <div className="absolute w-[2px] h-[2px] bg-white top-0 left-0 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute w-[2px] h-[2px] bg-white top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute w-[2px] h-[2px] bg-white top-0 right-0 translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute w-[2px] h-[2px] bg-white top-1/2 right-0 translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute w-[2px] h-[2px] bg-white bottom-0 right-0 translate-x-1/2 translate-y-1/2"></div>
            <div className="absolute w-[2px] h-[2px] bg-white bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"></div>
            <div className="absolute w-[2px] h-[2px] bg-white bottom-0 left-0 -translate-x-1/2 translate-y-1/2"></div>
            <div className="absolute w-[2px] h-[2px] bg-white top-1/2 left-0 -translate-x-1/2 -translate-y-1/2"></div>
            {/* Colonne gauche */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6 items-start text-start">
              <div className="w-fit inline-flex items-center justify-center whitespace-nowrap rounded-full text-xs !leading-none bg-batch-bg text-w1 px-[8px] py-[6px]">Blog</div>
              <h2 className="large-title text-w1">What's new in our blog</h2>
              <p className="body text-w2">Subscribe to our blog and be the first to know about the latest updates, features, and innovations in Elicia AI. Get insights straight from the source—join our community today.</p>
              <div className="flex gap-4">
                <a className="w-fit inline-flex gap-1 items-center justify-center whitespace-nowrap rounded-md caption-cta border border-batch-bg bg-bg4/30 text-w1 hover:bg-bg4/35 px-4 py-3 md:px-5 transition" href="/blog">See all articles</a>
              </div>
              {/* Formulaire d'inscription email */}
              <form className="flex gap-2 mt-8 sm:mt-auto w-full max-w-xs">
                <input type="email" placeholder="Email Address" className="rounded-md px-4 py-2 bg-bg2 border border-border/20 text-w1 placeholder-w3 focus:outline-none focus:ring-2 focus:ring-p1/40 w-full" />
                <button type="submit" className="rounded-md px-4 py-2 bg-p1 text-w1 hover:bg-p2 transition">Subscribe</button>
              </form>
            </div>
            {/* Colonne droite : articles */}
            <div className="w-full lg:w-1/2 flex flex-col gap-2 items-start text-start">
              {blogPosts.map((post, i) => (
                <a key={i} href={post.link} className="flex sm:flex-row flex-col p-4 rounded-md w-full gap-6 border-[1px] border-transparent hover:bg-banner-post hover:border-banner-post transition cursor-pointer group">
                  <div className="w-full sm:w-2/5 rounded-md overflow-hidden">
                    <img alt={post.title} draggable="false" loading="lazy" width={100} height={100} className="w-full h-auto rounded-sm object-cover group-hover:scale-105 transition-transform duration-300" src={post.image} />
            </div>
                  <div className="flex flex-col gap-3 w-full sm:w-3/5">
                    <h5 className="subtitle text-w1 leading-6">{post.title}</h5>
                    <p className="body text-w3 line-clamp-2">{post.excerpt}</p>
            </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Section: Final CTA
function FinalCTA() {
  return (
    <section className="flex justify-center items-center h-[400px] md:h-[768px] w-full lg:min-h-fit md:py-40 relative overflow-hidden" aria-labelledby="prefooter-heading">
      {/* Fond SVG animé, visible uniquement sur desktop */}
      <div className="hidden md:block absolute top-0 w-full h-full overflow-hidden md:min-w-[1550px] pointer-events-none select-none">
        <div className="relative w-full h-full flex justify-center items-center scale-[3] sm:scale-[2.3] md:scale-125 lg:scale-105">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[1.4] lg:scale-[2] w-full h-full md:min-w-[2000px]" style={{maskImage:'linear-gradient(to right, rgba(0,0,0,0) 10%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 90%)',maskSize:'55% 150%',maskPosition:'center'}}>
            {/* SVG principal */}
            <svg width="2730" height="940" viewBox="0 0 2730 940" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <defs>
                <linearGradient id="pulse-left" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop stopColor="rgba(119,86,232,0)" offset="98.88%" />
                  <stop stopColor="rgba(119,86,232,0.4)" offset="99.04%" />
                  <stop stopColor="rgba(119,86,232,0.95)" offset="107.04%" />
                  <stop stopColor="rgba(119,86,232,0)" offset="108.04%" />
                </linearGradient>
                <linearGradient id="pulse-right" x1="100%" y1="0%" x2="0%" y2="0%">
                  <stop stopColor="rgba(255,153,0,0)" offset="98.88%" />
                  <stop stopColor="rgba(255,153,0,0.4)" offset="99.04%" />
                  <stop stopColor="rgba(255,153,0,0.95)" offset="107.04%" />
                  <stop stopColor="rgba(255,153,0,0)" offset="108.04%" />
                </linearGradient>
              </defs>
              <path d="M528.102 0C528.102 263.096 1039.7 446 1364.56 446" stroke="transparent" strokeOpacity="0" strokeWidth="1" className="transition-all duration-500" />
              <path d="M528.102 940C528.102 676.904 1039.7 494 1364.56 494" stroke="transparent" strokeOpacity="0" strokeWidth="1" className="transition-all duration-500" />
              <path d="M358.189 19C358.189 277.377 973.71 457 1364.56 457" stroke="url(#pulse-left)" strokeOpacity="1" strokeWidth="1" className="transition-all duration-500" />
              <path d="M1 131C1 328.617 834.991 466 1364.56 466" stroke="transparent" strokeOpacity="0" strokeWidth="1" className="transition-all duration-500" />
              <path d="M1 809C1 611.383 834.991 474 1364.56 474" stroke="transparent" strokeOpacity="0" strokeWidth="1" className="transition-all duration-500" />
              <path d="M358.189 921C358.189 662.623 973.71 483 1364.56 483" stroke="url(#pulse-left)" strokeOpacity="1" strokeWidth="1" className="transition-all duration-500" />
              <path d="M2201.46 940C2201.46 676.904 1689.86 494 1365 494" stroke="transparent" strokeOpacity="0" strokeWidth="1" className="transition-all duration-500" />
              <path d="M2201.46 0C2201.46 263.096 1689.86 446 1365 446" stroke="url(#pulse-right)" strokeOpacity="1" strokeWidth="1" className="transition-all duration-500" />
              <path d="M2371.38 921C2371.37 662.623 1755.85 483 1365.01 483" stroke="transparent" strokeOpacity="0" strokeWidth="1" className="transition-all duration-500" />
              <path d="M2728.56 809C2728.56 611.383 1894.57 474 1365 474" stroke="transparent" strokeOpacity="0" strokeWidth="1" className="transition-all duration-500" />
              <path d="M2728.56 131C2728.56 328.617 1894.57 466 1365 466" stroke="url(#pulse-right)" strokeOpacity="1" strokeWidth="1" className="transition-all duration-500" />
              <path d="M2371.38 19C2371.38 277.377 1755.85 457 1365.01 457" stroke="transparent" strokeOpacity="0" strokeWidth="1" className="transition-all duration-500" />
            </svg>
          </div>
        </div>
              </div>
      {/* Contenu centré */}
      <div className="flex flex-col relative max-w-[300px] text-center items-center gap-10 md:mt-16 z-10 mx-auto">
        <h2 className="large-title text-w1 !text-[38px] md:!text-[48px]">Talk to an expert today</h2>
        <div className="relative group/main">
          <a className="w-fit inline-flex gap-1 items-center justify-center whitespace-nowrap rounded-md caption-cta ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-p1 bg-p1/90 text-w1 hover:bg-p1/100 px-4 py-3 md:px-5" href="/contact">
            Get in touch
            <svg width="16" height="16" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1"><path d="M4.5 2.25L8.25 6L4.5 9.75" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
          </a>
          </div>
        </div>
      </section>
  );
}

export default function LandingPage() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const visibleTestimonials = testimonials.slice(
    Math.max(0, testimonialIndex - 1),
    Math.min(testimonials.length, testimonialIndex + 2)
  );

  return (
    <main className="bg-bg1 text-w1">
      <HeroSection />
      {/* Logo carousel bandeau déroulant */}
      <LogoCarousel logos={partnerLogos} />

      {/* How it works */}
      <HowItWorksTabs />

      {/* Testimonials carousel */}
      <section className="flex justify-center w-full relative flex-col items-center text-center gap-12 bg-w1 text-bg1 section-y lg:pb-32">
        <h2 className="large-title section-x max-w-[900px] !text-balance">Accelerating engineering excellence at world class organizations</h2>
        <div className="max-w-full lg:max-w-[2000px] mx-auto relative select-none">
          <div className="overflow-hidden relative group cursor-grab active:cursor-grabbing">
            {/* Flèches navigation */}
            <button
              type="button"
              aria-label="Previous testimonial"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white/90 border border-p1/20 rounded-full p-2 shadow transition hidden md:block"
              style={{marginLeft: '-24px'}}
              onClick={() => setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
            >
              <svg width="16" height="16" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1 rotate-180"><path d="M4.5 2.25L8.25 6L4.5 9.75" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
            </button>
            <button
              type="button"
              aria-label="Next testimonial"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white/90 border border-p1/20 rounded-full p-2 shadow transition hidden md:block"
              style={{marginRight: '-24px'}}
              onClick={() => setTestimonialIndex((prev) => (prev + 1) % testimonials.length)}
            >
              <svg width="16" height="16" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1"><path d="M4.5 2.25L8.25 6L4.5 9.75" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
            </button>
            {/* Gradients latéraux desktop */}
            <div className="absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-w1 to-transparent pointer-events-none hidden md:block"></div>
            <div className="absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-w1 to-transparent pointer-events-none hidden md:block"></div>
            {/* Carrousel horizontal - 3 visibles, mapping circulaire, drag natif */}
            <div
              className="flex -ml-4 touch-pan-y touch-pinch-zoom overflow-x-auto no-scrollbar justify-center items-center select-none"
              style={{scrollSnapType:'x mandatory', minHeight: 320}}
              tabIndex={0}
              onMouseDown={e => {
                const el = e.currentTarget;
                let startX = e.pageX;
                let scrollLeft = el.scrollLeft;
                const onMove = (ev) => {
                  el.scrollLeft = scrollLeft - (ev.pageX - startX);
                };
                const onUp = () => {
                  window.removeEventListener('mousemove', onMove);
                  window.removeEventListener('mouseup', onUp);
                  el.classList.remove('dragging');
                };
                window.addEventListener('mousemove', onMove);
                window.addEventListener('mouseup', onUp);
                el.classList.add('dragging');
              }}
            >
              {(() => {
                const n = testimonials.length;
                if (n === 0) return null;
                // Indices circulaires
                const prev = (testimonialIndex - 1 + n) % n;
                const curr = testimonialIndex;
                const next = (testimonialIndex + 1) % n;
                const visible = [prev, curr, next];
                return visible.map((idx, pos) => {
                  let opacity = 'opacity-30';
                  let translate = '';
                  let z = '';
                  if (pos === 1) { opacity = 'opacity-100'; z = 'z-10'; }
                  else if (pos === 0) { translate = '-translate-x-4 z-0'; }
                  else if (pos === 2) { translate = 'translate-x-4 z-0'; }
                  const t = testimonials[idx];
                  return (
                    <div
                      key={idx}
                      className={`transition-all duration-500 w-full max-w-2xl flex ${opacity} ${translate} ${z}`}
                      style={{scrollSnapAlign:'center'}}
                    >
                      <div className="flex flex-col gap-4 w-full px-4">
                        <div className="flex flex-col gap-10 items-center text-center">
                          <div className="flex gap-3 items-center">
                            <img src={t.profileIcon} alt={t.name} className="rounded-full h-10 w-10 object-cover" />
                            <h3 className="subtitle text-bg1">{t.name}</h3>
                          </div>
                          <h4 className="title-2 max-w-3xl">“{t.quote}”</h4>
                          <div className="flex gap-3 items-center">
                            <span className="caption text-w4">{t.title}</span>
                            <img src={t.logo} alt="Company Logo" className="max-h-8 max-w-full" />
        </div>
            </div>
            </div>
            </div>
                  );
                });
              })()}
            </div>
          </div>
          {/* Pagination dots */}
          <div className="flex justify-center mt-12">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`go to slide ${i+1}`}
                className={`w-2 h-2 rounded-full cursor-pointer mx-1 ${i === testimonialIndex ? 'bg-p1' : 'bg-w2'}`}
                onClick={() => setTestimonialIndex(i)}
              />
            ))}
          </div>
        </div>
        {/* CTA bouton */}
        <div className="flex justify-center w-full">
          <div className="relative group/main">
            <a className="w-fit inline-flex gap-1 items-center justify-center whitespace-nowrap rounded-md caption-cta ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-p1 bg-p1/90 text-w1 hover:bg-p1/100 px-4 py-3 md:px-5" href="/demo-request">
              Schedule a demo
              <svg width="16" height="16" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1"><path d="M4.5 2.25L8.25 6L4.5 9.75" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
            </a>
          </div>
        </div>
      </section>

      {/* Accordion Section: Accelerate any engineering excellence initiative */}
      <AccordionSection />
      <MeasurableBenefits />
      <ArchitectureSection />
      <FAQSectionCortex />
      <BlogSection />
      <FinalCTA />
    </main>
  );
} 