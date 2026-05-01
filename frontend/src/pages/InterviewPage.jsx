import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import AIInterviewSession from "../components/AIInterviewSession";

export default function InterviewPage() {
  const [session, setSession] = useState(null);
  const [jobData, setJobData] = useState(null); // ⭐ NEW
  const { jobId } = useParams();
  const token = localStorage.getItem("token");

  const candidateId =
    JSON.parse(localStorage.getItem("user") || "{}")._id || "candidate_demo";

  // ⭐ FETCH JOB DETAILS BEFORE INTERVIEW
  useEffect(() => {
    async function loadJob() {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/jobs/${jobId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setJobData(res.data);
      } catch (err) {
        console.log("❌ Failed to load job data");
      }
    }
    loadJob();
  }, [jobId, token]);

  const startSession = async () => {
    try {
      // ⭐ Use real job skills + job description instead of static
      const skills = jobData?.skills || ["General"];
      const summary = jobData?.description || "Interview for applied job role.";

      const res = await axios.post(
        "http://localhost:3000/api/ai-interview/generate",
        { candidateId, skills, summary, jobId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        const cleaned = {
          ...res.data,
          questions: res.data.questions.map((q) =>
            typeof q === "string" ? q : q.question
          ),
        };
        setSession(cleaned);
      } else {
        alert("Failed to start interview session.");
      }
    } catch (err) {
      console.log(err);
      console.error("❌ Interview creation error:", err.response?.data || err.message);
      alert("Failed to create interview session.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 py-16 px-4 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl"
      >
        <motion.h2
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl font-extrabold text-center mb-10 
          bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent 
          drop-shadow-md"
        >
          AI-Powered Interview
        </motion.h2>

        {!session ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white/60 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl border border-white/40"
          >
            <motion.h4
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold text-gray-800"
            >
              Interview for Job ID:{" "}
              <span className="text-indigo-600">{jobId}</span>
            </motion.h4>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-3 text-gray-600"
            >
              Please ensure the following before starting your interview:
            </motion.p>

            {/* Checklist */}
            <ul className="mt-4 space-y-3">
              {[
                "Your camera clearly captures your face",
                "Good lighting is available",
                "Minimal background noise",
                "Stable sitting environment",
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center text-gray-700 text-lg"
                >
                  <span className="text-green-600 text-xl mr-2">✔</span> {item}
                </motion.li>
              ))}
            </ul>

            {/* Start Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startSession}
              className="mt-8 w-full py-4 text-lg font-semibold text-white 
              rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              Start AI Interview 🎥
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <AIInterviewSession session={session} />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}


// import React, { useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import { motion } from "framer-motion";
// import AIInterviewSession from "../components/AIInterviewSession";

// export default function InterviewPage() {
//   const [session, setSession] = useState(null);
//   const { jobId } = useParams();
//   const token = localStorage.getItem("token");

//   const candidateId =
//     JSON.parse(localStorage.getItem("user") || "{}")._id || "candidate_demo";

//   const startSession = async () => {
//     try {
//       const skills = ["React", "Node.js", "MongoDB", "Express"];
//       const summary =
//         "Full-stack developer experienced in building scalable MERN applications.";

//       const res = await axios.post(
//         "http://localhost:3000/api/ai-interview/generate",
//         { candidateId, skills, summary, jobId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (res.data.success) {
//         const cleaned = {
//           ...res.data,
//           questions: res.data.questions.map((q) =>
//             typeof q === "string" ? q : q.question
//           ),
//         };
//         setSession(cleaned);
//       } else {
//         alert("Failed to start interview session.");
//       }
//     } catch (err) {
//       console.error("❌ Interview creation error:", err.response?.data || err.message);
//       alert("Failed to create interview session.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 py-16 px-4 flex justify-center">
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="w-full max-w-4xl"
//       >
//         {/* ---------- HEADER ---------- */}
//         <motion.h2
//           initial={{ opacity: 0, y: -25 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7 }}
//           className="text-5xl font-extrabold text-center mb-10 
//           bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent 
//           drop-shadow-md"
//         >
//           AI-Powered Interview
//         </motion.h2>

//         {/* ---------- BEFORE SESSION START ---------- */}
//         {!session ? (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.6 }}
//             className="
//               bg-white/60 backdrop-blur-2xl 
//               p-10 rounded-3xl shadow-2xl 
//               border border-white/40 
//               relative overflow-hidden
//             "
//           >
//             {/* Floating Decorations */}
//             <motion.div
//               animate={{ opacity: [0.2, 0.4, 0.2], y: [0, -10, 0] }}
//               transition={{ repeat: Infinity, duration: 6 }}
//               className="absolute top-10 right-10 w-20 h-20 bg-blue-300/30 blur-2xl rounded-full"
//             />
//             <motion.div
//               animate={{ opacity: [0.1, 0.3, 0.1], y: [0, 15, 0] }}
//               transition={{ repeat: Infinity, duration: 8 }}
//               className="absolute bottom-10 left-10 w-24 h-24 bg-purple-300/30 blur-2xl rounded-full"
//             />

//             <motion.h4
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.5 }}
//               className="text-2xl font-bold text-gray-800"
//             >
//               Interview for Job ID:{" "}
//               <span className="text-indigo-600">{jobId}</span>
//             </motion.h4>

//             <motion.p
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.2, duration: 0.6 }}
//               className="mt-3 text-gray-600"
//             >
//               Please ensure the following before starting your interview:
//             </motion.p>

//             {/* Checklist */}
//             <ul className="mt-4 space-y-3">
//               {[
//                 "Your camera clearly captures your face",
//                 "Good lighting is available",
//                 "Minimal background noise",
//                 "Stable sitting environment",
//               ].map((item, i) => (
//                 <motion.li
//                   key={i}
//                   initial={{ opacity: 0, x: -15 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: 0.2 + i * 0.1 }}
//                   className="flex items-center text-gray-700 text-lg"
//                 >
//                   <span className="text-green-600 text-xl mr-2">✔</span> {item}
//                 </motion.li>
//               ))}
//             </ul>

//             {/* Start Button */}
//             <motion.button
//               whileHover={{ scale: 1.05, boxShadow: "0px 5px 20px rgba(79,70,229,0.4)" }}
//               whileTap={{ scale: 0.95 }}
//               onClick={startSession}
//               className="
//                 mt-8 w-full py-4 text-lg font-semibold text-white 
//                 rounded-xl shadow-md 
//                 bg-gradient-to-r from-blue-600 to-indigo-600 
//                 hover:from-blue-700 hover:to-indigo-700 transition
//               "
//             >
//               Start Interview 🎥
//             </motion.button>
//           </motion.div>
//         ) : (
//           /* ---------- INTERVIEW SESSION UI ---------- */
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//           >
//             <AIInterviewSession session={session} />
//           </motion.div>
//         )}
//       </motion.div>
//     </div>
//   );
// }



// import React, { useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import AIInterviewSession from "../components/AIInterviewSession";

// export default function InterviewPage() {
//   const [session, setSession] = useState(null);
//   const { jobId } = useParams(); // ✅ capture jobId from URL
//   const token = localStorage.getItem("token");
//   const candidateId = JSON.parse(localStorage.getItem("user") || "{}")._id || "candidate_demo";

//   const startSession = async () => {
//     console.log("🟢 Start Interview clicked for Job:", jobId);
//     try {
//       const skills = ["React", "Node.js", "MongoDB", "Express"];
//       const summary = "Full-stack developer experienced in building scalable MERN applications.";

//       const res = await axios.post(
//         "http://localhost:3000/api/ai-interview/generate",
//         { candidateId, skills, summary, jobId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       console.log("✅ Backend response:", res.data);

//       if (res.data.success) setSession(res.data);
//       else alert("Failed to start interview session.");
//     } catch (err) {
//       console.error("❌ Session start error:", err.response?.data || err.message);
//       alert("Failed to create interview session.");
//     }
//   };

//   return (
//     <div className="container my-4">
//       <h2 className="mb-3">AI-Powered Interview</h2>
//       {!session ? (
//         <div>
//           <p>Interview for Job ID: {jobId}</p>
//           <p>Your interview will be conducted by an AI assistant. Ensure good lighting and visibility.</p>
//           <button className="btn btn-primary" onClick={startSession}>
//             Start Interview
//           </button>
//         </div>
//       ) : (
//         <AIInterviewSession session={session} />
//       )}
//     </div>
//   );
// }




// // src/pages/InterviewPage.jsx
// import React, { useEffect, useRef } from "react";
// import { loadModels, detectFace } from "../components/FaceDetection";
// import InterviewRecorder from "../components/InterviewRecorder";

// const InterviewPage = () => {
//   const videoRef = useRef(null);

//   useEffect(() => {
//     const setup = async () => {
//       try {
//         await loadModels();
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         videoRef.current.srcObject = stream;
//         await videoRef.current.play();

//         setInterval(async () => {
//           const faceVisible = await detectFace(videoRef.current);
//           if (!faceVisible) {
//             console.warn("⚠️ Face not detected! Please stay in view.");
//             alert("Face not detected! Please stay in view.");
//           }
//         }, 10000); // every 10 seconds
//       } catch (error) {
//         console.error("Error accessing webcam:", error);
//         alert("Cannot access webcam. Please allow camera permissions.");
//       }
//     };
//     setup();
//   }, []);

//   return (
//     <div className="p-6 space-y-6 text-center">
//       <h1 className="text-2xl font-bold">🎯 AI-Proctored Interview</h1>
//       <video
//         ref={videoRef}
//         width="400"
//         height="300"
//         autoPlay
//         muted
//         className="border rounded-lg shadow-md mx-auto"
//       />
//       <InterviewRecorder />
//     </div>
//   );
// };

// export default InterviewPage;
