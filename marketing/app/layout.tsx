import "./globals.css";
import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

const Navigation = () => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-bg1/80 backdrop-blur-sm border-b border-border/10">
    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
      <Link href="/" className="flex items-center space-x-2">
        <Image src="/logo.svg" alt="Elicia AI" width={32} height={32} />
        <span className="text-w1 font-semibold">Elicia AI</span>
      </Link>
      
      <nav className="hidden md:flex items-center space-x-8">
        <Link href="/features" className="text-w2 hover:text-w1 transition-colors">Features</Link>
        <Link href="/pricing" className="text-w2 hover:text-w1 transition-colors">Pricing</Link>
        <Link href="/docs" className="text-w2 hover:text-w1 transition-colors">Docs</Link>
        <Link href="/blog" className="text-w2 hover:text-w1 transition-colors">Blog</Link>
      </nav>

      <div className="flex items-center space-x-4">
        <Link href="/login" className="text-w2 hover:text-w1 transition-colors">Sign in</Link>
        <Link href="/demo-request" className="px-4 py-2 bg-p1 hover:bg-p1/90 text-w1 rounded-full transition-colors">
          Book a demo
        </Link>
      </div>
    </div>
  </header>
);

const Footer = () => (
  <footer className="bg-bg1 border-t border-border/10 py-12">
    <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-8">
      <div>
        <h4 className="text-w1 font-semibold mb-4">Product</h4>
        <ul className="space-y-2">
          <li><Link href="/features" className="text-w2 hover:text-w1 transition-colors">Features</Link></li>
          <li><Link href="/pricing" className="text-w2 hover:text-w1 transition-colors">Pricing</Link></li>
          <li><Link href="/security" className="text-w2 hover:text-w1 transition-colors">Security</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-w1 font-semibold mb-4">Solutions</h4>
        <ul className="space-y-2">
          <li><Link href="/use-cases" className="text-w2 hover:text-w1 transition-colors">Use Cases</Link></li>
          <li><Link href="/docs" className="text-w2 hover:text-w1 transition-colors">Docs</Link></li>
          <li><Link href="/blog" className="text-w2 hover:text-w1 transition-colors">Blog</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-w1 font-semibold mb-4">Resources</h4>
        <ul className="space-y-2">
          <li><Link href="/help" className="text-w2 hover:text-w1 transition-colors">Help Center</Link></li>
          <li><Link href="/api" className="text-w2 hover:text-w1 transition-colors">API</Link></li>
          <li><Link href="/status" className="text-w2 hover:text-w1 transition-colors">Status</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-w1 font-semibold mb-4">Company</h4>
        <ul className="space-y-2">
          <li><Link href="/about" className="text-w2 hover:text-w1 transition-colors">About</Link></li>
          <li><Link href="/careers" className="text-w2 hover:text-w1 transition-colors">Careers</Link></li>
          <li><Link href="/contact" className="text-w2 hover:text-w1 transition-colors">Contact</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-w1 font-semibold mb-4">Legal</h4>
        <ul className="space-y-2">
          <li><Link href="/privacy" className="text-w2 hover:text-w1 transition-colors">Privacy</Link></li>
          <li><Link href="/terms" className="text-w2 hover:text-w1 transition-colors">Terms</Link></li>
          <li><Link href="/security" className="text-w2 hover:text-w1 transition-colors">Security</Link></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-border/10 mt-12 pt-8 text-center text-w2">
      © {new Date().getFullYear()} Elicia AI. All rights reserved.
    </div>
  </footer>
);

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="bg-bg1 text-w1">
      <body className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
} 