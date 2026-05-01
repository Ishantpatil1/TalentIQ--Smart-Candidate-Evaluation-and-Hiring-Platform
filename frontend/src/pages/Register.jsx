import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

// Cinematic Hiring Environments (No focused individual faces)
const registerImages = [
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80", // Modern Conference Room
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80", // Collaborative Tech Office
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80", // Abstract Business Meeting
  "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&q=80", // Clean Corporate Workspace
];

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("candidate");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % registerImages.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post("http://localhost:3000/api/auth/register", {
        name,
        email,
        password,
        role,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration encountered an error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] flex overflow-hidden selection:bg-blue-600/10 font-sans">
      
      {/* LEFT: CINEMATIC ENVIRONMENT GALLERY */}
      <div className="hidden lg:flex relative w-[48%] h-screen overflow-hidden bg-slate-100 border-r border-slate-200">
        <AnimatePresence mode="wait">
          <motion.div
            key={bgIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full bg-cover bg-center grayscale-[10%] brightness-[0.85]"
            style={{ backgroundImage: `url(${registerImages[bgIndex]})` }}
          />
        </AnimatePresence>
        
        {/* Professional Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 via-transparent to-[#F8FAFC]" />
        
        <div className="absolute bottom-20 left-16 z-10">
            <div className="w-16 h-1 bg-white mb-6 shadow-xl" />
            <h1 className="text-white text-6xl font-black tracking-tighter italic leading-none mb-4 drop-shadow-2xl">TalentIQ.</h1>
            <p className="text-white/90 text-lg font-semibold tracking-tight max-w-xs drop-shadow-md">
              Intelligent Platform for recruitment.
            </p>
        </div>
      </div>

      {/* RIGHT: REGISTRATION INTERFACE (CLEAN & SHARP) */}
      <div className="w-full lg:w-[52%] flex items-center justify-center p-8 lg:p-24 bg-[#F8FAFC] overflow-y-auto relative">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-14">
            <h2 className="text-5xl font-black text-slate-950 tracking-tighter mb-4">Register.</h2>
            <p className="text-slate-500 font-medium">Create your profile to access the Dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7">
            
            {/* FULL NAME */}
            <div className="space-y-2 group">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-blue-600 transition-colors">
                Name
              </label>
              <input
                type="text"
                placeholder="Ex: Yashwant Chaudhari"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="
                  w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 
                  text-slate-900 placeholder:text-slate-300 outline-none
                  focus:border-slate-900 focus:shadow-[0_0_0_4px_rgba(0,0,0,0.02)]
                  transition-all duration-300
                "
                required
              />
            </div>

            {/* EMAIL */}
            <div className="space-y-2 group">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-blue-600 transition-colors">
                Email
              </label>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 
                  text-slate-900 placeholder:text-slate-300 outline-none
                  focus:border-slate-900 focus:shadow-[0_0_0_4px_rgba(0,0,0,0.02)]
                  transition-all duration-300
                "
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* PASSWORD */}
                <div className="space-y-2 group">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-blue-600 transition-colors">
                    Access Key
                </label>
                <div className="relative">
                    <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="
                        w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 
                        text-slate-900 placeholder:text-slate-300 outline-none
                        focus:border-slate-900 focus:shadow-[0_0_0_4px_rgba(0,0,0,0.02)]
                        transition-all duration-300
                    "
                    required
                    />
                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-900 transition"
                    >
                    {showPassword ? "🙈" : "👁️"}
                    </button>
                </div>
                </div>

                {/* ROLE */}
                <div className="space-y-2 group">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-blue-600 transition-colors">
                    Role
                </label>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="
                    w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 
                    text-slate-900 outline-none appearance-none cursor-pointer
                    focus:border-slate-900
                    transition-all duration-300
                    "
                >
                    <option value="candidate">Candidate</option>
                    <option value="recruiter">Recruiter</option>
                </select>
                </div>
            </div>

            {/* ERROR DISPLAY */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-red-50 text-red-600 text-[11px] font-bold p-4 rounded-xl border border-red-100 flex items-center gap-3"
                >
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full" /> {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* SUBMIT BUTTON */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full py-4.5 bg-slate-950 text-white font-bold rounded-2xl 
                  hover:bg-blue-600 shadow-xl shadow-slate-200 hover:shadow-blue-100
                  transition-all duration-500 active:scale-[0.98] disabled:opacity-50
                  flex items-center justify-center gap-3
                "
              >
                {loading ? "Initializing..." : "Register Now"}
                {!loading && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
              </button>
            </div>

            {/* LOGIN LINK */}
            <div className="text-center pt-4">
              <p className="text-slate-500 text-sm font-medium">
                Already registered? {" "}
                <Link to="/login" className="text-slate-950 font-bold hover:text-blue-600 transition-colors underline underline-offset-4 decoration-slate-200 hover:decoration-blue-200">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </motion.div>

        {/* SUBTLE BRANDING */}
        <div className="absolute bottom-8 right-8 text-[9px] text-slate-300 font-bold uppercase tracking-[0.4em] pointer-events-none">
           v2.0 // Intelligent Hub
        </div>
      </div>
    </div>
  );
}


// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import Lottie from "lottie-react";

// export default function Register() {
//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [role, setRole] = useState("candidate");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Lottie animation
//   const [animationData, setAnimationData] = useState(null);
//   const [animationError, setAnimationError] = useState(false);

//   const LOTTIE_URL =
//     "https://assets9.lottiefiles.com/private_files/lf30_obidsi0t.json";

//   useEffect(() => {
//     fetch(LOTTIE_URL)
//       .then((res) => res.json())
//       .then((data) => setAnimationData(data))
//       .catch(() => setAnimationError(true));
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       await axios.post("http://localhost:3000/api/auth/register", {
//         name,
//         email,
//         password,
//         role,
//       });

//       navigate("/login");
//     } catch (err) {
//       setError(err.response?.data?.message || "Registration failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="relative min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-purple-100 px-6 lg:px-10 py-12 overflow-hidden">

//       {/* Background glow elements */}
//       <div className="absolute w-[480px] h-[480px] bg-purple-300/30 rounded-full blur-3xl -top-24 -left-32"></div>
//       <div className="absolute w-[480px] h-[480px] bg-blue-400/30 rounded-full blur-3xl -bottom-24 -right-32"></div>

//       {/* Main card */}
//       <motion.div
//         initial={{ opacity: 0, scale: 0.94, y: 20 }}
//         animate={{ opacity: 1, scale: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="
//           w-full
//           max-w-6xl
//           bg-white/80
//           backdrop-blur-xl
//           shadow-xl
//           rounded-3xl
//           border border-white/40
//           flex flex-col lg:flex-row
//           items-center
//           gap-12
//           px-6 sm:px-10 py-10
//           lg:px-14 lg:py-14
//         "
//       >

//         {/* Left Section (Animation + Welcome Text) */}
//         <div className="hidden lg:flex flex-col items-center justify-center w-1/2 text-center px-6">
//           <div className="w-full flex justify-center mb-4">
//             {animationData && (
//               <Lottie
//                 animationData={animationData}
//                 loop
//                 className="w-[360px] h-[360px]"
//               />
//             )}

//             {!animationData && animationError && (
//               <img
//                 src="/register-illustration.gif"
//                 alt="Welcome"
//                 className="w-80 h-80 object-contain"
//               />
//             )}

//             {!animationData && !animationError && (
//               <div className="w-80 h-80 flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
//               </div>
//             )}
//           </div>

//           <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2">
//             Welcome to TalentIQ
//           </h3>
//           <p className="text-slate-600 mt-3 text-sm max-w-sm leading-relaxed">
//             Smart AI-powered hiring — connecting talent and recruiters with intelligence and automation.
//           </p>
//         </div>

//         {/* Right Section (Form) */}
//         <div className="w-full lg:w-1/2 px-2 sm:px-4">
//           <h2 className="text-center text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
//             Create an Account
//           </h2>

//           <form onSubmit={handleSubmit} className="space-y-6">

//             {/* Full Name */}
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1">
//                 Full Name
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter your name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="
//                   w-full px-4 py-3 rounded-xl 
//                   border border-slate-300 
//                   bg-white
//                   focus:ring-2 focus:ring-purple-400
//                   outline-none
//                 "
//                 required
//               />
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1">
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 placeholder="name@example.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="
//                   w-full px-4 py-3 rounded-xl 
//                   border border-slate-300 
//                   bg-white
//                   focus:ring-2 focus:ring-purple-400
//                   outline-none
//                 "
//                 required
//               />
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1">
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Create password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="
//                     w-full px-4 py-3 rounded-xl 
//                     border border-slate-300 
//                     bg-white
//                     focus:ring-2 focus:ring-purple-400
//                     outline-none
//                   "
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-3 text-slate-500 hover:text-slate-700 text-lg"
//                 >
//                   {showPassword ? "🙈" : "👁️"}
//                 </button>
//               </div>
//             </div>

//             {/* Role Selection */}
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1">
//                 Select Role
//               </label>
//               <select
//                 value={role}
//                 onChange={(e) => setRole(e.target.value)}
//                 className="
//                   w-full px-4 py-3 rounded-xl 
//                   border border-slate-300 
//                   bg-white
//                   focus:ring-2 focus:ring-purple-400
//                   outline-none
//                 "
//               >
//                 <option value="candidate">Candidate</option>
//                 <option value="recruiter">Recruiter</option>
//               </select>
//             </div>

//             {/* Error Alert */}
//             {error && (
//               <motion.div
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="text-red-600 bg-red-100 border border-red-300 py-2 rounded-lg text-center text-sm"
//               >
//                 {error}
//               </motion.div>
//             )}

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="
//                 w-full py-3 rounded-xl
//                 bg-gradient-to-r from-purple-600 to-blue-600
//                 text-white font-semibold shadow-lg 
//                 hover:opacity-90 transition 
//                 disabled:opacity-50
//                 text-lg
//               "
//             >
//               {loading ? "Registering..." : "Register"}
//             </button>

//             {/* Already have an account */}
//             <p className="text-center text-sm text-slate-600 mt-3">
//               Already have an account?{" "}
//               <Link
//                 to="/login"
//                 className="text-blue-600 font-medium hover:underline"
//               >
//                 Login
//               </Link>
//             </p>
//           </form>
//         </div>
//       </motion.div>
//     </div>
//   );
// }
