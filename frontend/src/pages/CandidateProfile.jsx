import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Button, Card, Spinner, Alert, Row, Col } from "react-bootstrap";

export default function CandidateProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch profile
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get("http://localhost:3000/api/candidate/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        setMsg(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await axios.put(
        "http://localhost:3000/api/candidate/profile",
        {
          education: profile.education,
          skills: profile.skills,
          experience: profile.experience,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.message || "Update failed");
    }
  };

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

  if (loading) return <Spinner animation="border" className="m-5" />;

  return (
    <div className="container my-4">
      <Card className="shadow">
        <Card.Body>
          <h3 className="mb-4 text-center">Candidate Profile</h3>
          {msg && <Alert variant={msg.toLowerCase().includes("fail") ? "danger" : "success"}>{msg}</Alert>}

          <Form onSubmit={handleUpdateProfile}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={profile.name} readOnly />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={profile.email} readOnly />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Education (comma separated)</Form.Label>
              <Form.Control
                name="education"
                value={profile.education?.map(e => `${e.degree}-${e.institution}-${e.year}`).join(", ") || ""}
                onChange={(e)=>setProfile({...profile, education: e.target.value.split(",").map(s=>({degree:s.trim()}))})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Skills (comma separated)</Form.Label>
              <Form.Control
                name="skills"
                value={profile.skills?.join(", ") || ""}
                onChange={(e) => setProfile({ ...profile, skills: e.target.value.split(",").map(s=>s.trim()) })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Experience (comma separated roles)</Form.Label>
              <Form.Control
                name="experience"
                value={profile.experience?.map(ex => ex.role).join(", ") || ""}
                onChange={(e)=>setProfile({...profile, experience: e.target.value.split(",").map(r=>({role:r.trim()}))})}
              />
            </Form.Group>

            <Button variant="primary" type="submit">Save Details</Button>
          </Form>

          <hr className="my-4" />

          <Form onSubmit={handleResumeUpload}>
            <Form.Group controlId="resume" className="mb-3">
              <Form.Label>Upload Resume</Form.Label>
              <Form.Control type="file" accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files[0])} />
            </Form.Group>
            <Button type="submit" variant="secondary">Upload Resume</Button>
          </Form>

          {profile.resumeUrl && (
            <p className="mt-3">Current Resume: {profile.resumeUrl}</p>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
