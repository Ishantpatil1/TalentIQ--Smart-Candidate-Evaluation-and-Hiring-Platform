// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Form, Button, Card, Spinner, Alert, ProgressBar } from "react-bootstrap";
// import { motion, AnimatePresence } from "framer-motion";

// export default function CandidateProfile() {
//   const [profile, setProfile] = useState({
//     name: "",
//     email: "",
//     education: [],
//     skills: [],
//     experience: [],
//     parsedData: {},
//     resumeUrl: null,
//   });

//   const [skillsInput, setSkillsInput] = useState("");
//   const [experienceInput, setExperienceInput] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [msg, setMsg] = useState("");
//   const [resumeFile, setResumeFile] = useState(null);

//   const token = localStorage.getItem("token");

//   // ---------------- FETCH PROFILE ----------------
//   useEffect(() => {
//     async function fetchProfile() {
//       try {
//         const res = await axios.get("http://localhost:3000/api/candidate/profile", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const data = res.data;

//         setProfile({
//           ...data,
//           education: Array.isArray(data.education) ? data.education : [],
//           skills: Array.isArray(data.skills) ? data.skills : [],
//           experience: Array.isArray(data.experience) ? data.experience : [],
//           parsedData: data.parsedData || {},
//         });

//         setSkillsInput(data.skills?.join(", ") || "");
//         setExperienceInput(data.experience?.map((ex) => ex.role).join(", ") || "");
//       } catch (err) {
//         setMsg(err.response?.data?.message || "Sync failed");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchProfile();
//   }, [token]);

//   // ---------------- PROFILE COMPLETION LOGIC ----------------
//   const calculateProfileCompletion = () => {
//     let score = 0;
//     if (profile.name && profile.email) score += 20;
//     if (profile.education?.length > 0) score += 30;
//     if (profile.skills?.length > 0) score += 20;
//     if (profile.experience?.length > 0) score += 10;
//     if (profile.resumeUrl) score += 20;
//     return score;
//   };

//   const completion = calculateProfileCompletion();

//   // ---------------- UPDATE PROFILE ----------------
//   const handleUpdateProfile = async (e) => {
//     e.preventDefault();
//     setMsg("");

//     const updatedSkills = skillsInput.split(",").map((s) => s.trim()).filter((s) => s);
//     const updatedExperience = experienceInput.split(",")
//       .map((r) => ({ role: r.trim() }))
//       .filter((r) => r.role);

//     if (profile.education.length === 0)
//       return setMsg("Academic records required.");

//     for (let edu of profile.education) {
//       if (!edu.degree.trim() || !edu.institution.trim() || !edu.year.trim())
//         return setMsg("Please complete all academic fields.");
//     }

//     if (updatedSkills.length === 0)
//       return setMsg("Skills are required for matching.");

//     try {
//       const res = await axios.put(
//         "http://localhost:3000/api/candidate/profile",
//         {
//           education: profile.education,
//           skills: updatedSkills,
//           experience: updatedExperience,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setMsg(res.data.message);
//       setProfile({ ...profile, skills: updatedSkills, experience: updatedExperience });
//     } catch (err) {
//       setMsg(err.response?.data?.message || "Sync error");
//     }
//   };

//   // ---------------- RESUME UPLOAD ----------------
//   const handleResumeUpload = async (e) => {
//     e.preventDefault();
//     if (!resumeFile) return setMsg("Select file.");

//     const formData = new FormData();
//     formData.append("resume", resumeFile);

//     try {
//       const res = await axios.post(
//         "http://localhost:3000/api/candidate/upload-resume",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setMsg(res.data.message);
//       setProfile(res.data.candidate);
//     } catch (err) {
//       setMsg(err.response?.data?.message || "Upload failed");
//     }
//   };

//   // ---------------- EDUCATION HANDLERS ----------------
//   const addEducation = () => {
//     setProfile({
//       ...profile,
//       education: [...profile.education, { degree: "", institution: "", year: "" }],
//     });
//   };

//   const updateEducation = (index, field, value) => {
//     const updated = [...profile.education];
//     updated[index][field] = value;
//     setProfile({ ...profile, education: updated });
//   };

//   const removeEducation = (index) => {
//     const updated = profile.education.filter((_, i) => i !== index);
//     setProfile({ ...profile, education: updated });
//   };

//   if (loading) return (
//     <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
//       <Spinner animation="grow" variant="dark" />
//     </div>
//   );

