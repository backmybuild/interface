import { Github, Twitter, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-black to-gray-900 text-white px-6 py-20 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <img
              src="./back.png"
              alt="Back Logo"
              className="h-12 w-auto invert"
            />
            <p className="text-gray-300 text-lg leading-relaxed max-w-sm">
              Confidential crypto donations for builders who are shaping the
              future.
            </p>
          </div>

          <div>
            <h4 className="mb-6 text-lg">Platform</h4>
            <div className="space-y-4 text-base">
              <a
                href="#"
                className="text-gray-300 hover:text-white block transition-colors"
              >
                Browse Builders
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white block transition-colors"
              >
                How It Works
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white block transition-colors"
              >
                Privacy Policy
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-6 text-lg">Community</h4>
            <div className="space-y-4 text-base">
              <a
                href="#"
                className="text-gray-300 hover:text-white block transition-colors"
              >
                Discord
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white block transition-colors"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white block transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-6 text-lg">Connect</h4>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
              >
                <Github className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
              >
                <MessageCircle className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-base">
              © 2025 Back. Built for the crypto community.
            </p>
            <p className="text-gray-400 text-base mt-4 md:mt-0">
              Ethereum • Est. 2025
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
