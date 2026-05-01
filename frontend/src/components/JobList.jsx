import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import axios from "axios";
import { Table, Button, Spinner, Alert, Form } from "react-bootstrap";
import { motion } from "framer-motion";
import ApplicationList from "./ApplicationList";

const JobList = forwardRef((props, ref) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [editingJobId, setEditingJobId] = useState(null);
  const [editJobData, setEditJobData] = useState({});
  const token = localStorage.getItem("token");

  /* -----------------------------------------
     FETCH JOBS
  ----------------------------------------- */
  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const jobList = res.data;

      // Check test existence
      const processed = await Promise.all(
        jobList.map(async (job) => {
          try {
            const test = await axios.get(
              `http://localhost:3000/api/tests/${job._id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            return { ...job, hasTest: test.data?.test ? true : false };
          } catch {
            return { ...job, hasTest: false };
          }
        })
      );

      setJobs(processed);
    } catch (err) {
      setMsg("❌ Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useImperativeHandle(ref, () => ({
    fetchJobs,
  }));

  /* -----------------------------------------
     DELETE JOB
  ----------------------------------------- */
  const deleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await axios.delete(`http://localhost:3000/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMsg("✅ Job deleted successfully");
      fetchJobs();
    } catch {
      setMsg("❌ Error deleting job");
    }
  };

  /* -----------------------------------------
     EDIT MODE
  ----------------------------------------- */
  const startEdit = (job) => {
    setEditingJobId(job._id);
    setEditJobData({
      title: job.title,
      location: job.location,
      salary: job.salary,
      status: job.status,
      testRequired: job.testRequired || false,
    });
  };

  const cancelEdit = () => {
    setEditingJobId(null);
    setEditJobData({});
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(
        `http://localhost:3000/api/jobs/${id}`,
        editJobData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMsg("✅ Job updated successfully");
      setEditingJobId(null);
      fetchJobs();
    } catch {
      setMsg("❌ Error updating job");
    }
  };

  /* -----------------------------------------
     LOADING SCREEN
  ----------------------------------------- */
  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner
          animation="border"
          variant="primary"
          style={{ width: "3rem", height: "3rem" }}
        />
        <p className="mt-3 text-primary">Loading Jobs...</p>
      </div>
    );

  /* -----------------------------------------
     UI
  ----------------------------------------- */
  return (
    <motion.div
      className="my-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.h3
        className="fw-bold text-primary mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Job Listings
      </motion.h3>

      {msg && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-3"
        >
          <Alert
            variant={msg.startsWith("✅") ? "success" : "danger"}
            className="rounded-3 shadow"
          >
            {msg}
          </Alert>
        </motion.div>
      )}

      {/* TABLE */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-4 overflow-hidden shadow-lg"
        style={{
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(12px)",
        }}
      >
        <Table hover responsive className="align-middle mb-0">
          <thead className="bg-primary text-white">
            <tr>
              <th>Title</th>
              <th>Location</th>
              <th>Salary</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
              <th className="text-center">Applications</th>
            </tr>
          </thead>

          <tbody>
            {jobs.map((job, index) => (
              <motion.tr
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                whileHover={{
                  backgroundColor: "rgba(230,240,255,0.5)",
                  transition: { duration: 0.2 },
                }}
              >
                {editingJobId === job._id ? (
                  <>
                    {/* EDIT MODE CELLS */}
                    <td>
                      <Form.Control
                        type="text"
                        value={editJobData.title}
                        onChange={(e) =>
                          setEditJobData({
                            ...editJobData,
                            title: e.target.value,
                          })
                        }
                      />
                    </td>

                    <td>
                      <Form.Control
                        type="text"
                        value={editJobData.location}
                        onChange={(e) =>
                          setEditJobData({
                            ...editJobData,
                            location: e.target.value,
                          })
                        }
                      />
                    </td>

                    <td>
                      <Form.Control
                        type="text"
                        value={editJobData.salary}
                        onChange={(e) =>
                          setEditJobData({
                            ...editJobData,
                            salary: e.target.value,
                          })
                        }
                      />
                    </td>

                    <td>
                      <Form.Select
                        value={editJobData.status}
                        onChange={(e) =>
                          setEditJobData({
                            ...editJobData,
                            status: e.target.value,
                          })
                        }
                      >
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                      </Form.Select>
                    </td>

                    <td className="text-center">
                      <Button
                        size="sm"
                        variant="success"
                        className="me-2"
                        onClick={() => saveEdit(job._id)}
                      >
                        Save
                      </Button>
                      <Button size="sm" variant="secondary" onClick={cancelEdit}>
                        Cancel
                      </Button>
                    </td>

                    <td className="text-center">—</td>
                  </>
                ) : (
                  <>
                    {/* NORMAL VIEW */}
                    <td className="fw-semibold">{job.title}</td>
                    <td>{job.location}</td>
                    <td>{job.salary}</td>
                    <td>
                      <span
                        className={
                          job.status === "open"
                            ? "badge bg-success"
                            : "badge bg-secondary"
                        }
                      >
                        {job.status}
                      </span>
                    </td>

                    <td className="text-center">
                      <Button
                        size="sm"
                        variant="warning"
                        className="me-2"
                        onClick={() => startEdit(job)}
                      >
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="danger"
                        className="me-2"
                        onClick={() => deleteJob(job._id)}
                      >
                        Delete
                      </Button>

                      {/* TEST BUTTONS */}
                      {job.testRequired && !job.hasTest && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() =>
                            (window.location.href = `/recruiter/create-test/${job._id}`)
                          }
                        >
                          Create Test
                        </Button>
                      )}

                      {job.testRequired && job.hasTest && (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() =>
                            (window.location.href = `/recruiter/view-test/${job._id}`)
                          }
                        >
                          View Test
                        </Button>
                      )}
                    </td>

                    <td className="text-center">
                      <ApplicationList jobId={job._id} />
                    </td>
                  </>
                )}
              </motion.tr>
            ))}
          </tbody>
        </Table>
      </motion.div>
    </motion.div>
  );
});

