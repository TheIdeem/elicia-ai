import Link from 'next/link';
import Image from 'next/image';

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
  {
    title: 'Build',
    icon: '/icons/act.svg',
    description: 'Build with confidence. Enforce best practices and accelerate delivery with self-service tools.',
    image: '/images/act-tab.svg',
  },
  {
    title: 'Measure',
    icon: '/icons/assess.svg',
    description: 'Measure impact. Track productivity, reliability, and business outcomes in real time.',
    image: '/images/assess-tab.svg',
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
    logo: '/logos/logo4.svg',
  },
  {
    quote: "The visibility and automation Elicia AI provides is a game changer for our platform teams.",
    name: 'John Smith',
    title: 'Head of Platform, TechCorp',
    logo: '/logos/logo3.svg',
  },
];

export default function LandingPage() {
  return (
    <main className="bg-bg1 text-w1">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-p1 to-p2 py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-w1">Your Portal to Engineering Excellence</h1>
          <p className="text-xl mb-8 text-w2">
            Elicia AI is the enterprise-grade AI assistant built to accelerate your path to engineering excellence. Abstract away complexity, ensure ownership, enforce standards, and unlock developer self-service.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4 mb-10">
            <Link href="/demo-request">
              <button className="px-8 py-4 rounded-full bg-p1 hover:bg-p2 text-white font-semibold text-lg transition duration-200">Book a live demo</button>
            </Link>
            <Link href="/try-now">
              <button className="px-8 py-4 rounded-full border border-w1 text-w1 font-semibold text-lg hover:bg-w1 hover:text-p1 transition duration-200">Try now</button>
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-8 items-center opacity-80 mb-8">
          {logos.map((logo, i) => (
            <Image key={i} src={logo.src} alt={logo.alt} width={120} height={40} />
          ))}
        </div>
        <div className="flex justify-center">
          <Image src="/images/hero.svg" alt="Elicia AI Interface" width={800} height={400} className="rounded-2xl shadow-xl border border-batch-bg" />
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-bg2">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">How it works</h2>
          <div className="grid md:grid-cols-5 gap-8">
            {howItWorks.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center bg-bg3 rounded-xl p-6 shadow-md">
                <Image src={step.icon} alt={step.title} width={40} height={40} className="mb-4" />
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-w2 mb-4 text-sm">{step.description}</p>
                <Image src={step.image} alt={step.title + ' illustration'} width={120} height={80} className="rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-bg1">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Measurable benefits</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {benefits.map((b, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold text-p1 mb-2">{b.value}</div>
                <p className="text-w2">{b.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 bg-bg2">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Use cases</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((uc, i) => (
              <div key={i} className="bg-bg3 rounded-xl p-8 shadow-md">
                <h3 className="text-xl font-semibold mb-2">{uc.title}</h3>
                <p className="text-w2 text-sm">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-bg1">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">What our customers say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-bg2 rounded-xl p-8 shadow-md flex flex-col items-center text-center">
                <p className="text-lg italic mb-4">“{t.quote}”</p>
                <div className="flex items-center gap-3 mt-4">
                  <Image src={t.logo} alt={t.name} width={40} height={40} className="rounded-full" />
                  <div className="text-left">
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-w2 text-sm">{t.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer enrichi */}
      <footer className="bg-bg2 border-t border-border/10 py-16 mt-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-8">
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-w2">
              <li><Link href="/features">Features</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="/security">Security</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Solutions</h4>
            <ul className="space-y-2 text-w2">
              <li><Link href="/use-cases">Use Cases</Link></li>
              <li><Link href="/docs">Docs</Link></li>
              <li><Link href="/blog">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-w2">
              <li><Link href="/help">Help Center</Link></li>
              <li><Link href="/api">API</Link></li>
              <li><Link href="/status">Status</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-w2">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/careers">Careers</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-w2">
              <li><Link href="/privacy">Privacy</Link></li>
              <li><Link href="/terms">Terms</Link></li>
              <li><Link href="/security">Security</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/10 mt-12 pt-8 text-center text-w2">
          © {new Date().getFullYear()} Elicia AI. All rights reserved.
        </div>
      </footer>
    </main>
  );
} 