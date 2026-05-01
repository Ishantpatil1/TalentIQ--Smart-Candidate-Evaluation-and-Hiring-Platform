import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import TopCandidatesFilter from "../components/TopCandidatesFilter";

export default function RecruiterApplicationsPage() {
  const { jobId } = useParams();
  const token = localStorage.getItem("token");

  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [finalScores, setFinalScores] = useState({}); // ⭐ NEW
  const [loading, setLoading] = useState(true);
  const [filteredApplications, setFilteredApplications] = useState(null);
  const [rankMap, setRankMap] = useState({});
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  /* -----------------------------
      FETCH APPLICATIONS
  ----------------------------- */
  const fetchApplications = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/applications/job/${jobId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplications(res.data);
    } catch {
      setMsg("❌ Failed to load applications");
    }
  };

  /* -----------------------------
      FETCH INTERVIEWS
  ----------------------------- */
  const fetchInterviews = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/ai-interview/job/${jobId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInterviews(res.data || []);
    } catch {
      console.log("No interviews found");
    }
  };

  // useEffect(() => {
  //   Promise.all([fetchApplications(), fetchInterviews()]).finally(() =>
  //     setLoading(false)
  //   );
  // }, []);

  useEffect(() => {
    const loadAll = async () => {
      await Promise.all([fetchApplications(), fetchInterviews()]);

      // ✅ AUTO LOAD FINAL SCORES
      const appsRes = await axios.get(
        `http://localhost:3000/api/applications/job/${jobId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const apps = appsRes.data;

      for (let app of apps) {
        if (!app.candidate?._id) continue;

        try {
          const res = await axios.get(
            `http://localhost:3000/api/final-score/${jobId}/${app.candidate._id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setFinalScores((prev) => ({
            ...prev,
            [app.candidate._id]: res.data,
          }));
        } catch (err) {
          console.log("Score fetch failed for", app.candidate?._id);
        }
      }

      // New
      //  ✅ FETCH AI RANKING
      try {
        const rankRes = await axios.get(
          `http://localhost:3000/api/ai/rank/${jobId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const map = {};

        (rankRes.data.ranked || []).forEach((c) => {
          const emailKey = c.email?.toLowerCase();

          if (!emailKey) return;

          map[emailKey] = c.score;
        });

        console.log("✅ FINAL RANK MAP:", map);

        setRankMap(map);

      } catch (err) {
        console.log("❌ Ranking fetch failed:", err);
      }

      setLoading(false);
    };

    loadAll();
  }, []);

  /* -----------------------------
      FINAL SCORE (NEW)
  ----------------------------- */
  const viewFinalScore = async (candidateId) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/final-score/${jobId}/${candidateId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFinalScores((prev) => ({
        ...prev,
        [candidateId]: res.data,
      }));
    } catch {
      alert("❌ Failed to load final score");
    }
  };

  /* -----------------------------
      UPDATE STATUS
  ----------------------------- */
  const updateStatus = async (appId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:3000/api/applications/${appId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setApplications((prev) =>
        prev.map((app) =>
          app._id === appId ? { ...app, status: newStatus } : app
        )
      );
      setMsg("✅ Status updated");
    } catch {
      setMsg("❌ Failed to update status");
    }
  };

  const generateFeedback = async (candidateId) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/ai/full-feedback/${jobId}/${candidateId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Feedback Generated Successfully");
    } catch (err) {
      console.log(err);
      alert("❌ Failed to generate feedback");
    }
  };

  if (loading)
    return (
      <p className="text-center text-indigo-600 text-lg">
        Loading applications…
      </p>
    );

  const displayApplications = filteredApplications || applications;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-6">
      <div className="max-w-7xl mx-auto">

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-indigo-700 text-center mb-6"
        >
          Applications & Interviews for Job ID: {jobId}
        </motion.h1>

        {msg && (
          <div className="p-3 text-center rounded-lg shadow-md mb-6 bg-green-100 text-green-800">
            {msg}
          </div>
        )}

        <TopCandidatesFilter
          applications={applications}
          finalScores={finalScores}
          rankMap={rankMap}   // ⭐ NEW
          onFilter={(data) => setFilteredApplications(data)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {displayApplications.map((app, index) => {
            // const interview = interviews.find(
            //   (i) => i.candidateId === app.candidate?._id
            // );

            const interview = interviews.find(
              (i) =>
                i.candidateId?.toString() === app.candidate?._id?.toString() &&
                i.proctoringData &&
                i.proctoringData.length > 0
            );

            const score = finalScores[app.candidate?._id];

            return (
              <motion.div
                key={app._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-2xl shadow-xl p-6 border border-indigo-100"
              >
                <h3 className="text-xl font-semibold text-indigo-700">
                  {app.candidate?.name}
                </h3>
                <p className="text-gray-700">{app.candidate?.email}</p>

                <p className="mt-3 text-gray-500 text-sm">
                  {app.note || "No note provided"}
                </p>

                <div className="mt-4">
                  {app.resumeUrl ? (
                    <a
                      href={`http://localhost:3000${app.resumeUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 font-medium hover:underline"
                    >
                      📄 View Resume
                    </a>
                  ) : (
                    <span className="text-gray-400">No resume</span>
                  )}
                </div>

                <p className="mt-4 text-gray-600 text-sm">
                  <strong>AI Summary:</strong>
                  <br />
                  {app.parsedResume?.summary || "—"}
                </p>

                {/* ⭐ FINAL SCORE SECTION (NEW) */}
                <div className="mt-5 border-t pt-4">
                  {!score ? (
                    <button
                      onClick={() => viewFinalScore(app.candidate?._id)}
                      className="w-full px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold"
                    >
                      📊 View Final Score
                    </button>
                  ) : (
                    <div className="text-sm text-gray-700 space-y-1">
                      <p>Resume Fit: <b>{score.resumeFit}</b></p>
                      <p>Test Score: <b>{score.testScore ?? "—"}</b></p>
                      {/* <p>AI Interview: <b>{score.aiInterviewScore}</b></p> */}
                      <p>
                        AI Interview:{" "}
                        <b>
                          {score.aiInterviewScore !== null ? score.aiInterviewScore : "Not Completed"}
                        </b>
                      </p>
                      <hr />
                      <p className="text-lg font-bold text-indigo-700">
                        FINAL SCORE: {score.finalScore} ⭐
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <label className="font-semibold text-gray-700">Status:</label>
                  <select
                    value={app.status}
                    onChange={(e) =>
                      updateStatus(app._id, e.target.value)
                    }
                    className="mt-1 w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="applied">Applied</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="hired">Hired</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {interview && (
                  <button
                    onClick={() =>
                      navigate(`/recruiter/interview/${interview._id}`)
                    }
                    className="mt-4 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold"
                  >
                    🎥 View Interview Recordings
                  </button>
                )}

                <button
                  onClick={() => generateFeedback(app.candidate?._id)}
                  className="mt-3 w-full px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold"
                >
                  🧠 Generate Feedback
                </button>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}







// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { useParams, useNavigate } from "react-router-dom";
// import TopCandidatesFilter from "../components/TopCandidatesFilter";

// export default function RecruiterApplicationsPage() {
//   const { jobId } = useParams();
//   const token = localStorage.getItem("token");

//   const [applications, setApplications] = useState([]);
//   const [interviews, setInterviews] = useState([]);
//   const [finalScores, setFinalScores] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [filteredApplications, setFilteredApplications] = useState(null);
//   const [rankMap, setRankMap] = useState({});
//   const [msg, setMsg] = useState("");
//   const navigate = useNavigate();

//   /* -----------------------------
//       FETCH APPLICATIONS
//   ----------------------------- */
//   const fetchApplications = async () => {
//     try {
//       const res = await axios.get(
//         `http://localhost:3000/api/applications/job/${jobId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setApplications(res.data);

//       // ✅ LOG ADDED
//       // console.log("🔥 APPLICATION SAMPLE:", res.data[0]);

//     } catch {
//       setMsg("❌ Failed to load applications");
//     }
//   };

//   /* -----------------------------
//       FETCH INTERVIEWS
//   ----------------------------- */
//   const fetchInterviews = async () => {
//     try {
//       const res = await axios.get(
//         `http://localhost:3000/api/ai-interview/job/${jobId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setInterviews(res.data || []);
//     } catch {
//       console.log("No interviews found");
//     }
//   };

//   useEffect(() => {
//     const loadAll = async () => {
//       await Promise.all([fetchApplications(), fetchInterviews()]);

//       const appsRes = await axios.get(
//         `http://localhost:3000/api/applications/job/${jobId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const apps = appsRes.data;

//       for (let app of apps) {
//         if (!app.candidate?._id) continue;

//         try {
//           const res = await axios.get(
//             `http://localhost:3000/api/final-score/${jobId}/${app.candidate._id}`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           );

//           setFinalScores((prev) => ({
//             ...prev,
//             [app.candidate._id]: res.data,
//           }));
//         } catch (err) {
//           console.log("Score fetch failed for", app.candidate?._id);
//         }
//       }

//       // ✅ FETCH AI RANKING
//       try {
//         const rankRes = await axios.get(
//           `http://localhost:3000/api/ai/rank/${jobId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         const map = {};

//         (rankRes.data.ranked || []).forEach((c) => {
//           const emailKey = c.email?.toLowerCase();

//           if (!emailKey) return;

//           map[emailKey] = c.score;
//         });

//         console.log("✅ FINAL RANK MAP:", map);

//         setRankMap(map);

//       } catch (err) {
//         console.log("❌ Ranking fetch failed:", err);
//       }

//       setLoading(false);
//     };

//     loadAll();
//   }, []);