export default JobList;


// OLD

// import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
// import axios from "axios";
// import { Table, Button, Spinner, Alert, Form } from "react-bootstrap";
// import ApplicationList from "./ApplicationList";

// const JobList = forwardRef((props, ref) => {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [msg, setMsg] = useState("");
//   const [editingJobId, setEditingJobId] = useState(null);
//   const [editJobData, setEditJobData] = useState({});
//   const token = localStorage.getItem("token");

//   // --- Fetch all jobs ---
//   const fetchJobs = async () => {
//     try {
//       const res = await axios.get("http://localhost:3000/api/jobs", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const jobsFetched = res.data;

//       // --- Check test existence for each job ---
//       const withTestFlags = await Promise.all(
//         jobsFetched.map(async (job) => {
//           try {
//             const res2 = await axios.get(
//               `http://localhost:3000/api/tests/${job._id}`,
//               { headers: { Authorization: `Bearer ${token}` } }
//             );

//             return {
//               ...job,
//               hasTest: res2.data?.test ? true : false,
//             };
//           } catch {
//             return { ...job, hasTest: false };
//           }
//         })
//       );

//       setJobs(withTestFlags);
//     } catch (err) {
//       setMsg("❌ Failed to fetch jobs");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchJobs();
//   }, []);

//   useImperativeHandle(ref, () => ({
//     fetchJobs,
//   }));

//   // -------- Delete Job --------
//   const deleteJob = async (id) => {
//     if (!window.confirm("Delete this job?")) return;
//     try {
//       await axios.delete(`http://localhost:3000/api/jobs/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setMsg("✅ Job deleted");
//       fetchJobs();
//     } catch {
//       setMsg("❌ Delete failed");
//     }
//   };

//   // -------- Start Editing --------
//   const startEdit = (job) => {
//     setEditingJobId(job._id);
//     setEditJobData({
//       title: job.title,
//       location: job.location,
//       salary: job.salary,
//       status: job.status,
//       testRequired: job.testRequired || false,
//     });
//   };

