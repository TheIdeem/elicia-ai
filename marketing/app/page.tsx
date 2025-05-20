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
      <section className="relative flex flex-col items-center justify-center min-h-[80vh] py-24 bg-gradient-to-br from-p1 to-p2 text-center overflow-hidden">
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none">
          <Image src="/images/hero.svg" alt="Elicia AI Interface" width={900} height={500} className="opacity-90 drop-shadow-2xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="display font-bold mb-6 text-w1 text-shadow-heading">Your Portal to Engineering Excellence</h1>
          <p className="text-xl mb-8 text-w2 text-balance">Elicia AI is the enterprise-grade AI assistant built to accelerate your path to engineering excellence. Abstract away complexity, ensure ownership, enforce standards, and unlock developer self-service.</p>
          <div className="flex flex-col md:flex-row justify-center gap-4 mb-10">
            <Link href="/demo-request">
              <button className="px-8 py-4 rounded-full bg-p1 hover:bg-p2 text-white font-semibold text-lg transition duration-200 shadow-lg">Book a live demo</button>
            </Link>
            <Link href="/try-now">
              <button className="px-8 py-4 rounded-full border border-w1 text-w1 font-semibold text-lg hover:bg-w1 hover:text-p1 transition duration-200">Try now</button>
            </Link>
          </div>
        </div>
        <div className="relative z-10 w-full max-w-4xl mx-auto mt-8">
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-80">
            {logos.map((logo, i) => (
              <Image key={i} src={logo.src} alt={logo.alt} width={120} height={40} className="object-contain" />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-bg2">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="large-title text-center mb-16">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center bg-bg3 rounded-xl p-8 shadow-md hover:scale-105 transition-transform">
                <Image src={step.icon} alt={step.title} width={40} height={40} className="mb-4" />
                <h3 className="title-2 mb-2">{step.title}</h3>
                <p className="text-w2 mb-4 text-sm">{step.description}</p>
                <Image src={step.image} alt={step.title + ' illustration'} width={220} height={120} className="rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-bg1">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="large-title text-center mb-16">Measurable benefits</h2>
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
          <h2 className="large-title text-center mb-16">Use cases</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((uc, i) => (
              <div key={i} className="bg-bg3 rounded-xl p-8 shadow-md hover:scale-105 transition-transform">
                <h3 className="title-2 mb-2">{uc.title}</h3>
                <p className="text-w2 text-sm">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-bg1">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="large-title text-center mb-16">What our customers say</h2>
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
    </main>
  );
} 