//   const viewFinalScore = async (candidateId) => {
//     try {
//       const res = await axios.get(
//         `http://localhost:3000/api/final-score/${jobId}/${candidateId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setFinalScores((prev) => ({
//         ...prev,
//         [candidateId]: res.data,
//       }));
//     } catch {
//       alert("❌ Failed to load final score");
//     }
//   };

//   const updateStatus = async (appId, newStatus) => {
//     try {
//       await axios.put(
//         `http://localhost:3000/api/applications/${appId}`,
//         { status: newStatus },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setApplications((prev) =>
//         prev.map((app) =>
//           app._id === appId ? { ...app, status: newStatus } : app
//         )
//       );
//       setMsg("✅ Status updated");
//     } catch {
//       setMsg("❌ Failed to update status");
//     }
//   };

//   if (loading)
//     return (
//       <p className="text-center text-indigo-600 text-lg">
//         Loading applications…
//       </p>
//     );

//   const displayApplications = filteredApplications || applications;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-6">
//       <div className="max-w-7xl mx-auto">

//         <motion.h1
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-4xl font-bold text-indigo-700 text-center mb-6"
//         >
//           Applications & Interviews for Job ID: {jobId}
//         </motion.h1>

//         {msg && (
//           <div className="p-3 text-center rounded-lg shadow-md mb-6 bg-green-100 text-green-800">
//             {msg}
//           </div>
//         )}

//         <TopCandidatesFilter
//           applications={applications}
//           finalScores={finalScores}
//           rankMap={rankMap}
//           onFilter={(data) => setFilteredApplications(data)}
//         />

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
//           {displayApplications.map((app, index) => {

//             const interview = interviews.find(
//               (i) =>
//                 i.candidateId?.toString() === app.candidate?._id?.toString() &&
//                 i.proctoringData &&
//                 i.proctoringData.length > 0
//             );

//             const score = finalScores[app.candidate?._id];

//             return (
//               <motion.div
//                 key={app._id}
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.05 }}
//                 whileHover={{ scale: 1.03 }}
//                 className="bg-white rounded-2xl shadow-xl p-6 border border-indigo-100"
//               >
//                 <h3 className="text-xl font-semibold text-indigo-700">
//                   {app.candidate?.name}
//                 </h3>
//                 <p className="text-gray-700">{app.candidate?.email}</p>

//                 <p className="mt-3 text-gray-500 text-sm">
//                   {app.note || "No note provided"}
//                 </p>

//                 <div className="mt-4">
//                   {app.resumeUrl ? (
//                     <a
//                       href={`http://localhost:3000${app.resumeUrl}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-600 font-medium hover:underline"
//                     >
//                       📄 View Resume
//                     </a>
//                   ) : (
//                     <span className="text-gray-400">No resume</span>
//                   )}
//                 </div>

//                 <p className="mt-4 text-gray-600 text-sm">
//                   <strong>AI Summary:</strong>
//                   <br />
//                   {app.parsedResume?.summary || "—"}
//                 </p>

//                 <div className="mt-5 border-t pt-4">
//                   {!score ? (
//                     <button
//                       onClick={() => viewFinalScore(app.candidate?._id)}
//                       className="w-full px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold"
//                     >
//                       📊 View Final Score
//                     </button>
//                   ) : (
//                     <div className="text-sm text-gray-700 space-y-1">
//                       <p>Resume Fit: <b>{score.resumeFit}</b></p>
//                       <p>Test Score: <b>{score.testScore ?? "—"}</b></p>
//                       <p>
//                         AI Interview:{" "}
//                         <b>
//                           {score.aiInterviewScore !== null ? score.aiInterviewScore : "Not Completed"}
//                         </b>
//                       </p>
//                       <hr />
//                       <p className="text-lg font-bold text-indigo-700">
//                         FINAL SCORE: {score.finalScore} ⭐
//                       </p>
//                     </div>
//                   )}
//                 </div>

//                 <div className="mt-6">
//                   <label className="font-semibold text-gray-700">Status:</label>
//                   <select
//                     value={app.status}
//                     onChange={(e) =>
//                       updateStatus(app._id, e.target.value)
//                     }
//                     className="mt-1 w-full px-3 py-2 border rounded-lg"
//                   >
//                     <option value="applied">Applied</option>
//                     <option value="shortlisted">Shortlisted</option>
//                     <option value="hired">Hired</option>
//                     <option value="rejected">Rejected</option>
//                   </select>
//                 </div>

//                 {interview && (
//                   <button
//                     onClick={() =>
//                       navigate(`/recruiter/interview/${interview._id}`)
//                     }
//                     className="mt-4 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold"
//                   >
//                     🎥 View Interview Recordings
//                   </button>
//                 )}
//               </motion.div>
//             );
//           })}
//         </div>

//         <div className="text-center mt-10">
//           <button
//             onClick={() => window.history.back()}
//             className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold"
//           >
//             ← Back to Dashboard
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