//   return (
//     <div className="container-fluid py-4 px-md-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4 }}
//       >
//         {/* --- HERO HEADER --- */}
//         <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end mb-5 gap-4">
//           <div>
//             <h1 className="fw-black tracking-tighter text-dark mb-1" style={{ fontSize: "2.5rem" }}>
//               Profile <span style={{ color: "#6366f1" }}>Intelligence</span>
//             </h1>
//             <p className="text-muted fw-medium m-0">Synchronize your credentials for precise matching.</p>
//           </div>
          
//           <div className="bg-white p-3 rounded-4 shadow-sm border d-flex align-items-center gap-4" style={{ minWidth: "320px" }}>
//             <div style={{ flex: 1 }}>
//               <div className="d-flex justify-content-between mb-1">
//                 <span className="fw-bold text-muted small uppercase ls-1" style={{ fontSize: "9px" }}>INTEGRITY SCORE</span>
//                 <span className="fw-black text-dark small">{completion}%</span>
//               </div>
//               <ProgressBar
//                 now={completion}
//                 variant={completion < 80 ? "warning" : "success"}
//                 className="rounded-pill"
//                 style={{ height: "6px", background: "#f1f5f9" }}
//               />
//             </div>
//             <div className="fs-3">💎</div>
//           </div>
//         </div>

//         <AnimatePresence>
//           {msg && (
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
//               <Alert variant={msg.includes("fail") || msg.includes("error") ? "danger" : "dark"} className="rounded-4 border-0 shadow-sm text-center fw-bold py-3 mb-4">
//                 {msg}
//               </Alert>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         <div className="row g-4">
//           {/* --- LEFT COLUMN: CORE DATA --- */}
//           <div className="col-xl-8">
//             <Card className="border-0 shadow-sm rounded-5 p-4 p-md-5 bg-white h-100">
//               <Form onSubmit={handleUpdateProfile}>
//                 <div className="row g-4 mb-5">
//                   <div className="col-md-6">
//                     <Form.Label className="fw-black text-muted small ls-1 mb-2" style={{ fontSize: "10px" }}>ACCOUNT NAME</Form.Label>
//                     <Form.Control type="text" value={profile.name} readOnly className="rounded-4 bg-light border-0 py-3 px-4 fw-bold" />
//                   </div>
//                   <div className="col-md-6">
//                     <Form.Label className="fw-black text-muted small ls-1 mb-2" style={{ fontSize: "10px" }}>IDENTIFIER</Form.Label>
//                     <Form.Control type="email" value={profile.email} readOnly className="rounded-4 bg-light border-0 py-3 px-4 fw-bold" />
//                   </div>
//                 </div>

//                 <div className="mb-4 d-flex justify-content-between align-items-center">
//                   <h5 className="fw-black m-0 tracking-tight text-dark">Academic Credentials</h5>
//                   <Button variant="light" size="sm" className="rounded-pill px-3 fw-black border shadow-sm" style={{ fontSize: "10px" }} onClick={addEducation}>
//                     + ADD RECORD
//                   </Button>
//                 </div>

//                 <div className="mb-5">
//                   {profile.education.map((edu, idx) => (
//                     <motion.div key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-4 border bg-white mb-3 shadow-sm position-relative transition-all hover:shadow-md">
//                       <div className="row g-3">
//                         <div className="col-md-5">
//                           <Form.Label className="fw-bold text-muted small" style={{ fontSize: "10px" }}>DEGREE</Form.Label>
//                           <Form.Control type="text" value={edu.degree} onChange={(e) => updateEducation(idx, "degree", e.target.value)} className="rounded-3 border-0 bg-light py-2 px-3 fw-semibold text-dark shadow-inner" placeholder="B.Tech Computer Science" />
//                         </div>
//                         <div className="col-md-5">
//                           <Form.Label className="fw-bold text-muted small" style={{ fontSize: "10px" }}>INSTITUTION</Form.Label>
//                           <Form.Control type="text" value={edu.institution} onChange={(e) => updateEducation(idx, "institution", e.target.value)} className="rounded-3 border-0 bg-light py-2 px-3 fw-semibold text-dark shadow-inner" placeholder="University Name" />
//                         </div>
//                         <div className="col-md-2">
//                           <Form.Label className="fw-bold text-muted small" style={{ fontSize: "10px" }}>YEAR</Form.Label>
//                           <Form.Control type="text" value={edu.year} onChange={(e) => updateEducation(idx, "year", e.target.value)} className="rounded-3 border-0 bg-light py-2 px-3 fw-semibold text-dark shadow-inner" placeholder="2025" />
//                         </div>
//                       </div>
//                       <span className="position-absolute top-0 end-0 m-2 text-danger fw-black pointer" style={{ fontSize: "9px", cursor: "pointer", opacity: 0.6 }} onClick={() => removeEducation(idx)}>REMOVE</span>
//                     </motion.div>
//                   ))}
//                 </div>

