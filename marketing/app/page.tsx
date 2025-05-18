import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] via-[#e8eaf6] to-[#f3e7e9] flex flex-col font-sans">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-8 py-6 bg-transparent">
        <div className="text-2xl font-bold text-gray-900 tracking-tight">Elicia AI</div>
        <nav className="space-x-6 text-gray-700 font-medium">
          <a href="#features" className="hover:text-blue-600 transition">Features</a>
          <a href="#how-it-works" className="hover:text-blue-600 transition">How it works</a>
          <a href="#contact" className="hover:text-blue-600 transition">Contact</a>
        </nav>
        <Link href="/demo-request">
          <button className="ml-6 px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg hover:scale-105 transition">Request a demo</button>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
          Inbound conversion will <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">never be the same again.</span>
        </h1>
        <p className="text-lg md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto">
          Unleash enterprise-grade AI agents to instantly engage, qualify, and convert inbound leads into pipeline & revenue.
        </p>
        <Link href="/demo-request">
          <button className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-lg shadow-lg hover:scale-105 transition">Request a demo</button>
        </Link>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How Elicia AI converts more inbound leads</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <div className="w-12 h-12 mb-4 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">1</div>
              <h3 className="font-semibold text-lg mb-2">Engage instantly</h3>
              <p className="text-gray-600">AI engages website leads in real-time to turn visitors into sales conversations.</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <div className="w-12 h-12 mb-4 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">2</div>
              <h3 className="font-semibold text-lg mb-2">Pre-qualify leads</h3>
              <p className="text-gray-600">AI prequalifies leads in real-time to get the best qualified leads to your team faster.</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <div className="w-12 h-12 mb-4 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">3</div>
              <h3 className="font-semibold text-lg mb-2">Drive outcomes</h3>
              <p className="text-gray-600">AI drives more qualified buyers to your highest impact outcomes, like scheduled calls or demos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="py-16 bg-gradient-to-br from-[#f3e7e9] to-[#e8eaf6]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Multi-channel AI conversion</h2>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            <div className="flex-1 bg-white rounded-xl shadow p-6">
              <h3 className="font-semibold text-lg mb-2">AI Chat</h3>
              <p className="text-gray-600">Engage buyers in real-time conversations through chat interfaces.</p>
            </div>
            <div className="flex-1 bg-white rounded-xl shadow p-6">
              <h3 className="font-semibold text-lg mb-2">AI Email</h3>
              <p className="text-gray-600">Automate email communication with smart scheduling and follow-ups.</p>
            </div>
            <div className="flex-1 bg-white rounded-xl shadow p-6">
              <h3 className="font-semibold text-lg mb-2">AI Phone Calls</h3>
              <p className="text-gray-600">Voice-to-voice AI for inbound customer conversations with a personal touch.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-gray-500 text-sm mt-auto">
        © {new Date().getFullYear()} Elicia AI. All rights reserved.
      </footer>
    </div>
  );
} 