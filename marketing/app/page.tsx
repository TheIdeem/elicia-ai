import Link from 'next/link';
import Image from 'next/image';

const clientLogos = [
  '/logos/logo1.svg', '/logos/logo2.svg', '/logos/logo3.svg', '/logos/logo4.svg', '/logos/logo5.svg', '/logos/logo6.svg', '/logos/logo7.svg', '/logos/logo8.svg', '/logos/logo9.svg', '/logos/logo10.svg',
];

const howItWorks = [
  { title: 'Connect', desc: 'Quickly connect your entire ecosystem to make it easy to identify owners, understand state, drive action, and measure outcomes.', icon: '/icons/connect.svg' },
  { title: 'Assess', desc: 'Assess your engineering maturity and standards alignment with live feeds from connected tools.', icon: '/icons/assess.svg' },
  { title: 'Act', desc: 'Drive action with targeted alerts and workflow automations.', icon: '/icons/act.svg' },
  { title: 'Build', desc: 'Build golden paths and templates to reduce risk and time to code.', icon: '/icons/build.svg' },
  { title: 'Measure', desc: 'Track metrics that accrue to real business and developer value.', icon: '/icons/measure.svg' },
];

const benefits = [
  { value: '2x', label: 'deployment frequency' },
  { value: '20%', label: 'improved dev productivity' },
  { value: '33%', label: 'faster migrations' },
  { value: '67%', label: 'reduction of MTTR' },
  { value: '25%', label: 'faster time to market' },
];

const testimonials = [
  {
    quote: `Walk away from a spreadsheet for a minute, and it's already stale. With Cortex, we never have that issue. I can just trust that information is always up to date, and we can leave devs alone that have already done what they need to do.`,
    name: 'Amanda Jackson',
    title: 'Technical Program Manager, Rapid7',
    logo: '/logos/logo1.svg',
  },
  {
    quote: 'More and more we think of Cortex less as a product and more as a platform on which we are building all of our internal intelligence for engineering.',
    name: 'Kurt Christensen',
    title: 'Senior Engineering Manager',
    logo: '/logos/logo2.svg',
  },
  {
    quote: `We know if an engineer gets pulled out of what they're doing, it takes 30 minutes to re-engage, Cortex lets us reduce noise and keep our team focused on the highest priority work.`,
    name: 'Shaun McCormick',
    title: 'Principal Software Engineer',
    logo: '/logos/logo3.svg',
  },
  {
    quote: `One of the biggest improvements we've seen since implementing Cortex is in our Mean Time to Restore- which we reduced by 67%. Being able to quickly find service information is a small operational change that has enormous impact.`,
    name: 'Javier de Vega Ruiz',
    title: 'Chief Software Engineer',
    logo: '/logos/logo4.svg',
  },
];

const faqs = [
  { q: 'What are Internal Developer Portals?', a: 'Internal Developer Portals (IDPs) are the engineering system of record. They use connections to all tooling to provide golden paths for new software builds, and ensure continuous alignment to standards of excellence.' },
  { q: 'How does Cortex help with production readiness?', a: 'Define production requirements for services, resources, APIs, models, and more. Supply templates to reduce risk and time to code, and track on-going alignment to standards with real-time scorecards and reporting.' },
  { q: 'How does Cortex help improve developer productivity?', a: 'Cortex abstracts away the work required to connect all your tools so developers spend less time finding and fixing, and more time building—no matter how complex your platform gets.' },
  { q: 'How is Cortex different from Backstage?', a: 'Cortex provides a true engineering system of record, always-on standards, and self-service that stays on the rails, with no custom scripts required.' },
];

