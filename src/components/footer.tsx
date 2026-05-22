import Link from "next/link";
import { Bot, Mail, Globe, Link as LinkIcon } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-accent-blue" />
              <span className="font-bold text-xl tracking-tight">
                CareerPilot <span className="text-accent-blue">AI</span>
              </span>
            </Link>
            <p className="text-foreground/60 text-sm">
              Your AI-powered placement and career growth companion. Master interviews, track skills, and land your dream job.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-foreground/60 hover:text-accent-blue transition-colors">
                <Globe className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-foreground/60 hover:text-accent-blue transition-colors">
                <Mail className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-foreground/60 hover:text-accent-blue transition-colors">
                <LinkIcon className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-foreground/60 hover:text-accent-blue transition-colors">Features</Link></li>
              <li><Link href="#" className="text-sm text-foreground/60 hover:text-accent-blue transition-colors">Pricing</Link></li>
              <li><Link href="#" className="text-sm text-foreground/60 hover:text-accent-blue transition-colors">Mock Interviews</Link></li>
              <li><Link href="#" className="text-sm text-foreground/60 hover:text-accent-blue transition-colors">Resume Analyzer</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-foreground/60 hover:text-accent-blue transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-sm text-foreground/60 hover:text-accent-blue transition-colors">Career Roadmaps</Link></li>
              <li><Link href="#" className="text-sm text-foreground/60 hover:text-accent-blue transition-colors">Help Center</Link></li>
              <li><Link href="#" className="text-sm text-foreground/60 hover:text-accent-blue transition-colors">Community</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-foreground/60 hover:text-accent-blue transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm text-foreground/60 hover:text-accent-blue transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm text-foreground/60 hover:text-accent-blue transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-foreground/60">
            © {new Date().getFullYear()} CareerPilot AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
