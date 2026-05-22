import React from "react";
import { Linkedin, Github, Mail, Download, MapPin, GraduationCap, Briefcase, Zap } from "lucide-react";

const skills = [
  { label: "Python", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
  { label: "Machine Learning", color: "text-violet-400 bg-violet-400/10 border-violet-400/20" },
  { label: "Deep Learning", color: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20" },
  { label: "Pandas / NumPy", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  { label: "Scikit-learn", color: "text-orange-400 bg-orange-400/10 border-orange-400/20" },
  { label: "SQL", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  { label: "Data Science", color: "text-pink-400 bg-pink-400/10 border-pink-400/20" },
  { label: "Power BI", color: "text-yellow-300 bg-yellow-300/10 border-yellow-300/20" },
  { label: "Git / GitHub", color: "text-zinc-300 bg-zinc-300/10 border-zinc-300/20" },
  { label: "AWS Cloud", color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
];

const projects = [
  {
    title: "Smart Sales Analytics Engine",
    desc: "Python pipeline processing 10,000+ records. Automated preprocessing & visualization, reducing manual effort ~30%.",
    tag: "Analytics",
    color: "text-violet-400",
  },
  {
    title: "AI-Based Prediction System",
    desc: "Supervised ML model achieving ~82% accuracy. Feature engineering, multi-algorithm comparison, and evaluation pipelines.",
    tag: "ML",
    color: "text-cyan-400",
  },
  {
    title: "Student Performance Analysis",
    desc: "Statistical analysis of academic datasets with visual dashboards and performance improvement strategies.",
    tag: "Data Science",
    color: "text-emerald-400",
  },
];

const certs = [
  "Machine Learning for Data Science — IBM",
  "AWS Academy — Cloud Foundations",
  "Deep Learning for Business — Yonsei University",
  "Cisco Networking Basics",
];

export default function Contact() {
  return (
    <div className="min-h-full p-6 md:p-10 space-y-10 max-w-5xl mx-auto">

      {/* Hero */}
      <div className="glass rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-start animate-fade-up">
        <div className="relative flex-shrink-0">
          <img
            src="/majeed.jpg"
            alt="Shaik Majeed"
            className="w-28 h-28 md:w-36 md:h-36 rounded-2xl object-cover object-top border border-white/10 shadow-2xl"
          />
          <div className="absolute -bottom-2 -right-2 h-7 w-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center glow-violet">
            <Zap size={13} className="text-primary" />
          </div>
        </div>
        <div className="flex-1 text-center md:text-left space-y-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-white">Shaik Majeed</h1>
            <p className="text-primary text-sm font-medium mt-1 uppercase tracking-widest">AI & Data Science · Software Engineer Intern</p>
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-xl">
            AI & Data Science undergraduate with strong foundations in Python, machine learning, and software engineering. Passionate about scalable technology, quantitative problem solving, and high-performance engineering environments.
          </p>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start text-xs text-zinc-500">
            <span className="flex items-center gap-1"><MapPin size={12} /> Andhra Pradesh, India</span>
            <span className="flex items-center gap-1"><GraduationCap size={12} /> B.Tech AI & DS · CGPA 7.7</span>
            <span className="flex items-center gap-1"><Briefcase size={12} /> 2023 – 2027</span>
          </div>
          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-1">
            <a
              href="https://www.linkedin.com/in/majeed-shaik"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0077b5]/10 border border-[#0077b5]/30 text-[#4fa8d5] hover:bg-[#0077b5]/20 transition-all text-sm font-medium active:scale-95"
            >
              <Linkedin size={15} /> LinkedIn
            </a>
            <a
              href="https://github.com/Majeedshaik748"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg glass border-white/10 text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-all text-sm font-medium active:scale-95"
            >
              <Github size={15} /> GitHub
            </a>
            <a
              href="mailto:skmajeed1123@gmail.com"
              className="flex items-center gap-2 px-4 py-2 rounded-lg glass border-white/10 text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-all text-sm font-medium active:scale-95"
            >
              <Mail size={15} /> skmajeed1123@gmail.com
            </a>
            <a
              href="/majeed-resume.pdf"
              download="Shaik_Majeed_Resume.pdf"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all text-sm font-medium active:scale-95 glow-violet"
            >
              <Download size={15} /> Resume
            </a>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="glass rounded-2xl p-6 md:p-8 space-y-4 animate-fade-up" style={{ animationDelay: "75ms" }}>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Technical Skills</h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((s) => (
            <span key={s.label} className={`px-3 py-1 rounded-full text-xs font-medium border ${s.color}`}>
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="space-y-4 animate-fade-up" style={{ animationDelay: "150ms" }}>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 px-1">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div key={p.title} className="glass rounded-xl p-5 space-y-3 hover:bg-white/[0.03] transition-all group">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-white font-medium text-sm leading-snug">{p.title}</h3>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border border-current/20 bg-current/5 flex-shrink-0 ${p.color}`}>{p.tag}</span>
              </div>
              <p className="text-zinc-500 text-xs leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div className="glass rounded-2xl p-6 md:p-8 space-y-4 animate-fade-up" style={{ animationDelay: "225ms" }}>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Certifications</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {certs.map((c) => (
            <div key={c} className="flex items-center gap-3 text-sm text-zinc-300">
              <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              {c}
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-zinc-700 pb-4 animate-fade-up" style={{ animationDelay: "300ms" }}>
        MADE WITH GPT-5-MINI + REPLIT
      </p>
    </div>
  );
}