export default function LandingPage() {
  return (
    <main className="bg-white text-gray-900 font-sans">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#2B2BFF] to-[#6C47FF] text-white pt-24 pb-32 text-center overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Your Portal to Engineering Excellence</h1>
          <p className="text-xl mb-8 opacity-90">
            Cortex is the enterprise Internal Developer Portal built to accelerate the path to engineering excellence. Abstract away complexity in your platform to ensure ownership, enforce standards, and unlock developer self-service, in weeks—not years.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4 mb-10">
            <Link href="/demo-request">
              <button className="px-8 py-4 rounded-full bg-white text-[#2B2BFF] font-semibold text-lg shadow hover:bg-gray-100 transition">Book a live demo</button>
            </Link>
            <Link href="/try-now">
              <button className="px-8 py-4 rounded-full border border-white text-white font-semibold text-lg hover:bg-white hover:text-[#2B2BFF] transition">Try now</button>
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-6 items-center opacity-80 mb-8 relative z-10">
          {clientLogos.map((src, i) => (
            <Image key={i} src={src} alt="Client Logo" width={100} height={40} />
          ))}
        </div>
        <div className="absolute inset-0 w-full h-full z-0">
          {/* Placeholder for hero background asset/graphic */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[400px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent" />
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">How it works</h2>
          <div className="grid md:grid-cols-5 gap-8">
            {howItWorks.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center bg-white rounded-xl p-6 shadow-md">
                <Image src={step.icon} alt={step.title} width={48} height={48} className="mb-4" />
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Actually measurable benefits</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {benefits.map((b, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold text-[#2B2BFF] mb-2">{b.value}</div>
                <p className="text-gray-600">{b.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Accelerating engineering excellence at world class organizations</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-xl p-8 shadow-md flex flex-col items-center text-center">
                <p className="text-lg italic mb-4">"{t.quote}"</p>
                <div className="flex items-center gap-3 mt-4">
                  <Image src={t.logo} alt={t.name} width={40} height={40} className="rounded-full" />
                  <div className="text-left">
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-gray-500 text-sm">{t.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">FAQs</h2>
          <div className="space-y-8">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b pb-6">
                <h3 className="text-xl font-semibold mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog section (placeholder) */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">What's new in our blog</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-md flex flex-col">
              <div className="font-semibold mb-2">Get the First Scoop of What's New at Cortex</div>
              <p className="text-gray-600 text-sm mb-4">The summer heat is coming, and so is the hottest event of the season: our Summer Scoop launch party!</p>
              <Link href="/blog" className="text-[#2B2BFF] font-semibold mt-auto">Read more →</Link>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-md flex flex-col">
              <div className="font-semibold mb-2">Cortex Recognized by Gartner® as Representative Vendor in the 2025 Market Guide for Internal Developer Portals</div>
              <p className="text-gray-600 text-sm mb-4">We're excited to be recognized again in the 2025 release of the Gartner Market Guide for Internal Developer Portals.</p>
              <Link href="/blog" className="text-[#2B2BFF] font-semibold mt-auto">Read more →</Link>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-md flex flex-col">
              <div className="font-semibold mb-2">IDPCON 2025: The Future of Engineering Excellence Starts Here</div>
              <p className="text-gray-600 text-sm mb-4">IDPCON 2025 is happening on October 9, 2025, in New York City—and we're once again bringing together the brightest minds to explore the evolving landscape of engineering excellence, platform strategy, and DevEx best practices.</p>
              <Link href="/blog" className="text-[#2B2BFF] font-semibold mt-auto">Read more →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer enrichi */}
      <footer className="bg-[#18181B] text-white border-t border-white/10 py-16 mt-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-8">
          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-white/80">
              <li><Link href="#">What is Cortex?</Link></li>
              <li><Link href="#">Scorecard</Link></li>
              <li><Link href="#">Eng Intelligence</Link></li>
              <li><Link href="#">Catalog</Link></li>
              <li><Link href="#">Plugins</Link></li>
              <li><Link href="#">Scaffolder</Link></li>
              <li><Link href="#">Integrations</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Solutions</h4>
            <ul className="space-y-2 text-white/80">
              <li><Link href="#">Eng Excellence</Link></li>
              <li><Link href="#">Production Readiness</Link></li>
              <li><Link href="#">Incident Management</Link></li>
              <li><Link href="#">Self-Service</Link></li>
              <li><Link href="#">Developer Onboarding</Link></li>
              <li><Link href="#">Software Modernization</Link></li>
              <li><Link href="#">Backstage Migration Helper</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-white/80">
              <li><Link href="#">Docs</Link></li>
              <li><Link href="#">Resources & Events</Link></li>
              <li><Link href="#">Blog</Link></li>
              <li><Link href="#">Case Studies</Link></li>
              <li><Link href="#">Podcast</Link></li>
              <li><Link href="#">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-white/80">
              <li><Link href="#">About Us</Link></li>
              <li><Link href="#">Careers</Link></li>
              <li><Link href="#">We're hiring</Link></li>
              <li><Link href="#">Press</Link></li>
              <li><Link href="#">Privacy Policy</Link></li>
              <li><Link href="#">Security Policy</Link></li>
              <li><Link href="#">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-white/80">
              <li><Link href="#">Get in touch</Link></li>
              <li><Link href="#">Schedule a demo</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/60">
          © {new Date().getFullYear()} Cortex. All rights reserved.
        </div>
      </footer>
    </main>
  );
} 