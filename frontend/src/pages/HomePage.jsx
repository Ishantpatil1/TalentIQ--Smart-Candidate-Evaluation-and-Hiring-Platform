import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

// High-Resolution Professional Assets
const heroImages = [
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80", 
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80",
];

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, ease: [0.215, 0.61, 0.355, 1], duration: 0.8 },
  }),
};

export default function HomePage() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#0A0A0B] text-white antialiased selection:bg-blue-500/30">
      
      {/* ============================================= */}
      {/* CINEMATIC HERO SECTION */}
      {/* ============================================= */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Slider */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 2 }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImages[index]})` }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-black/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <span className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-bold tracking-[0.3em] uppercase text-blue-400 mb-8">
              The Future of Talent Acquisition
            </span>
            <h1 className="text-5xl lg:text-[90px] font-black tracking-tighter leading-[1.1] mb-8">
              Discover & Hire Talent <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                with Intelligence
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg lg:text-xl text-slate-400 font-light leading-relaxed mb-12">
              TalentIQ combines powerful smart resume parsing, intelligent matching, 
              secure proctored interviews and analytics — enabling smarter, faster and fairer hiring.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/register" className="w-full sm:w-auto px-10 py-5 bg-white text-black font-bold rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                Get Started
              </Link>
              <a href="#solutions" className="w-full sm:w-auto px-10 py-5 border border-white/20 rounded-full font-bold hover:bg-white/5 transition-all">
                Explore Features
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================= */}
      {/* SMART INFRASTRUCTURE (BENTO GRID) */}
      {/* ============================================= */}
      <section id="solutions" className="py-32 px-6 lg:px-20 relative">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-4xl lg:text-6xl font-bold tracking-tighter mb-6">Designed for <br />Precision Hiring.</h2>
            <div className="w-20 h-1 bg-blue-600" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large Bento Card */}
            <div className="md:col-span-2 relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-800 p-12 border border-white/5 group">
              <div className="relative z-10">
                <span className="text-blue-400 font-bold uppercase tracking-widest text-xs">Matching Engine</span>
                <h3 className="text-3xl lg:text-5xl font-bold mt-4 mb-6 leading-tight">Smart Resume <br />Verification.</h3>
                <p className="text-slate-400 max-w-md">Our intelligent system accurately identifies skill sets and career trajectories to find your perfect candidate match instantly.</p>
              </div>
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-600/20 blur-[100px] group-hover:bg-blue-600/40 transition-all" />
            </div>

            {/* Small Bento Card */}
            <div className="rounded-[2.5rem] bg-[#111112] p-10 border border-white/5 flex flex-col justify-between hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl">🔒</div>
              <div>
                <h4 className="text-xl font-bold mb-3">Secure Integrity</h4>
                <p className="text-slate-500 text-sm">Intelligent proctoring ensures a fair and secure assessment environment for every applicant.</p>
              </div>
            </div>

            {/* Square Bento Card */}
            <div className="rounded-[2.5rem] bg-[#111112] p-10 border border-white/5 flex flex-col justify-between hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl">📊</div>
              <div>
                <h4 className="text-xl font-bold mb-3">Intelligent Analytics</h4>
                <p className="text-slate-500 text-sm">Visualize hiring velocity and candidate quality through comprehensive data-driven dashboards.</p>
              </div>
            </div>

            {/* Long Bento Card */}
            <div className="md:col-span-2 relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-12 border border-white/5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h4 className="text-2xl font-bold mb-4">Candidate Ranking</h4>
                  <p className="text-slate-500 text-sm mb-6">Our smart algorithms prioritize candidates based on experience, fit, and behavioral signals.</p>
                  <button className="text-blue-400 text-sm font-bold uppercase tracking-widest hover:underline">Learn More →</button>
                </div>
                <div className="flex gap-4 items-end justify-center">
                   {[60, 90, 70, 110, 80].map((h, i) => (
                     <motion.div 
                      initial={{ height: 0 }}
                      whileInView={{ height: h }}
                      key={i} 
                      className="w-8 bg-blue-600 rounded-t-lg" 
                     />
                   ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* TECHNICAL EXCELLENCE SECTION */}
      {/* ============================================= */}
      <section className="py-24 bg-white text-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h3 className="text-4xl lg:text-5xl font-bold tracking-tighter mb-8 italic">Engineered for Reliability.</h3>
              <p className="text-slate-600 leading-relaxed mb-10 text-lg">
                TalentIQ is built on a high-performance architecture that allows for 
                seamless processing of high-volume recruitment data. Our intelligent 
                backend services ensure that every resume and interview is handled with 
                maximum speed and security.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h5 className="font-bold text-blue-600 uppercase text-xs tracking-widest mb-2">Interface</h5>
                  <p className="text-sm font-medium">Responsive & Fluid React UI</p>
                </div>
                <div>
                  <h5 className="font-bold text-blue-600 uppercase text-xs tracking-widest mb-2">Systems</h5>
                  <p className="text-sm font-medium">Smart Data Processing Hub</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 rounded-[3rem] p-12 border border-slate-200 shadow-2xl relative overflow-hidden">
               <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <span className="font-bold">Intelligent Core</span>
                    <span className="text-[10px] font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full uppercase tracking-tighter">Running</span>
                  </div>
                  <div className="flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <span className="font-bold">Secure Gateway</span>
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full uppercase tracking-tighter">Active</span>
                  </div>
                  <div className="flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-slate-100 opacity-50">
                    <span className="font-bold">Automated Feedback</span>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase tracking-tighter">Standby</span>
                  </div>
               </div>
               <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-400/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* FINAL CALL TO ACTION */}
      {/* ============================================= */}
      <section className="py-40 relative overflow-hidden bg-[#0A0A0B]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl lg:text-8xl font-black tracking-tighter mb-12 italic">Ready to Hire?</h2>
          <Link to="/register" className="inline-block px-12 py-6 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-500 transition-all shadow-[0_20px_60px_rgba(37,99,235,0.3)] hover:scale-105 active:scale-95">
            Get Started with TalentIQ
          </Link>
          <p className="mt-12 text-slate-600 text-[10px] font-bold uppercase tracking-[0.5em]">Global Talent Intelligence Solutions</p>
        </div>
      </section>

      <footer className="py-10 border-t border-white/5 text-center text-slate-700 text-[10px] font-bold tracking-[0.2em] uppercase">
        © 2026 TalentIQ Platform — Precision in Every Step.
      </footer>
    </div>
  );
}

// import React from "react";
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";

// const fadeInUp = {
//   hidden: { opacity: 0, y: 24 },
//   visible: (delay = 0) => ({
//     opacity: 1,
//     y: 0,
//     transition: { delay, ease: "easeOut", duration: 0.6 },
//   }),
// };

// const stagger = {
//   visible: { transition: { staggerChildren: 0.12 } },
// };

// export default function HomePage() {
//   return (
//     <div className="bg-white text-slate-900 antialiased overflow-x-hidden">

//       {/* ============================================= */}
//       {/* HERO SECTION */}
//       {/* ============================================= */}
//       <motion.section
//         initial={{ opacity: 0, y: -30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//         className="relative overflow-hidden"
//       >
//         {/* Decorative top gradient */}
//         <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10 pointer-events-none -z-10" />

//         <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

//             {/* LEFT TEXT */}
//             <motion.div
//               variants={fadeInUp}
//               initial="hidden"
//               whileInView="visible"
//               viewport={{ once: true }}
//               custom={0.05}
//               className="lg:col-span-7"
//             >
//               <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight leading-tight">
//                 <span className="block">Discover & Hire Talent</span>
//                 <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
//                   with Intelligence
//                 </span>
//               </h1>

//               <p className="mt-6 max-w-2xl text-lg text-slate-600">
//                 TalentIQ combines powerful NLP resume parsing, AI-based matching,
//                 secure proctored interviews and analytics — enabling smarter,
//                 faster and fairer hiring.
//               </p>

//               {/* Buttons */}
//               <div className="mt-8 flex flex-col sm:flex-row gap-4">
//                 <Link
//                   to="/register"
//                   className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 font-medium shadow-lg hover:scale-[1.02] transition-transform"
//                 >
//                   Get Started
//                   <svg
//                     className="ml-3 w-4 h-4"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                   >
//                     <path
//                       d="M5 12h14"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                     />
//                     <path
//                       d="M12 5l7 7-7 7"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                     />
//                   </svg>
//                 </Link>

//                 <a
//                   href="#features"
//                   className="inline-flex items-center justify-center rounded-full border border-slate-200 text-slate-700 px-6 py-3 hover:bg-slate-50 transition"
//                 >
//                   Explore Features
//                 </a>
//               </div>

//               {/* Stats */}
//               <div className="mt-8 flex items-center gap-6 text-sm text-slate-500 flex-wrap">
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 rounded bg-gradient-to-tr from-green-400 to-blue-500 flex items-center justify-center text-white font-semibold">
//                     AI
//                   </div>
//                   <div>
//                     <div className="font-medium text-slate-800">
//                       Match Accuracy
//                     </div>
//                     <div className="text-xs"></div>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 rounded bg-indigo-500/90 flex items-center justify-center text-white font-semibold">
//                     🔒
//                   </div>
//                   <div>
//                     <div className="font-medium text-slate-800">
//                       Secure Interviewing
//                     </div>
//                     <div className="text-xs">Monitored & recorded</div>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>

//             {/* RIGHT ILLUSTRATION */}
//             <motion.div
//               variants={fadeInUp}
//               initial="hidden"
//               whileInView="visible"
//               viewport={{ once: true }}
//               custom={0.12}
//               className="lg:col-span-5 relative"
//             >
//               <div className="relative mx-auto w-full max-w-md">
//                 <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5">
//                   <img
//                     src="/talent.png"
//                     alt="AI Talent Match"
//                     className="w-full object-cover"
//                   />
//                 </div>

//                 {/* FLOATING CARD (Fixed!) */}
//                 <motion.div
//                   initial={{ opacity: 0, y: 15, scale: 0.96 }}
//                   whileInView={{ opacity: 1, y: 0, scale: 1 }}
//                   transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
//                   viewport={{ once: true }}
//                   className="
//                   relative
//                   -mt-8                      /* premium tight attachment under image */
//                   mx-auto
//                   w-[92%]
//                   max-w-[420px]
//                   rounded-2xl
//                   px-6 py-5
//                   backdrop-blur-xl           /* glass effect */
//                   bg-white/80                /* semi-glass white */
//                   border border-white/40     /* Apple-like border */
//                   shadow-[0_8px_30px_rgba(0,0,0,0.12)]   /* soft premium shadow */
//                   transition-all
//                   hover:scale-[1.015]        /* subtle hover */
//                   hover:shadow-[0_12px_40px_rgba(0,0,0,0.18)]
//                   "
//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <div className="text-slate-800 font-semibold text-lg">
//                         Match Summary
//                       </div>
//                       <div className="text-xs text-slate-500 mt-1">
//                         Top candidate: <span className="font-semibold">Rashi K.</span>
//                       </div>
//                     </div>

//                     <div className="text-right">
//                       <div className="text-green-600 font-extrabold text-xl leading-none">
//                         92%
//                       </div>
//                       <div className="text-[11px] text-slate-500">Role-fit</div>
//                     </div>
//                   </div>
//                 </motion.div>

//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </motion.section>

//       {/* ============================================= */}
//       {/* FEATURES */}
//       {/* ============================================= */}
//       <section id="features" className="pt-20 pb-16 bg-slate-50">
//         <div className="max-w-7xl mx-auto px-6 lg:px-8">

//           {/* 3 Feature Cards */}
//           <motion.div
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//             variants={stagger}
//             className="grid grid-cols-1 md:grid-cols-3 gap-6"
//           >
//             {[
//               {
//                 title: "NLP Resume Parsing",
//                 desc: "Extract skills, experience and intent using advanced NLP.",
//                 icon: "📝",
//                 style: "from-indigo-500 to-blue-500",
//               },
//               {
//                 title: "Candidate Ranking",
//                 desc: "Prioritize profiles based on experience, fit & signals.",
//                 icon: "📊",
//                 style: "from-rose-500 to-purple-500",
//               },
//               {
//                 title: "Secure Proctored Interviews",
//                 desc: "Real-time monitoring, recording & behavior tracking.",
//                 icon: "🎥",
//                 style: "from-green-400 to-teal-500",
//               },
//             ].map((card, i) => (
//               <motion.article
//                 key={card.title}
//                 variants={fadeInUp}
//                 initial="hidden"
//                 whileInView="visible"
//                 viewport={{ once: true }}
//                 custom={0.08 * i}
//                 className="bg-white rounded-2xl p-6 shadow hover:shadow-xl transition"
//               >
//                 <div
//                   className={`inline-flex items-center justify-center w-12 h-12 rounded-md text-white bg-gradient-to-tr ${card.style}`}
//                 >
//                   <span className="text-lg">{card.icon}</span>
//                 </div>
//                 <h3 className="mt-4 text-lg font-semibold">{card.title}</h3>
//                 <p className="mt-2 text-sm text-slate-500">{card.desc}</p>
//                 <div className="mt-4">
//                   <a href="#contact" className="text-sm font-medium text-blue-600 hover:underline">
//                     Learn more →
//                   </a>
//                 </div>
//               </motion.article>
//             ))}
//           </motion.div>

//           {/* BONUS FEATURE ROW */}
//           <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">

//             {/* Analytics */}
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.6 }}
//               className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-xl"
//             >
//               <h4 className="text-xl font-semibold">Real-time Analytics</h4>
//               <p className="mt-3 text-slate-200 text-sm">
//                 Pipeline velocity, interview metrics, source ROI and more.
//               </p>

//               <div className="mt-4 grid grid-cols-3 gap-3">
//                 <div className="bg-white/10 p-3 rounded text-center">
//                   <div className="text-2xl font-bold">45</div>
//                   <div className="text-xs text-slate-300">Open roles</div>
//                 </div>

//                 <div className="bg-white/10 p-3 rounded text-center">
//                   <div className="text-2xl font-bold">98%</div>
//                   <div className="text-xs text-slate-300">Match accuracy</div>
//                 </div>

//                 <div className="bg-white/10 p-3 rounded text-center">
//                   <div className="text-2xl font-bold">1.2d</div>
//                   <div className="text-xs text-slate-300">Avg screening</div>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Feedback */}
//             <motion.div
//               initial={{ opacity: 0, x: 20 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.6 }}
//               className="bg-white rounded-2xl p-6 shadow hover:shadow-xl"
//             >
//               <h4 className="text-lg font-semibold">Automated Feedback Reports</h4>
//               <p className="mt-2 text-sm text-slate-600">
//                 Candidate strengths, improvement areas & interview summaries.
//               </p>

//               <div className="mt-4 flex items-center gap-3">
//                 <div className="w-12 h-12 bg-indigo-100 rounded text-indigo-600 font-semibold flex items-center justify-center">
//                   A+
//                 </div>
//                 <div>
//                   <div className="text-sm font-medium">Quality score</div>
//                   <div className="text-xs text-slate-500">AI-evaluated</div>
//                 </div>
//               </div>
//             </motion.div>
//           </div>

//         </div>
//       </section>

//       {/* ============================================= */}
//       {/* HOW IT WORKS */}
//       {/* ============================================= */}
//       <section className="py-16">
//         <div className="max-w-6xl mx-auto px-6 text-center">
//           <motion.h2
//             variants={fadeInUp}
//             initial="hidden"
//             whileInView="visible"
//             className="text-3xl font-semibold"
//           >
//             How TalentIQ Works
//           </motion.h2>

//           <motion.p
//             variants={fadeInUp}
//             initial="hidden"
//             whileInView="visible"
//             className="mt-4 text-slate-600 max-w-2xl mx-auto"
//           >
//             From job posting to offer — AI assists every step.
//           </motion.p>

//           <motion.div
//             className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-6"
//             initial="hidden"
//             whileInView="visible"
//             variants={stagger}
//           >
//             {[
//               { title: "Sign Up", desc: "Create your account." },
//               { title: "Upload / Post", desc: "Add resumes or job openings." },
//               { title: "AI Match", desc: "Smart ranking & shortlisting." },
//               { title: "Connect", desc: "Schedule interviews & hire." },
//             ].map((s) => (
//               <motion.div
//                 variants={fadeInUp}
//                 key={s.title}
//                 className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition"
//               >
//                 <div className="text-xl font-semibold">{s.title}</div>
//                 <div className="mt-2 text-sm text-slate-500">{s.desc}</div>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </section>

//       {/* ============================================= */}
//       {/* TESTIMONIALS (Fixed Overlap + Responsive) */}
//       {/* ============================================= */}
//       <section className="bg-slate-50 py-16">
//         <div className="max-w-7xl mx-auto px-6">
//           <h3 className="text-2xl font-semibold text-center">What customers say</h3>

//           <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
//             {[
//               {
//                 quote: "TalentIQ helped us cut time-to-hire by 60%.",
//                 name: "Vaibhav Amritkar, HR ",
//               },
//               {
//                 quote: "AI ranking surfaced top-fit candidates instantly.",
//                 name: "Sunil Chaudhari, Hiring Manager",
//               },
//               {
//                 quote: "Secure interviews saved us time and fraud.",
//                 name: "Ajay Tapkir, Recruiter",
//               },
//             ].map((t, i) => (
//               <motion.blockquote
//                 key={i}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 className="
//                   bg-white 
//                   rounded-2xl 
//                   p-6 
//                   shadow 
//                   h-full 
//                   flex 
//                   flex-col 
//                   justify-between
//                 "
//               >
//                 <p className="text-slate-700 text-[17px] leading-relaxed">
//                   “{t.quote}”
//                 </p>
//                 <footer className="mt-6 text-sm text-slate-500 font-medium">
//                   {t.name}
//                 </footer>
//               </motion.blockquote>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ============================================= */}
//       {/* CONTACT */}
//       {/* ============================================= */}
//       <motion.section
//         id="contact"
//         className="py-16"
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true }}
//       >
//         <div className="max-w-3xl mx-auto px-6">
//           <h3 className="text-2xl font-semibold text-center">Get in touch</h3>
//           <p className="text-center text-slate-600 mt-2">
//             Questions or feedback? We respond within 24 hours.
//           </p>

//           <form className="mt-8 bg-white rounded-2xl shadow px-6 py-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <input
//                 className="border border-slate-200 rounded px-4 py-3 focus:ring-2 focus:ring-blue-300 outline-none"
//                 placeholder="Your name"
//               />
//               <input
//                 className="border border-slate-200 rounded px-4 py-3 focus:ring-2 focus:ring-blue-300 outline-none"
//                 placeholder="Email address"
//               />
//             </div>

//             <textarea
//               className="w-full mt-4 border border-slate-200 rounded px-4 py-3 h-28 focus:ring-2 focus:ring-blue-300 outline-none"
//               placeholder="Message"
//             />

//             <div className="mt-4 text-right">
//               <button className="inline-flex items-center px-5 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow hover:scale-[1.02] transition">
//                 Send Message
//               </button>
//             </div>
//           </form>
//         </div>
//       </motion.section>
//     </div>
//   );
// }
