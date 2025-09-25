import { ImageWithFallback } from "./ui/image-with-fallback";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Zap, Shield, Coins, Users, Globe, Heart } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Zero Setup Required",
      description:
        "Create your donation page instantly. No complex configuration, no waiting periods. Just connect your wallet and start receiving support.",
      badge: "Instant",
    },
    {
      icon: <Coins className="w-6 h-6" />,
      title: "Multi-Chain Support",
      description:
        "Accept donations in any token on any blockchain. Your supporters can donate with whatever crypto they prefer.",
      badge: "Flexible",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "100% Fee-Free",
      description:
        "Keep every dollar donated to you. No platform fees, no hidden charges. You receive 100% of donations as USDC on Base.",
      badge: "Free Forever",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Universal Access",
      description:
        "Share your donation page via ENS names, Base names, wallet addresses, or social handles. Easy for supporters to find and remember.",
      badge: "Accessible",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Built for Builders",
      description:
        "Designed specifically for creators, developers, and builders who want to receive community support without barriers.",
      badge: "Community First",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Seamless Experience",
      description:
        "Donors enjoy a smooth experience while you receive instant notifications and automatic USDC conversion on Base network.",
      badge: "User Friendly",
    },
  ];

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="mb-4">Why Choose Back?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We&apos;ve built the simplest way for creators to receive crypto
            donations. No technical knowledge required, no fees, and full
            control over your funds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-0 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg">{feature.title}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {feature.badge}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="mb-6">Crypto Donations Made Simple</h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 mt-1">
                  <span className="text-sm">✓</span>
                </div>
                <div>
                  <h4 className="mb-1">Cross-Chain Compatibility</h4>
                  <p className="text-sm text-muted-foreground">
                    Support for Ethereum, Base, Polygon, Arbitrum, and more
                    chains coming soon.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 mt-1">
                  <span className="text-sm">✓</span>
                </div>
                <div>
                  <h4 className="mb-1">Automatic Conversion</h4>
                  <p className="text-sm text-muted-foreground">
                    All donations are automatically converted to USDC on Base
                    for stability and easy withdrawal.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 mt-1">
                  <span className="text-sm">✓</span>
                </div>
                <div>
                  <h4 className="mb-1">Identity Integration</h4>
                  <p className="text-sm text-muted-foreground">
                    Connect with ENS, Base names, and Farcaster for easy
                    discovery and branding.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1731536782762-076739de99b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcnlwdG9jdXJyZW5jeSUyMGJsb2NrY2hhaW4lMjBkb25hdGlvbnxlbnwxfHx8fDE3NTg3OTQ5NzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Cryptocurrency and blockchain technology"
              className="w-full h-80 object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
