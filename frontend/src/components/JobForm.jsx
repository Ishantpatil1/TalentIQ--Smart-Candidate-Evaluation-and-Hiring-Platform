import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Alert } from "react-bootstrap";
import { motion } from "framer-motion";

export default function JobForm({ onJobCreated }) {
  const [job, setJob] = useState({
    title: "",
    description: "",
    requirements: "",
    skills: "",
    location: "",
    salary: "",
    status: "open",
    testRequired: false,
  });

  const [msg, setMsg] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/jobs", job, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMsg("✅ Job created successfully!");

      setJob({
        title: "",
        description: "",
        requirements: "",
        skills: "",
        location: "",
        salary: "",
        status: "open",
        testRequired: false,
      });

      if (onJobCreated) onJobCreated();
    } catch (err) {
      setMsg(err.response?.data?.message || "❌ Job creation failed");
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto p-6 rounded-4xl shadow-2xl"
        style={{
          background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.3)",
        }}
      >
        <h2 className="text-center fw-bold text-primary mb-4">
          Create a New Job Posting
        </h2>

        {msg && (
          <Alert
            variant={msg.startsWith("✅") ? "success" : "danger"}
            className="rounded-3 text-center"
          >
            {msg}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {/* Title */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Job Title</Form.Label>
            <Form.Control
              type="text"
              value={job.title}
              onChange={(e) => setJob({ ...job, title: e.target.value })}
              className="rounded-3 shadow-sm"
              placeholder="e.g. Full Stack Developer"
              required
            />
          </Form.Group>

          {/* Description */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={job.description}
              onChange={(e) => setJob({ ...job, description: e.target.value })}
              className="rounded-3 shadow-sm"
              placeholder="Describe the role..."
              required
            />
          </Form.Group>

          {/* Requirements */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Requirements</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={job.requirements}
              onChange={(e) =>
                setJob({ ...job, requirements: e.target.value })
              }
              className="rounded-3 shadow-sm"
              placeholder="Required experience, education, etc."
            />
          </Form.Group>

          {/* Skills */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              Skills (comma separated)
            </Form.Label>
            <Form.Control
              type="text"
              value={job.skills}
              onChange={(e) => setJob({ ...job, skills: e.target.value })}
              className="rounded-3 shadow-sm"
              placeholder="React, Node.js, MongoDB"
            />
          </Form.Group>

          {/* Location */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Location</Form.Label>
            <Form.Control
              type="text"
              value={job.location}
              onChange={(e) => setJob({ ...job, location: e.target.value })}
              className="rounded-3 shadow-sm"
              placeholder="Mumbai, Pune, Remote"
            />
          </Form.Group>

          {/* Salary */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Salary</Form.Label>
            <Form.Control
              type="text"
              value={job.salary}
              onChange={(e) => setJob({ ...job, salary: e.target.value })}
              className="rounded-3 shadow-sm"
              placeholder="₹5,00,000 - ₹12,00,000"
            />
          </Form.Group>

          {/* Status */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Status</Form.Label>
            <Form.Select
              value={job.status}
              onChange={(e) => setJob({ ...job, status: e.target.value })}
              className="rounded-3 shadow-sm"
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </Form.Select>
          </Form.Group>

          {/* Test Required */}
          <Form.Group className="mb-4">
            <Form.Check
              type="switch"
              label="Require Skill Test Before Interview"
              checked={job.testRequired}
              onChange={(e) =>
                setJob({ ...job, testRequired: e.target.checked })
              }
              className="fw-semibold"
            />
          </Form.Group>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-100 py-3 rounded-3 fw-bold text-white shadow-lg"
            style={{
              background:
                "linear-gradient(90deg, #4f46e5, #7c3aed)",
              border: "none",
            }}
          >
            Create Job
          </motion.button>
        </Form>
      </motion.div>
    </div>
  );
}


// import React, { useState } from "react";
// import axios from "axios";
// import { Form, Button, Card, Alert } from "react-bootstrap";

// export default function JobForm({ onJobCreated }) {
//   const [job, setJob] = useState({
//     title: "",
//     description: "",
//     requirements: "",
//     skills: "",
//     location: "",
//     salary: "",
//     status: "open",
//     testRequired: false, // ⭐ NEW FIELD
//   });

//   const [msg, setMsg] = useState("");
//   const token = localStorage.getItem("token");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post("http://localhost:3000/api/jobs", job, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setMsg("✅ Job created successfully!");

//       setJob({
//         title: "",
//         description: "",
//         requirements: "",
//         skills: "",
//         location: "",
//         salary: "",
//         status: "open",
//         testRequired: false, // reset
//       });

//       if (onJobCreated) onJobCreated(); // refresh job list
//     } catch (err) {
//       console.log(err);
//       setMsg(err.response?.data?.message || "❌ Job creation failed");
//     }
//   };

//   return (
//     <div className="container my-4">
//       <Card className="shadow">
//         <Card.Body>
//           <h3>Create Job Posting</h3>
//           {msg && <Alert>{msg}</Alert>}

//           <Form onSubmit={handleSubmit}>
//             <Form.Group className="mb-3">
//               <Form.Label>Title</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={job.title}
//                 onChange={(e) => setJob({ ...job, title: e.target.value })}
//                 required
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Description</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={3}
//                 value={job.description}
//                 onChange={(e) =>
//                   setJob({ ...job, description: e.target.value })
//                 }
//                 required
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Requirements</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={2}
//                 value={job.requirements}
//                 onChange={(e) =>
//                   setJob({ ...job, requirements: e.target.value })
//                 }
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Skills (comma separated)</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={job.skills}
//                 onChange={(e) => setJob({ ...job, skills: e.target.value })}
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Location</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={job.location}
//                 onChange={(e) => setJob({ ...job, location: e.target.value })}
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Salary</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={job.salary}
//                 onChange={(e) => setJob({ ...job, salary: e.target.value })}
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Status</Form.Label>
//               <Form.Select
//                 value={job.status}
//                 onChange={(e) => setJob({ ...job, status: e.target.value })}
//               >
//                 <option value="open">Open</option>
//                 <option value="closed">Closed</option>
//               </Form.Select>
//             </Form.Group>

//             {/* ⭐ NEW: Test Required Toggle */}
//             <Form.Group className="mb-3">
//               <Form.Check
//                 type="checkbox"
//                 label="Require Test Before Interview"
//                 checked={job.testRequired}
//                 onChange={(e) =>
//                   setJob({ ...job, testRequired: e.target.checked })
//                 }
//               />
//             </Form.Group>

//             <Button type="submit">Create Job</Button>
//           </Form>
//         </Card.Body>
//       </Card>
//     </div>
//   );
// }
