import Link from "next/link";
import { Bot, Mail, Globe, Link as LinkIcon } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-10 bg-background/50 backdrop-blur-3xl border-t border-white/5 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-accent-blue/10 p-2 rounded-lg group-hover:bg-accent-blue/20 transition-colors">
                <Bot className="w-6 h-6 text-accent-blue" />
              </div>
              <span className="font-bold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
                HireReady
              </span>
            </Link>
            <p className="text-foreground/60 text-sm font-medium leading-relaxed">
              Your AI-powered placement and career growth companion. Master interviews, track skills, and land your dream job.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-foreground/60 hover:text-accent-blue hover:bg-accent-blue/10 transition-all">
                <Globe className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-foreground/60 hover:text-accent-blue hover:bg-accent-blue/10 transition-all">
                <Mail className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-foreground/60 hover:text-accent-blue hover:bg-accent-blue/10 transition-all">
                <LinkIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4 tracking-tight">Product</h3>
            <ul className="space-y-3">
              <li><Link href="/#features" className="text-sm font-medium text-foreground/60 hover:text-accent-blue transition-colors">Features</Link></li>
              <li><Link href="/#showcase" className="text-sm font-medium text-foreground/60 hover:text-accent-blue transition-colors">AI Intelligence</Link></li>
              <li><Link href="/#how-it-works" className="text-sm font-medium text-foreground/60 hover:text-accent-blue transition-colors">How It Works</Link></li>
              <li><Link href="/login" className="text-sm font-medium text-foreground/60 hover:text-accent-blue transition-colors">Get Started</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 tracking-tight">Resources</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm font-medium text-foreground/60 hover:text-accent-blue transition-colors">Blog</Link></li>
              <li><Link href="/#showcase" className="text-sm font-medium text-foreground/60 hover:text-accent-blue transition-colors">Career Roadmaps</Link></li>
              <li><Link href="#" className="text-sm font-medium text-foreground/60 hover:text-accent-blue transition-colors">Help Center</Link></li>
              <li><Link href="#" className="text-sm font-medium text-foreground/60 hover:text-accent-blue transition-colors">Community</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 tracking-tight">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm font-medium text-foreground/60 hover:text-accent-blue transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm font-medium text-foreground/60 hover:text-accent-blue transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm font-medium text-foreground/60 hover:text-accent-blue transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-foreground/60">
            © {new Date().getFullYear()} HireReady. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
