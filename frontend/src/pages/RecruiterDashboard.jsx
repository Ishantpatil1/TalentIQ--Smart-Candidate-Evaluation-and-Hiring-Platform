import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import JobForm from "../components/JobForm";
import JobList from "../components/JobList";
import RankedCandidates from "../components/RankedCandidates";
import RecruiterHomeDashboard from "../components/RecruiterHomeDashboard";
import Footer from "../components/Footer";

// --------------------- SIDEBAR BUTTONS ---------------------
const menuItems = [
  { key: "home", label: "Home", icon: "🏠" },
  { key: "create", label: "Create Job", icon: "➕" },
  { key: "list", label: "Job Listings", icon: "📋" },
  { key: "ranked", label: "Ranked Candidates", icon: "⭐" },
  { key: "interview", label: "Interview", icon: "🎥" },
];

export default function RecruiterDashboard() {
  const [active, setActive] = useState("home");
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [shortlisted, setShortlisted] = useState([]);

  const jobListRef = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const recruiter = JSON.parse(localStorage.getItem("user") || "{}");

  /* ---------------- LOAD JOBS ---------------- */
  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await axios.get("http://localhost:3000/api/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(res.data);
      } catch (err) {
        console.error("Failed to load jobs");
      }
    }
    loadJobs();
  }, [token]);

  /* ---------------- LOAD SHORTLISTED ---------------- */
  const loadShortlisted = async (jobId) => {
    setSelectedJob(jobId);
    try {
      const res = await axios.get(
        `http://localhost:3000/api/applications/job/${jobId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // filter shortlisted only (frontend safe filter)
      const shortlistedApps = res.data.filter(
        (a) => a.status === "shortlisted"
      );
      setShortlisted(shortlistedApps);
    } catch (err) {
      console.error("Failed to load shortlisted candidates");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      {/* ================= SIDEBAR ================= */}
      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-64 bg-white/80 backdrop-blur-xl border-r border-blue-100 shadow-xl p-5 flex flex-col"
      >
        <h2 className="text-2xl font-bold text-blue-700 mb-8 text-center">
          Recruiter Panel
        </h2>

        <div className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <motion.button
              key={item.key}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActive(item.key)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition ${
                active === item.key
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                  : "bg-white/70 text-gray-700 hover:bg-white shadow-sm"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </motion.button>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-blue-100 text-center text-sm text-gray-500">
          TalentIQ Recruiter • 2025
        </div>
      </motion.aside>

      {/* ================= MAIN ================= */}
      <div className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-3xl font-bold text-blue-700">
            {menuItems.find((m) => m.key === active)?.label}
          </h1>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-blue-100"
          >
            {active === "home" && <RecruiterHomeDashboard />}
            {active === "create" && <JobForm />}
            {active === "list" && <JobList ref={jobListRef} />}
            {active === "ranked" && <RankedCandidates />}

            {/* ================= INTERVIEW TAB ================= */}
            {active === "interview" && (
              <div className="space-y-6">
                {/* JOB SELECT */}
                <select
                  className="p-3 rounded-xl border w-full"
                  onChange={(e) => loadShortlisted(e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Job
                  </option>
                  {jobs.map((job) => (
                    <option key={job._id} value={job._id}>
                      {job.title}
                    </option>
                  ))}
                </select>

                {/* SHORTLISTED CANDIDATES */}
                {shortlisted.length === 0 && selectedJob && (
                  <p className="text-center text-gray-500">
                    No shortlisted candidates for this job.
                  </p>
                )}

                {shortlisted.map((app) => (
                  <div
                    key={app._id}
                    className="p-4 rounded-xl bg-white shadow flex justify-between items-center"
                  >
                    <div>
                      <div className="font-semibold">
                        {app.candidate?.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {app.candidate?.email}
                      </div>
                    </div>

                    <button
                      onClick={async () => {
                        const res = await axios.post(
                          "http://localhost:3000/api/interviews/create",
                          {
                            jobId: selectedJob,
                            candidateId: app.candidate._id,
                            recruiterId: recruiter._id,
                          },
                          {
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          }
                        );

                        localStorage.setItem(
                          "liveSessionId",
                          res.data.sessionId
                        );
                        navigate(`/interview/live/${res.data.sessionId}`);
                      }}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold"
                    >
                      Start Live Interview 🎥
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
    </div>
  );
}


// import React, { useState, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// import JobForm from "../components/JobForm";
// import JobList from "../components/JobList";
// import RankedCandidates from "../components/RankedCandidates";
// import RecruiterHomeDashboard from "../components/RecruiterHomeDashboard";

// // --------------------- SIDEBAR BUTTONS ---------------------
// const menuItems = [
//   { key: "home", label: "Home", icon: "🏠" },
//   { key: "create", label: "Create Job", icon: "➕" },
//   { key: "list", label: "Job Listings", icon: "📋" },
//   { key: "ranked", label: "Ranked Candidates", icon: "⭐" },
//   { key: "interview", label: "Interview", icon: "🎥" },
// ];

// export default function RecruiterDashboard() {
//   const [active, setActive] = useState("home");
//   const jobListRef = useRef(null);
//   const navigate = useNavigate();

//   const handleJobCreated = () => {
//     setActive("list");
//     if (jobListRef.current) {
//       jobListRef.current.fetchJobs();
//     }
//   };

//   const handleStartInterview = async () => {
//   try {
//     const recruiter = JSON.parse(localStorage.getItem("user") || "{}");

//     // TEMP DEMO: hardcoded candidateId (replace later with real selection)
//     const candidateId = localStorage.getItem("selectedCandidateId");

//     if (!candidateId) {
//       alert("No candidate selected for interview");
//       return;
//     }

//     const res = await axios.post(
//       "http://localhost:3000/api/interviews/create",
//       {
//         recruiterId: recruiter._id,
//         candidateId: candidateId,
//         jobId: "demo", // REQUIRED by backend (can be real jobId later)
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       }
//     );

//     if (res.data?.sessionId) {
//       localStorage.setItem("liveSessionId", res.data.sessionId);
//       navigate(`/interview/live/${res.data.sessionId}`);
//     }
//   } catch (err) {
//     console.error(err);
//     alert("Failed to start live interview");
//   }
// };



//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
//       {/* =====================================================
//                 LEFT SIDEBAR
//       ===================================================== */}
//       <motion.aside
//         initial={{ x: -80, opacity: 0 }}
//         animate={{ x: 0, opacity: 1 }}
//         transition={{ duration: 0.4 }}
//         className="w-64 bg-white/80 backdrop-blur-xl border-r border-blue-100 shadow-xl p-5 flex flex-col"
//       >
//         <h2 className="text-2xl font-bold text-blue-700 mb-8 text-center">
//           Recruiter Panel
//         </h2>

//         <div className="flex flex-col gap-2">
//           {menuItems.map((item) => (
//             <motion.button
//               key={item.key}
//               whileHover={{ scale: 1.03 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setActive(item.key)}
//               className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition ${active === item.key
//                   ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
//                   : "bg-white/70 text-gray-700 hover:bg-white shadow-sm"
//                 }`}
//             >
//               <span className="text-lg">{item.icon}</span>
//               {item.label}
//             </motion.button>
//           ))}
//         </div>

//         {/* FOOTER */}
//         <div className="mt-auto pt-6 border-t border-blue-100 text-center text-sm text-gray-500">
//           TalentIQ Recruiter • 2025
//         </div>
//       </motion.aside>

//       {/* =====================================================
//                 RIGHT MAIN CONTENT AREA
//       ===================================================== */}
//       <div className="flex-1 p-8">
//         {/* ---------------- TOP BAR ---------------- */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="flex justify-between items-center mb-8"
//         >
//           <h1 className="text-3xl font-bold text-blue-700">
//             {menuItems.find((m) => m.key === active)?.label}
//           </h1>

//           {/* TOPBAR ACTIONS */}
//           <div className="flex items-center gap-5">
//             {/* Notifications */}
//             <motion.div
//               whileHover={{ scale: 1.15 }}
//               className="cursor-pointer text-blue-700 text-2xl"
//             >
//               🔔
//             </motion.div>

//             {/* Profile Badge */}
//             <motion.div
//               whileHover={{ scale: 1.05 }}
//               className="px-4 py-2 bg-white/70 backdrop-blur-md rounded-full shadow flex items-center gap-2 cursor-pointer"
//             >
//               <span className="text-blue-700 font-semibold">Recruiter</span>
//               <img
//                 src="https://i.ibb.co/4pDNDk1/avatar.png"
//                 alt="profile"
//                 className="w-8 h-8 rounded-full shadow"
//               />
//             </motion.div>
//           </div>
//         </motion.div>

//         {/* ---------------- MAIN CONTENT SWITCHER ---------------- */}
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={active}
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             transition={{ duration: 0.25 }}
//             className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-blue-100"
//           >
//             {active === "home" && <RecruiterHomeDashboard />}
//             {active === "create" && <JobForm onJobCreated={handleJobCreated} />}
//             {active === "list" && <JobList ref={jobListRef} />}
//             {active === "ranked" && <RankedCandidates />}

//             {active === "interview" && (
//               <div className="text-center py-10">
//                 <p className="text-gray-700 text-lg">
//                   Conduct live AI-proctored interviews with candidates.
//                 </p>
//                 <motion.button
//                   whileHover={{ scale: 1.04 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={handleStartInterview}
//                   className="mt-5 px-6 py-3 rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg text-lg font-semibold"
//                 >
//                   Start Interview 🎥
//                 </motion.button>
//               </div>
//             )}
//           </motion.div>
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }



// OLD

// import React, { useState, useRef } from "react";
// import { Container, Card, Tabs, Tab, Button } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import JobForm from "../components/JobForm";
// import JobList from "../components/JobList";
// import RankedCandidates from "../components/RankedCandidates";

// export default function RecruiterDashboard() {
//   const [activeKey, setActiveKey] = useState("create");
//   const jobListRef = useRef(null);
//   const navigate = useNavigate();

//   const handleJobCreated = () => {
//     setActiveKey("list");
//     if (jobListRef.current) {
//       jobListRef.current.fetchJobs(); // refresh job list
//     }
//   };

//   const handleStartInterview = () => {
//     navigate("/interview");
//   };

//   return (
//     <Container className="my-4">
//       <Card className="shadow p-4">
//         <h2 className="text-center mb-4">Recruiter Dashboard</h2>

//         <Tabs
//           activeKey={activeKey}
//           onSelect={(k) => setActiveKey(k)}
//           className="mb-3"
//           justify
//         >
//           <Tab eventKey="create" title="➕ Create Job">
//             <JobForm onJobCreated={handleJobCreated} />
//           </Tab>

//           <Tab eventKey="list" title="📋 Job Listings">
//             <JobList ref={jobListRef} />
//           </Tab>

//           <Tab eventKey="ranked" title="⭐ Ranked Candidates">
//             <RankedCandidates />
//           </Tab>

//           {/* 🎥 New Interview Tab */}
//           <Tab eventKey="interview" title="🎥 Interview">
//             <div className="text-center mt-4">
//               <p>Conduct live AI-proctored interviews with candidates.</p>
//               <Button
//                 variant="primary"
//                 onClick={handleStartInterview}
//                 className="px-4 py-2"
//               >
//                 Start Interview
//               </Button>
//             </div>
//           </Tab>
//         </Tabs>
//       </Card>
//     </Container>
//   );
// }
