import "./globals.css";
import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from '../components/ui/Button';

const Navigation = () => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-bg1/80 backdrop-blur-sm border-b border-border/10">
    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
      <Link href="/" className="flex items-center space-x-2">
        <Image src="/logos-elicia/font-lota-grotesque-gras.png" alt="Elicia AI" width={120} height={32} />
        <span className="text-w1 font-semibold sr-only">Elicia AI</span>
      </Link>
      
      <nav className="hidden md:flex items-center space-x-8">
        <Link href="/features" className="text-w2 hover:text-w1 transition-colors">Features</Link>
        <Link href="/pricing" className="text-w2 hover:text-w1 transition-colors">Pricing</Link>
        <Link href="/docs" className="text-w2 hover:text-w1 transition-colors">Docs</Link>
        <Link href="/blog" className="text-w2 hover:text-w1 transition-colors">Blog</Link>
      </nav>

      <div className="flex items-center space-x-4">
        <Link href="/login" className="text-w2 hover:text-w1 transition-colors">Sign in</Link>
        <Link href="/demo-request" className="w-fit inline-flex gap-1 items-center justify-center whitespace-nowrap rounded-md caption-cta ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-p1 bg-p1/90 text-w1 hover:bg-p1/100 relative px-4 py-3 md:px-5 max-h-[39px] md:max-h-none">
          Book a live demo
          <Image alt="" width={16} height={16} className="ml-1" style={{ color: 'transparent' }} src="/icons/caret-right.svg" />
        </Link>
      </div>
    </div>
  </header>
);

