import { Button } from "./ui/button";
import { ImageWithFallback } from "./ui/image-with-fallback";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-primary/5 to-secondary/10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1568092461669-88ea238c24eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9maWxlJTIwYnVpbGRlciUyMGNyZWF0b3J8ZW58MXx8fHwxNzU4Nzk0OTc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Profile builder and creator workspace"
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
          <div>
            <h2 className="mb-6">Ready to Start Receiving Support?</h2>
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              Join thousands of builders who are already using Back to receive crypto donations 
              from their community. Set up your profile in seconds and start accepting support today.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                  <span>1</span>
                </div>
                <p>Share your Back page</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                  <span>2</span>
                </div>
                <p>Your profile is created automatically from on-chain data</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                  <span>3</span>
                </div>
                <p>Start receiving crypto donations instantly</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="flex items-center gap-2">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              No wallet connection required. Completely free to use.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}