//                 <div className="row g-4">
//                   <div className="col-md-6">
//                     <Form.Label className="fw-black text-muted small ls-1 mb-2" style={{ fontSize: "10px" }}>EXPERTISE</Form.Label>
//                     <Form.Control as="textarea" rows={3} value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} className="rounded-4 border-light p-3 shadow-inner bg-light fw-medium text-dark" placeholder="React, Python, Node.js..." />
//                   </div>
//                   <div className="col-md-6">
//                     <Form.Label className="fw-black text-muted small ls-1 mb-2" style={{ fontSize: "10px" }}>CORE ROLES</Form.Label>
//                     <Form.Control as="textarea" rows={3} value={experienceInput} onChange={(e) => setExperienceInput(e.target.value)} className="rounded-4 border-light p-3 shadow-inner bg-light fw-medium text-dark" placeholder="Frontend Developer, Project Lead..." />
//                   </div>
//                 </div>

//                 <Button variant="dark" type="submit" className="w-100 rounded-pill py-3 mt-5 fw-black ls-1 shadow-lg" style={{ background: "#111", fontSize: "14px", letterSpacing: "1px" }}>
//                   SYNC PROFILE DATA
//                 </Button>
//               </Form>
//             </Card>
//           </div>

//           {/* --- RIGHT COLUMN: PORTFOLIO & INSIGHTS --- */}
//           <div className="col-xl-4">
//             <div className="d-flex flex-column gap-4 h-100">
//               {/* UPLOAD BOX */}
//               <Card className="border-0 shadow-sm rounded-5 p-4 bg-white text-center">
//                 <h6 className="fw-black text-dark mb-3 ls-1" style={{ fontSize: "11px" }}>PORTFOLIO SUBMISSION</h6>
//                 <div className="p-4 rounded-4 border-dashed border-2 bg-light mb-3">
//                   <div className="fs-2 mb-2">📁</div>
//                   <Form onSubmit={handleResumeUpload}>
//                     <Form.Control type="file" accept=".pdf" onChange={(e) => setResumeFile(e.target.files[0])} className="rounded-3 border-0 shadow-sm mb-3 small py-2 bg-white" />
//                     <Button variant="outline-dark" type="submit" className="rounded-pill w-100 py-2 fw-black shadow-sm" style={{ fontSize: "11px" }}>
//                       UPDATE DOCUMENT
//                     </Button>
//                   </Form>
//                 </div>
//               </Card>

//               {/* INSIGHTS BENTO */}
//               <Card className="border-0 shadow-sm rounded-5 p-4 bg-dark text-white flex-grow-1 overflow-hidden position-relative">
//                 <div className="position-absolute top-0 end-0 p-4 opacity-10 fs-1">🧬</div>
//                 <h6 className="fw-black text-secondary mb-4 ls-1" style={{ fontSize: "11px" }}>INTELLIGENCE SUMMARY</h6>
                
//                 {profile.parsedData && Object.keys(profile.parsedData).length > 0 ? (
//                   <div className="d-flex flex-column gap-4">
//                     <div>
//                       <span className="fw-bold text-secondary uppercase ls-1" style={{ fontSize: "9px" }}>EXECUTIVE OVERVIEW</span>
//                       <p className="small mt-2 text-white-50 fw-medium" style={{ lineHeight: "1.6" }}>{profile.parsedData.summary || "Summary data synchronized from portfolio."}</p>
//                     </div>

//                     <div>
//                       <span className="fw-bold text-secondary uppercase ls-1" style={{ fontSize: "9px" }}>VERIFIED TECH STACK</span>
//                       <div className="mt-2 d-flex flex-wrap gap-2">
//                         {profile.parsedData.extractedSkills?.map((s, i) => (
//                           <span key={i} className="badge bg-white text-dark rounded-pill px-3 py-2 fw-bold" style={{ fontSize: "10px" }}>{s}</span>
//                         )) || <span className="text-white-50 small italic">Scanning...</span>}
//                       </div>
//                     </div>
                    