//   const cancelEdit = () => {
//     setEditingJobId(null);
//     setEditJobData({});
//   };

//   // -------- Save Edit --------
//   const saveEdit = async (id) => {
//     try {
//       await axios.put(
//         `http://localhost:3000/api/jobs/${id}`,
//         editJobData,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setMsg("✅ Job updated");
//       setEditingJobId(null);
//       fetchJobs();
//     } catch {
//       setMsg("❌ Update failed");
//     }
//   };

//   if (loading) return <Spinner animation="border" />;

//   return (
//     <div className="my-4">
//       <h4>Job Listings</h4>
//       {msg && <Alert>{msg}</Alert>}

//       <Table striped bordered hover>
//         <thead>
//           <tr>
//             <th>Title</th>
//             <th>Location</th>
//             <th>Salary</th>
//             <th>Status</th>
//             <th>Actions</th>
//             <th>Applications</th>
//           </tr>
//         </thead>

//         <tbody>
//           {jobs.map((job) => (
//             <tr key={job._id}>
//               {editingJobId === job._id ? (
//                 <>
//                   <td>
//                     <Form.Control
//                       type="text"
//                       value={editJobData.title}
//                       onChange={(e) =>
//                         setEditJobData({ ...editJobData, title: e.target.value })
//                       }
//                     />
//                   </td>

//                   <td>
//                     <Form.Control
//                       type="text"
//                       value={editJobData.location}
//                       onChange={(e) =>
//                         setEditJobData({ ...editJobData, location: e.target.value })
//                       }
//                     />
//                   </td>

//                   <td>
//                     <Form.Control
//                       type="text"
//                       value={editJobData.salary}
//                       onChange={(e) =>
//                         setEditJobData({ ...editJobData, salary: e.target.value })
//                       }
//                     />
//                   </td>

//                   <td>
//                     <Form.Select
//                       value={editJobData.status}
//                       onChange={(e) =>
//                         setEditJobData({ ...editJobData, status: e.target.value })
//                       }
//                     >
//                       <option value="open">Open</option>
//                       <option value="closed">Closed</option>
//                     </Form.Select>
//                   </td>

//                   <td>
//                     <Button
//                       size="sm"
//                       variant="success"
//                       className="me-2"
//                       onClick={() => saveEdit(job._id)}
//                     >
//                       Save
//                     </Button>
//                     <Button size="sm" variant="secondary" onClick={cancelEdit}>
//                       Cancel
//                     </Button>
//                   </td>

//                   <td>—</td>
//                 </>
//               ) : (
//                 <>
//                   <td>{job.title}</td>
//                   <td>{job.location}</td>
//                   <td>{job.salary}</td>
//                   <td>{job.status}</td>

//                   <td>
//                     <Button
//                       size="sm"
//                       variant="warning"
//                       className="me-2"
//                       onClick={() => startEdit(job)}
//                     >
//                       Edit
//                     </Button>

//                     <Button
//                       size="sm"
//                       variant="danger"
//                       className="me-2"
//                       onClick={() => deleteJob(job._id)}
//                     >
//                       Delete
//                     </Button>

//                     {/* ⭐ CREATE TEST BUTTON */}
//                     {job.testRequired && !job.hasTest && (
//                       <Button
//                         size="sm"
//                         variant="primary"
//                         onClick={() =>
//                           (window.location.href = `/recruiter/create-test/${job._id}`)
//                         }
//                       >
//                         Create Test
//                       </Button>
//                     )}

//                     {/* ⭐ VIEW TEST BUTTON */}
//                     {job.testRequired && job.hasTest && (
//                       <Button
//                         size="sm"
//                         variant="success"
//                         className="ms-2"
//                         onClick={() =>
//                           (window.location.href = `/recruiter/view-test/${job._id}`)
//                         }
//                       >
//                         View Test
//                       </Button>
//                     )}
//                   </td>

//                   <td>
//                     <ApplicationList jobId={job._id} />
//                   </td>
//                 </>
//               )}
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </div>
//   );
// });

// export default JobList;
