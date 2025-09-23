import { Button } from "./ui/button";
import { ArrowRight, Shield, Heart } from "lucide-react";
import { NavBar } from "./nav";

export function Hero() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-white via-gray-50/30 to-white relative flex flex-col overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-black/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-900/5 rounded-full blur-3xl"></div>

      <NavBar />

      <div className="flex-1 flex items-center px-6 max-w-7xl mx-auto w-full relative z-10 mt-32 md:mt-0">
        <div className="grid md:grid-cols-2 gap-16 items-center w-full">
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center bg-black/5 backdrop-blur-sm rounded-full px-4 py-2 border border-black/10">
                <span className="text-sm text-gray-700">
                  ✨ Privacy-first crypto donations
                </span>
              </div>
              <h1 className="text-6xl md:text-7xl leading-[0.9] tracking-tight">
                Get backed.
                <br />
                <span className="text-gray-500">Confidentially.</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Create your builder profile and receive crypto donations with
                complete privacy. Build your projects while the community backs
                your vision.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-black text-white hover:bg-gray-800 px-8 py-4 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                Create Your Page <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 px-8 py-4 rounded-2xl text-lg backdrop-blur-sm"
              >
                Learn More
              </Button>
            </div>

            <div className="flex items-center space-x-10 pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-black/5 rounded-full">
                  <Shield className="h-5 w-5 text-gray-700" />
                </div>
                <span className="text-sm text-gray-600">100% Confidential</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-black/5 rounded-full">
                  <Heart className="h-5 w-5 text-gray-700" />
                </div>
                <span className="text-sm text-gray-600">Community Backed</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent rounded-3xl blur-2xl"></div>
            <img
              src="https://images.unsplash.com/photo-1637073849667-91120a924221?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhkZXZlbG9wZXJzJTIwY29kaW5nJTIwdG9nZXRoZXJ8ZW58MXx8fHwxNTU4NTk2NDgzfDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Developers working together"
              className="rounded-3xl shadow-2xl relative z-10 border border-white/20"
            />
            <div className="absolute -bottom-8 -right-8 bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/30 z-20">
              <div className="text-center">
                <div className="text-3xl mb-2">🚀</div>
                <div className="text-lg text-gray-900 mb-1">2,847</div>
                <div className="text-sm text-gray-600">builders supported</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
