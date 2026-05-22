import React from "react";
import { Linkedin, Github } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-full flex items-center justify-center p-6 md:p-12 animate-fade-up">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
        
        <div className="space-y-6 delay-[0ms]">
          <h1 className="text-5xl md:text-6xl font-light tracking-tight text-white leading-tight">
            Built for founders <br/>
            <span className="text-zinc-500">who move fast.</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-md leading-relaxed">
            SalesAI helps SaaS founders and SDRs send better cold emails with AI. Draft, personalize, and send — all in one place.
          </p>
          <div className="pt-8">
            <p className="text-sm font-medium text-zinc-600 tracking-widest uppercase">Made with gpt-5-mini + Replit</p>
          </div>
        </div>

        <div className="glass rounded-2xl p-8 border-white/[0.08] space-y-4 delay-[150ms] shadow-2xl">
          <a href="#" className="flex items-center gap-4 p-4 rounded-xl glass border-white/[0.05] hover:bg-white/[0.02] hover:border-white/[0.1] transition-all group active:scale-[0.98]">
            <div className="h-12 w-12 rounded-lg bg-[#0077b5]/10 text-[#0077b5] flex items-center justify-center group-hover:bg-[#0077b5] group-hover:text-white transition-colors">
              <Linkedin size={24} />
            </div>
            <div>
              <div className="text-white font-medium">Connect on LinkedIn</div>
              <div className="text-zinc-500 text-sm">Let's talk outreach strategy</div>
            </div>
          </a>

          <a href="#" className="flex items-center gap-4 p-4 rounded-xl glass border-white/[0.05] hover:bg-white/[0.02] hover:border-white/[0.1] transition-all group active:scale-[0.98]">
            <div className="h-12 w-12 rounded-lg bg-white/5 text-white flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
              <Github size={24} />
            </div>
            <div>
              <div className="text-white font-medium">View on GitHub</div>
              <div className="text-zinc-500 text-sm">Check out the source code</div>
            </div>
          </a>
        </div>

      </div>
    </div>
  );
}
