import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <main className="py-[var(--navbar-height)] pb-0 md:pb-[var(--navbar-height)] flex flex-col justify-center w-full items-center overflow-clip relative">
      {/* Hero Section */}
      <section className="container-dark lg:pt-14 lg:pb-28 opacity-100">
        {/* Background Animation */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full w-full max-w-screen opacity-0" style={{ transform: 'translate(0px, 0px)', opacity: 1, visibility: 'inherit' }}>
          <div className="relative w-full h-fit flex justify-center items-center transform origin-center rotate-90 translate-y-[120px] scale-[1.7] sm:translate-y-[56px] sm:scale-[1.4] md:translate-x-[55%] md:translate-y-[-160px] lg:scale-[0.8] lg:translate-y-[-20px]">
            <div style={{ maskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 45%)', maskSize: '100% 100%', maskPosition: 'center' }} className="scale-100 lg:scale-[1.8] absolute w-full min-h-full top-0 left-0 -translate-y-1/2">
              {/* SVG Animation */}
              <div className="flex items-center justify-center w-full h-screen relative scale-[0.7]">
                {/* Add SVG animation here */}
              </div>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="container-fluid flex flex-col gap-10 lg:gap-12 items-center justify-center max-w-screen-xl">
          <div className="flex flex-col gap-6 items-center text-center max-w-3xl opacity-0" style={{ opacity: 1, visibility: 'inherit' }}>
            <h1 className="display text-w1 !text-balance">
              <span className="text-shadow-heading">Your </span>
              <span className="text-p2 text-shadow-highlight">AI Assistant</span>
              <span className="text-shadow-heading"> for Lead Conversion</span>
            </h1>
            <p className="body text-w2 !text-balance">
              Elicia AI is the enterprise-grade AI assistant built to accelerate your lead conversion process. Engage, qualify, and convert leads into revenue with intelligent automation that works 24/7.
            </p>
            <div className="flex gap-2 opacity-0" style={{ transform: 'translate(0px, 0px)', opacity: 1, visibility: 'inherit' }}>
              <div className="relative group/main">
                <div className="absolute w-[calc(100%+0.75rem)] h-[calc(100%+0.75rem)] rounded-[12px] !z-[-9] top-[-0.375rem] left-[-0.375rem] overflow-hidden transition-opacity duration-300 ease-in-out group-hover/main:opacity-100 opacity-0">
                  <div className="relative w-full h-full p-px overflow-hidden flex justify-start items-start z-[-10] opacity-0">
                    <div className="absolute bg-main-button-glow size-[120px]"></div>
                  </div>
                </div>
                <Link href="/demo-request" className="w-fit inline-flex gap-1 items-center justify-center whitespace-nowrap rounded-md caption-cta ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-p1 bg-p1/90 text-w1 hover:bg-p1/100 relative px-4 py-3 md:px-5 max-h-[39px] md:max-h-none">
                  Book a live demo
                  <Image 
                    src="/icons/caret-right.svg" 
                    alt="" 
                    width={16} 
                    height={16} 
                    className="ml-1"
                  />
                </Link>
              </div>
              <div className="relative group/main">
                <Link href="/try-now" className="w-fit inline-flex gap-1 items-center justify-center whitespace-nowrap rounded-md caption-cta ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-batch-bg bg-bg4/30 text-w1 hover:bg-bg4/35 px-4 py-3 md:px-5 max-h-[39px] md:max-h-none">
                  Try now
                </Link>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="w-full opacity-0 max-w-[1024px]" style={{ transform: 'translate(0px, 0px)', opacity: 1, visibility: 'inherit' }}>
            <div className="w-full h-full p-2 relative z-20">
              <div className="absolute w-[2px] h-[2px] top-0 left-0 translate-x-[-1px] translate-y-[-1px] bg-w1"></div>
              <div className="absolute w-[2px] h-[2px] top-0 left-1/2 -translate-x-1/2 translate-y-[-1px] bg-w1"></div>
              <div className="absolute w-[2px] h-[2px] top-0 right-0 translate-x-[1px] translate-y-[-1px] bg-w1"></div>
              <div className="absolute w-[2px] h-[2px] top-1/2 right-0 translate-x-[1px] -translate-y-1/2 bg-w1"></div>
              <div className="absolute w-[2px] h-[2px] bottom-0 right-0 translate-x-[1px] translate-y-[1px] bg-w1"></div>
              <div className="absolute w-[2px] h-[2px] bottom-0 left-1/2 -translate-x-1/2 translate-y-[1px] bg-w1"></div>
              <div className="absolute w-[2px] h-[2px] bottom-0 left-0 translate-x-[-1px] translate-y-[1px] bg-w1"></div>
              <div className="absolute w-[2px] h-[2px] top-1/2 left-0 translate-x-[-1px] -translate-y-1/2 bg-w1"></div>
              <Image
                src="/images/hero.svg"
                alt="Elicia AI Interface"
                width={1400}
                height={800}
                priority
                className="w-full h-full object-cover z-0 border border-batch-bg rounded-md"
                quality={90}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Logo Carousel */}
      <div className="overflow-hidden py-2 border-border/15 border-y mt-6 lg:mt-0 min-h-[58px] lg:min-h-[68px]">
        <div className="!flex will-change-transform !w-fit min-w-max" style={{ transform: 'translate3d(-24.7%, 0px, 0px)' }}>
          <div className="flex flex-shrink-0 gap-x-2 pr-2 lg:gap-x-4 lg:pr-4">
            {/* Add your client logos here */}
            {[
              { src: '/logos/logo1.svg', alt: 'Enterprise Logo' },
              { src: '/logos/logo2.svg', alt: 'Global Co Logo' },
              { src: '/logos/logo3.svg', alt: 'TechCorp Logo' },
              { src: '/logos/logo4.svg', alt: 'Innovate Logo' }
            ].map((logo, i) => (
              <Image
                key={i}
                src={logo.src}
                alt={logo.alt}
                width={150}
                height={50}
                className="w-[112px] h-[40px] object-contain lg:w-[150px] lg:h-[50px]"
              />
            ))}
          </div>
        </div>
      </div>

      {/* How it works Section */}
      <section className="container-light opacity-100">
        <div dir="ltr" data-orientation="horizontal" className="!container-fluid flex items-center flex-col">
          <div className="flex flex-col gap-10 md:gap-12 text-center text-balance justify-center items-center">
            <h2 className="large-title mb-2">How it works</h2>
            <div className="relative w-screen">
              {/* Add tabs and content here */}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 bg-dark">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Measurable benefits</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">2x</div>
              <p className="text-light/70">Conversion rate</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">67%</div>
              <p className="text-light/70">Faster response</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <p className="text-light/70">Availability</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">90%</div>
              <p className="text-light/70">Cost reduction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-dark-light">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Enterprise-grade features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Multi-channel Support",
                description: "Engage with customers through chat, email, and voice calls seamlessly."
              },
              {
                title: "Smart Qualification",
                description: "Automatically qualify leads based on your custom criteria and business rules."
              },
              {
                title: "Real-time Analytics",
                description: "Track performance metrics and conversion rates in real-time."
              },
              {
                title: "Custom Integration",
                description: "Integrate with your existing CRM and sales tools effortlessly."
              },
              {
                title: "Advanced Security",
                description: "Enterprise-grade security with data encryption and compliance."
              },
              {
                title: "24/7 Availability",
                description: "Never miss a lead with round-the-clock automated engagement."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-dark rounded-xl p-8">
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-light/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-dark">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to transform your lead conversion?</h2>
          <p className="text-xl text-light/80 mb-12">
            Join leading companies using Elicia AI to automate and optimize their lead conversion process.
          </p>
          <Link href="/demo-request">
            <button className="px-8 py-4 rounded-full bg-primary hover:bg-primary-dark text-white font-semibold text-lg transition duration-200">
              Get started today
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-light py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-light/70">
                <li><a href="#" className="hover:text-primary transition">Features</a></li>
                <li><a href="#" className="hover:text-primary transition">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-light/70">
                <li><a href="#" className="hover:text-primary transition">About</a></li>
                <li><a href="#" className="hover:text-primary transition">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-light/70">
                <li><a href="#" className="hover:text-primary transition">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition">Documentation</a></li>
                <li><a href="#" className="hover:text-primary transition">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-light/70">
                <li><a href="#" className="hover:text-primary transition">Privacy</a></li>
                <li><a href="#" className="hover:text-primary transition">Terms</a></li>
                <li><a href="#" className="hover:text-primary transition">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-light/10 mt-12 pt-8 text-center text-light/60">
            © {new Date().getFullYear()} Elicia AI. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
} 