//                     <div>
//                       <span className="fw-bold text-secondary uppercase ls-1" style={{ fontSize: "9px" }}>MARKET KEYWORDS</span>
//                       <div className="mt-2 d-flex flex-wrap gap-2">
//                         {profile.parsedData.keywords?.map((k, i) => (
//                           <span key={i} className="badge bg-secondary text-dark rounded-pill px-2 py-1 fw-bold" style={{ fontSize: "9px", opacity: 0.8 }}>{k}</span>
//                         )) || <span className="text-white-50 small italic">Scanning...</span>}
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="text-center py-5">
//                     <div className="spinner-border spinner-border-sm text-secondary mb-3 opacity-20" role="status"></div>
//                     <p className="text-white-50 small">Synchronize a portfolio to activate deep mapping.</p>
//                   </div>
//                 )}
//               </Card>
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Button, Card, Spinner, Alert, ProgressBar } from "react-bootstrap";
import { motion } from "framer-motion";

export default function CandidateProfile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    education: [],
    skills: [],
    experience: [],
    parsedData: {},
    resumeUrl: null,
  });

  const [skillsInput, setSkillsInput] = useState("");
  const [experienceInput, setExperienceInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [resumeFile, setResumeFile] = useState(null);

  const token = localStorage.getItem("token");

  // ---------------- FETCH PROFILE ----------------
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get("http://localhost:3000/api/candidate/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;

        setProfile({
          ...data,
          education: Array.isArray(data.education) ? data.education : [],
          skills: Array.isArray(data.skills) ? data.skills : [],
          experience: Array.isArray(data.experience) ? data.experience : [],
          parsedData: data.parsedData || {},
        });

        setSkillsInput(data.skills?.join(", ") || "");
        setExperienceInput(data.experience?.map((ex) => ex.role).join(", ") || "");
      } catch (err) {
        setMsg(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [token]);

  // ---------------- PROFILE COMPLETION LOGIC ----------------
  const calculateProfileCompletion = () => {
    let score = 0;

    if (profile.name && profile.email) score += 20;
    if (profile.education?.length > 0) score += 30;
    if (profile.skills?.length > 0) score += 20;
    if (profile.experience?.length > 0) score += 10;
    if (profile.resumeUrl) score += 20;

    return score;
  };

  const completion = calculateProfileCompletion();

  // ---------------- UPDATE PROFILE ----------------
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMsg("");

    const updatedSkills = skillsInput.split(",").map((s) => s.trim()).filter((s) => s);
    const updatedExperience = experienceInput.split(",")
      .map((r) => ({ role: r.trim() }))
      .filter((r) => r.role);

    if (profile.education.length === 0)
      return setMsg("Please add at least one education entry.");

    for (let edu of profile.education) {
      if (!edu.degree.trim() || !edu.institution.trim() || !edu.year.trim())
        return setMsg("All education fields (degree, institution, year) are required.");
    }

    if (updatedSkills.length === 0)
      return setMsg("Please enter at least one skill.");

    try {
      const res = await axios.put(
        "http://localhost:3000/api/candidate/profile",
        {
          education: profile.education,
          skills: updatedSkills,
          experience: updatedExperience,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMsg(res.data.message);
      setProfile({ ...profile, skills: updatedSkills, experience: updatedExperience });
    } catch (err) {
      setMsg(err.response?.data?.message || "Update failed");
    }
  };

  // ---------------- RESUME UPLOAD ----------------
  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) return setMsg("Select a resume first!");

    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/candidate/upload-resume",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMsg(res.data.message);
      setProfile(res.data.candidate);
    } catch (err) {
      setMsg(err.response?.data?.message || "Resume upload failed");
    }
  };

  // ---------------- EDUCATION HANDLERS ----------------
  const addEducation = () => {
    setProfile({
      ...profile,
      education: [...profile.education, { degree: "", institution: "", year: "" }],
    });
  };

  const updateEducation = (index, field, value) => {
    const updated = [...profile.education];
    updated[index][field] = value;
    setProfile({ ...profile, education: updated });
  };

  const removeEducation = (index) => {
    const updated = profile.education.filter((_, i) => i !== index);
    setProfile({ ...profile, education: updated });
  };

  if (loading) return <Spinner animation="border" className="m-5" />;

  // ---------------- UI STARTS ----------------
  return (
    <div className="container my-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="shadow-lg rounded-4 border-0 bg-white/70 backdrop-blur-xl p-4">

          {/* 🔥 Profile Completion Header */}
          <div className="mb-4 text-center">
            <h2 className="fw-bold text-primary mb-2">My Profile</h2>
            <p className="text-muted">Your profile helps recruiters understand your strengths.</p>

            <div className="px-5 mt-3">
              <ProgressBar
                striped
                animated
                now={completion}
                label={`${completion}%`}
                variant={completion < 50 ? "danger" : completion < 80 ? "warning" : "success"}
                className="rounded-pill shadow-sm"
                style={{ height: "22px" }}
              />
            </div>
          </div>

          {msg && (
            <Alert variant={msg.includes("fail") ? "danger" : "success"} className="mt-3">
              {msg}
            </Alert>
          )}

          {/* ---------------- MAIN FORM ---------------- */}
          <Form onSubmit={handleUpdateProfile} className="mt-4">
            {/* NAME + EMAIL */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <Form.Label className="fw-semibold">Full Name</Form.Label>
                <Form.Control type="text" value={profile.name} readOnly className="rounded-3 shadow-sm" />
              </div>

              <div className="col-md-6 mb-3">
                <Form.Label className="fw-semibold">Email Address</Form.Label>
                <Form.Control type="email" value={profile.email} readOnly className="rounded-3 shadow-sm" />
              </div>
            </div>

            {/* EDUCATION */}
            <h4 className="mt-4 mb-2">Education</h4>

            {profile.education.map((edu, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 mt-2 rounded-4 border bg-white shadow-sm"
              >
                <div className="row">
                  <div className="col-md-4 mb-2">
                    <Form.Label>Degree</Form.Label>
                    <Form.Control
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(idx, "degree", e.target.value)}
                      className="rounded-3"
                    />
                  </div>

                  <div className="col-md-5 mb-2">
                    <Form.Label>Institution</Form.Label>
                    <Form.Control
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateEducation(idx, "institution", e.target.value)}
                      className="rounded-3"
                    />
                  </div>

                  <div className="col-md-3 mb-2">
                    <Form.Label>Year</Form.Label>
                    <Form.Control
                      type="text"
                      value={edu.year}
                      onChange={(e) => updateEducation(idx, "year", e.target.value)}
                      className="rounded-3"
                    />
                  </div>
                </div>

                <Button variant="outline-danger" size="sm" onClick={() => removeEducation(idx)}>
                  Remove
                </Button>
              </motion.div>
            ))}

            <Button variant="secondary" size="sm" className="mt-3" onClick={addEducation}>
              + Add Education
            </Button>

            {/* SKILLS */}
            <div className="mt-4">
              <Form.Label>Skills</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                className="rounded-3 shadow-sm"
              />
            </div>

            {/* EXPERIENCE */}
            <div className="mt-3">
              <Form.Label>Experience</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={experienceInput}
                onChange={(e) => setExperienceInput(e.target.value)}
                className="rounded-3 shadow-sm"
              />
            </div>

            <Button variant="primary" type="submit" className="mt-4 px-4 py-2 rounded-3">
              Save Profile
            </Button>
          </Form>

          <hr className="my-4" />

          {/* RESUME UPLOAD */}
          <h4>Upload Resume</h4>
          <Form onSubmit={handleResumeUpload}>
            <Form.Control
              type="file"
              accept=".pdf"
              onChange={(e) => setResumeFile(e.target.files[0])}
              className="rounded-3 shadow-sm mb-2"
            />
            <Button variant="secondary" type="submit" className="rounded-3 px-3">
              Upload Resume
            </Button>
          </Form>

          {/* RESUME ANALYSIS */}
          {profile.parsedData && (
            <div className="mt-4 p-3 rounded-4 bg-light shadow-sm">
              <h5>Resume Insights</h5>

              <p><strong>Summary:</strong> {profile.parsedData.summary || "Not available"}</p>

              <p><strong>Extracted Skills:</strong>
                {profile.parsedData.extractedSkills?.length
                  ? " " + profile.parsedData.extractedSkills.join(", ")
                  : " Not found"}
              </p>

              <p><strong>Keywords:</strong>
                {profile.parsedData.keywords?.length
                  ? " " + profile.parsedData.keywords.join(", ")
                  : " Not found"}
              </p>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}