const Footer = () => (
  <footer className="w-full px-4 py-8 flex border-t-[0.5px] border-[rgba(242,242,244,0.10)] bg-[rgba(22,21,25,0.15)] backdrop-blur-[6px] lg:min-h-[310px]" aria-labelledby="footer-heading">
    <div className="flex items-center py-4 lg:max-w-[1616px] lg:px-[40px] w-full relative mx-auto md:px-2">
      <div className="flex flex-col gap-10 lg:grid lg:grid-cols-4 lg:gap-6 w-full h-full">
        {/* Logo + réseaux sociaux mobile */}
        <div className="h-1/6 lg:h-full lg:col-span-1 lg:row-span-1">
          <div className="flex items-center justify-between lg:flex-col lg:items-start w-full h-auto lg:h-full">
            <a href="/">
              <img alt="Logo" draggable="false" loading="lazy" width={120} height={32} style={{color:'transparent'}} src="/logos-elicia/font-lota-grotesque-gras.png" />
            </a>
            <div className="flex gap-4 lg:hidden">
              <a className="flex items-center gap-2" target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/company/cortexapp/">
                <img alt="LinkedIn" width={16} height={16} src="/icons/linkedin.svg" />
              </a>
              <a className="flex items-center gap-2" target="_blank" rel="noopener noreferrer" href="https://twitter.com/GetCortexApp">
                <img alt="Twitter" width={16} height={16} src="/icons/twitter.svg" />
              </a>
            </div>
          </div>
        </div>
        {/* Liens principaux */}
        <div className="h-auto lg:h-auto lg:col-span-3 lg:row-span-2">
          <div className="grid grid-cols-2 gap-y-8 sm:flex sm:flex-wrap sm:gap-x-2 2xl:gap-8 w-full justify-end">
            {/* Products */}
            <div className="flex-1 lg:flex-initial md:w-auto">
              <div className="flex flex-col pr-2 sm:pr-0 gap-2 w-[160px] xl:w-[200px]">
                <h3 className="caption-strong text-w1">Products</h3>
                <div className="flex flex-col gap-3 pt-1">
                  <a className="flex items-center gap-1 relative w-fit" href="/products/what-is-cortex"><span className="caption-strong text-w3 hover:text-w1 transition-colors duration-200 md:min-h-[16px]">What is Cortex?</span></a>
                  <a className="flex items-center gap-1 relative w-fit" href="/products/scorecard"><span className="caption-strong text-w3 hover:text-w1 transition-colors duration-200 md:min-h-[16px]">Scorecard</span></a>
                  <a className="flex items-center gap-1 relative w-fit" href="/products/eng-intelligence"><span className="caption-strong text-w3 hover:text-w1 transition-colors duration-200 md:min-h-[16px]">Eng Intelligence</span></a>
                  <a className="flex items-center gap-1 relative w-fit" href="/products/catalog"><span className="caption-strong text-w3 hover:text-w1 transition-colors duration-200 md:min-h-[16px]">Catalog</span></a>
                  <a className="flex items-center gap-1 relative w-fit" href="/plugins"><span className="caption-strong text-w3 hover:text-w1 transition-colors duration-200 md:min-h-[16px]">Plugins</span></a>
                  <a className="flex items-center gap-1 relative w-fit" href="/products/scaffolder"><span className="caption-strong text-w3 hover:text-w1 transition-colors duration-200 md:min-h-[16px]">Scaffolder</span></a>
                  <a className="flex items-center gap-1 relative w-fit" href="/integrations"><span className="caption-strong text-w3 hover:text-w1 transition-colors duration-200 md:min-h-[16px]">Integrations</span></a>
                </div>
              </div>
            </div>
            {/* Solutions */}
            <div className="flex-1 lg:flex-initial md:w-auto">
              <div className="flex flex-col pr-2 sm:pr-0 gap-2 w-[160px] xl:w-[200px]">
                <h3 className="caption-strong text-w1">Solutions</h3>
                <div className="flex flex-col gap-3 pt-1">
                  <a className="flex items-center gap-1 relative w-fit" href="/solutions/eng-excellence"><span className="caption-strong text-w3 hover:text-w1 transition-colors duration-200 md:min-h-[16px]">Eng Excellence</span></a>
                  <a className="flex items-center gap-1 relative w-fit" href="/solutions/production-readiness"><span className="caption-strong text-w3 hover:text-w1 transition-colors duration-200 md:min-h-[16px]">Production Readiness</span></a>
                  <a className="flex items-center gap-1 relative w-fit" href="/solutions/incident-management"><span className="caption-strong text-w3 hover:text-w1 transition-colors duration-200 md:min-h-[16px]">Incident Management</span></a>
                  <a className="flex items-center gap-1 relative w-fit" href="/solutions/self-service"><span className="caption-strong text-w3 hover:text-w1 transition-colors duration-200 md:min-h-[16px]">Self-Service</span></a>
                  <a className="flex items-center gap-1 relative w-fit" href="/solutions/developer-productivity"><span className="caption-strong text-w3 hover:text-w1 transition-colors duration-200 md:min-h-[16px]">Developer Onboarding</span></a>
                  <a className="flex items-center gap-1 relative w-fit" href="/solutions/modernization"><span className="caption-strong text-w3 hover:text-w1 transition-colors duration-200 md:min-h-[16px]">Software Modernization</span></a>
                  <a className="flex items-center gap-1 relative w-fit" href="/solutions/backstage-migration-helper"><span className="caption-strong text-w3 hover:text-w1 transition-colors duration-200 md:min-h-[16px]">Backstage Migration Helper</span></a>
                </div>
              </div>
            </div>
            {/* Resources */}
            <div className="flex-1 lg:flex-initial md:w-auto">
              <div className="flex flex-col pr-2 sm:pr-0 gap-2 w-[160px] xl:w-[200px]">
                <h3 className="caption-strong text-w1">Resources</h3>
                <div className="flex flex-col gap-3 pt-1">
                  <a className="flex items-center gap-1 relative w-fit" href="https://docs.cortex.io/"><span className="caption-strong text-w3 hover:text-w1 transition-colors duration-200 md:min-h-[16px]">Docs</span></a>
                  <a className="flex items-center gap-1 relative w-fit" href="/resources"><span className="caption-strong text-w3 hover:text-w1 transition-colors duration-200 md:min-h-[16px]">Resources & Events</span></a>
                  <a className="flex items-center gap-1 relative w-fit" href="/blog"><span className="caption-strong text-w3 hover:text-w1 transition-colors duration-200 md:min-h-[16px]">Blog</span></a>
                  <a className="flex items-center gap-1 relative w-fit" href="/case-studies"><span className="caption-strong text-w3 hover:text-w1 transition-colors duration-200 md:min-h-[16px]">Case Studies</span></a>
                  <a className="flex items-center gap-1 relative w-fit" href="/podcast"><span className="caption-strong text-w3 hover:text-w1 transition-colors duration-200 md:min-h-[16px]">Podcast</span></a>
                  <a className="flex items-center gap-1 relative w-fit" href="/pricing"><span className="caption-strong text-w3 hover:text-w1 transition-colors duration-200 md:min-h-[16px]">Pricing</span></a>
                </div>
              </div>
            </div>
            {/* Company */}
            <div className="flex-1 lg:flex-initial md:w-auto">
              <div className="flex flex-col pr-2 sm:pr-0 gap-2 w-[160px] xl:w-[200px]">
                <h3 className="caption-strong text-w1">Company</h3>
                <div className="flex flex-col gap-3 pt-1">
                  <a className="flex items-center gap-1 relative w-fit" href="/about-us"><span className="caption-strong text-w3 hover:text-w1 transition-colors duration-200 md:min-h-[16px]">About Us</span></a>
                  <a className="flex items-center gap-1 relative w-fit" href="/careers"><span className="caption-strong text-w3 hover:text-w1 transition-colors duration-200 md:min-h-[16px]">Careers</span><div className="w-fit inline-flex items-center justify-center whitespace-nowrap rounded-full text-xs !leading-none ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-bg-p text-p4 px-[6px] py-[4px] absolute left-[calc(100%+4px)]">We're hiring</div></a>
                  <a className="flex items-center gap-1 relative w-fit" href="/press"><span className="caption-strong text-w3 hover:text-w1 transition-colors duration-200 md:min-h-[16px]">Press</span></a>
                  <a className="flex items-center gap-1 relative w-fit" href="/legal/privacy-policy"><span className="caption-strong text-w3 hover:text-w1 transition-colors duration-200 md:min-h-[16px]">Privacy Policy</span></a>
                  <a className="flex items-center gap-1 relative w-fit" href="/legal/security-policy"><span className="caption-strong text-w3 hover:text-w1 transition-colors duration-200 md:min-h-[16px]">Security Policy</span></a>
                  <a className="flex items-center gap-1 relative w-fit" href="/legal/terms-of-service"><span className="caption-strong text-w3 hover:text-w1 transition-colors duration-200 md:min-h-[16px]">Terms of Service</span></a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Réseaux sociaux desktop + badges + copyright */}
        <div className="h-1/6 lg:h-auto lg:col-span-1 lg:row-span-1">
          <div className="flex w-full h-auto lg:h-full lg:flex-col gap-4 lg:justify-end">
            <div className="flex flex-wrap flex-col sm:flex-row sm:items-center lg:flex-col lg:items-start gap-4">
              <div className="hidden gap-4 lg:flex">
                <a className="flex items-center gap-2" target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/company/cortexapp/">
                  <img alt="LinkedIn" width={16} height={16} src="/icons/linkedin.svg" />
                </a>
                <a className="flex items-center gap-2" target="_blank" rel="noopener noreferrer" href="https://twitter.com/GetCortexApp">
                  <img alt="Twitter" width={16} height={16} src="/icons/twitter.svg" />
                </a>
              </div>
              <div className="flex flex-col md:flex-row lg:flex-col gap-4 lg:gap-2">
                <div className="caption text-w1 flex items-center gap-1">A
                  <img alt="YC" width={17} height={17} src="/icons/yc.svg" />
                  Combinator Company
                </div>
                <div className="caption text-w1 flex items-center gap-2">
                  <img alt="SOC Type 2 Certified" width={22} height={22} src="/icons/soc2.svg" />
                  SOC Type 2 Certified
                </div>
                <div className="caption text-w1 flex items-center gap-2">
                  <img alt="ISO/IEC 27001:2022 Certified" width={22} height={22} src="/icons/iso27001.svg" />
                  ISO/IEC 27001:2022 Certified
                </div>
              </div>
              <div className="caption text-w3">© {new Date().getFullYear()} Elicia AI. All rights reserved.</div>
            </div>
        </div>
        </div>
      </div>
    </div>
  </footer>
);

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="bg-bg1 text-w1">
      <body className="min-h-screen flex flex-col overflow-x-hidden">
        <Navigation />
        <main className="flex-1 overflow-x-hidden">{children}</main>
        <Footer />
      </body>
    </html>
  );
} 