import { Shield, Search, Zap } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: <Search className="h-8 w-8" />,
      title: "Create Your Page",
      description:
        "Set up your builder profile, showcase your projects, and tell your story to the crypto community.",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Receive Confidentially",
      description:
        "Get donations through stealth addresses with complete privacy. No personal information required, no tracking.",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Keep Building",
      description:
        "Community support goes directly to you, enabling you to focus on your important work and innovations.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="px-6 py-24 bg-gradient-to-b from-gray-50/50 to-white relative overflow-hidden"
    >
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-black/3 rounded-full blur-3xl"></div>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-gray-100 rounded-full px-4 py-2 mb-8">
            <span className="text-sm text-gray-600">⚡ How It Works</span>
          </div>
          <h2 className="text-5xl mb-8 tracking-tight">
            Simple. Private. Effective.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Getting community support as a crypto builder has never been easier
            or more private. Here&apos;s how Back makes it happen.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center space-y-6 group">
              <div className="w-20 h-20 bg-gradient-to-br from-black to-gray-700 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                {step.icon}
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl tracking-tight">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-gradient-to-br from-gray-50 to-white rounded-3xl p-10 md:p-16 border border-gray-100 shadow-lg">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl tracking-tight">Built for Privacy</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Every aspect of Back is designed with privacy in mind. We use
                stealth address technology to ensure complete confidentiality
                for both supporters and builders.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-black rounded-full"></div>
                  <span className="text-base text-gray-600">
                    Stealth address technology
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-black rounded-full"></div>
                  <span className="text-base text-gray-600">
                    No personal data collection
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-black rounded-full"></div>
                  <span className="text-base text-gray-600">
                    Confidential transactions
                  </span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-8xl mb-6">🛡️</div>
              <p className="text-base text-gray-600">
                Your privacy is our priority
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
