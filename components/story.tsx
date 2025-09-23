export function OurStory() {
  return (
    <section
      id="story"
      className="px-6 py-24 bg-gradient-to-b from-white to-gray-50/50 relative overflow-hidden"
    >
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-gray-900/3 rounded-full blur-3xl"></div>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-gray-100 rounded-full px-4 py-2 mb-8">
            <span className="text-sm text-gray-600">📖 Our Story</span>
          </div>
          <h2 className="text-5xl mb-8 tracking-tight">Why we built this</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Born from the belief that great builders deserve direct community
            support, without compromising their privacy or independence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-8">
            <h3 className="text-3xl tracking-tight">The Problem We Saw</h3>
            <div className="space-y-6">
              <p className="text-lg text-gray-600 leading-relaxed">
                Amazing crypto builders were struggling to get the support they
                needed. Traditional funding was slow, invasive, and often came
                with strings attached. Builders needed a simple way to showcase
                their work and receive direct community support.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We realized the crypto space needed something different – a
                platform where builders could create their own pages and receive
                confidential donations while maintaining complete freedom and
                privacy.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200/30 to-transparent rounded-2xl blur-xl"></div>
            <img
              src="https://images.unsplash.com/photo-1740477959012-62fd552ba999?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcnlwdG8lMjBjb21tdW5pdHklMjBidWlsZGVyc3xlbnwxfHx8fDE3NTg1OTY0ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Crypto community builders"
              className="rounded-2xl shadow-xl relative z-10 border border-white/50"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200/30 to-transparent rounded-2xl blur-xl"></div>
            <img
              src="https://images.unsplash.com/photo-1461532257246-777de18cd58b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW9wbGUlMjBoYW5kc2hha2UlMjBjb21tdW5pdHl8ZW58MXx8fHwxNzU4NTk2NDg5fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Community handshake"
              className="rounded-2xl shadow-xl relative z-10 border border-white/50"
            />
          </div>
          <div className="order-1 md:order-2 space-y-8">
            <h3 className="text-3xl tracking-tight">Our Solution</h3>
            <div className="space-y-6">
              <p className="text-lg text-gray-600 leading-relaxed">
                Back was built by builders, for builders. We created a platform
                where you can create your own page, showcase your work, and
                receive confidential donations from the community who believes
                in your vision.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                No KYC. No tracking. No corporate interference. Just pure,
                community-driven support that lets you focus on what you do best
                – building.
              </p>
            </div>
            <div className="pt-2">
              <div className="bg-gradient-to-br from-black to-gray-800 text-white p-8 rounded-2xl shadow-lg">
                <p className="text-base leading-relaxed mb-4">
                  "We believe the future of crypto is built by passionate
                  individuals who deserve direct community backing. Back makes
                  that possible, one confidential donation at a time."
                </p>
                <div className="text-sm opacity-80">— The Back Team</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
