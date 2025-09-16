import React from 'react';
import { motion } from 'framer-motion';

const HomePage = () => {
  return (
    <div>

      {/* Hero Section */}
      <motion.section
        className="text-center mt-5"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="container">
          <h1 className="display-1 fw-bold"
            style={{
              background: 'linear-gradient(90deg,#007bff,#6610f2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}
          >
            Discover & Hire Talent <br /> with Intelligence
          </h1>
          <p className="lead mt-3">
            <b>
              TalentIQ connects recruiters and candidates through AI-powered insights,
              making hiring faster, smarter, and more reliable.
            </b>
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className='btn btn-dark btn-lg mt-4'
          >
            <a className="text-white text-decoration-none" href="/register">
              Get Started →
            </a>
          </motion.button>
        </div>
      </motion.section>
      <br />

      {/* AI Talent Matching Section */}
      <motion.section
        className="py-5"
        style={{ backgroundColor: '#121212', color: '#f1f1f1' }}
        initial={{ opacity: 0, scale: 0.9, y: 100 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <div className="container d-flex flex-column-reverse flex-md-row align-items-center justify-content-between gap-4">
          <div className="text-center text-md-start mt-4 mt-md-0">
            <motion.h2
              className="fw-bold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              style={{ fontSize: '2rem' }}
            >
              Smarter Hiring. Better Careers.
            </motion.h2>
            <p className="mt-3" style={{ fontSize: '1.1rem', color: '#cccccc' }}>
              Our AI algorithms match the right talent to the right roles,
              reducing hiring time and helping candidates land their dream jobs.
            </p>
          </div>

          <motion.img
            src="/talent.jpg" // Add a suitable image in public folder
            alt="AI Talent Match Illustration"
            className="shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
            style={{
              width: '80%',
              maxWidth: '500px',
              borderRadius: '20px',
              boxShadow: '0 10px 25px rgba(255,255,255,0.1)',
            }}
          />
        </div>
      </motion.section>

      {/* ===== Platform Features ===== */}
      <section id="features" className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Platform Highlights</h2>
          <div className="row text-center g-4">

            <div className="col-md-4">
              <motion.div whileHover={{ scale: 1.05 }} className="p-4 shadow rounded bg-dark text-white h-100">
                <img src="https://img.icons8.com/color/96/parse-from-clipboard.png" alt="Resume Parsing" className="mb-3"/>
                <h5>NLP Resume Parsing</h5>
                <p>Automate resume parsing & skill extraction using advanced Natural Language Processing.</p>
              </motion.div>
            </div>

            <div className="col-md-4">
              <motion.div whileHover={{ scale: 1.05 }} className="p-4 shadow rounded bg-white h-100">
                <img src="https://img.icons8.com/color/96/rating.png" alt="AI Ranking" className="mb-3"/>
                <h5>AI Candidate Ranking</h5>
                <p>Rank candidates automatically so recruiters can focus on the most suitable profiles.</p>
              </motion.div>
            </div>

            <div className="col-md-4">
              <motion.div whileHover={{ scale: 1.05 }} className="p-4 shadow rounded bg-white h-100">
                <img src="https://img.icons8.com/color/96/video-call.png" alt="Proctored Interview" className="mb-3"/>
                <h5>Secure Proctored Interviews</h5>
                <p>Provide secure, monitored video interviews to ensure authenticity and fairness.</p>
              </motion.div>
            </div>

            <div className="col-md-4">
              <motion.div whileHover={{ scale: 1.05 }} className="p-4 shadow rounded bg-dark text-white h-100">
                <img src="https://img.icons8.com/color/96/feedback.png" alt="Feedback" className="mb-3"/>
                <h5>Feedback Reports</h5>
                <p>Generate detailed AI-driven feedback reports for candidates after each interview.</p>
              </motion.div>
            </div>

            <div className="col-md-4">
              <motion.div whileHover={{ scale: 1.05 }} className="p-4 shadow rounded bg-dark text-white h-100">
                <img src="https://img.icons8.com/color/96/combo-chart--v1.png" alt="Analytics" className="mb-3"/>
                <h5>Real-Time Analytics</h5>
                <p>Live dashboards with powerful analytics for both candidates and recruiters.</p>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-dark py-5 text-white text-center">
        <div className="container">
          <h2 className="mb-4">How TalentIQ Works</h2>
          <div className="row">
            <div className="col-md-3"><h5>1. Sign Up</h5><p>Create your profile as a recruiter or candidate.</p></div>
            <div className="col-md-3"><h5>2. Upload / Post</h5><p>Candidates upload resumes; recruiters post jobs.</p></div>
            <div className="col-md-3"><h5>3. AI Match</h5><p>Our AI recommends the best matches instantly.</p></div>
            <div className="col-md-3"><h5>4. Connect</h5><p>Chat, schedule interviews, and hire smarter.</p></div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-light py-5 text-center">
        <div className="container">
          <h2 className="mb-4">Empowering Recruitment with Intelligence</h2>
          <p className="lead">
            TalentIQ is a next-gen platform that bridges the gap between recruiters and candidates. 
            We make hiring faster and smarter by leveraging AI-driven insights and a seamless user experience.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <motion.section
        id="contact"
        className="py-5"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="container">
          <h2 className="text-center mb-4 fw-bold">Get in Touch</h2>
          <p className="text-center mb-5 text-muted">Have questions or suggestions? We’d love to hear from you!</p>
          <form className="mx-auto shadow p-4 rounded bg-white" style={{ maxWidth: '600px' }}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Your Name</label>
              <input type="text" className="form-control" placeholder="Enter your name" required />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email Address</label>
              <input type="email" className="form-control" placeholder="Enter your email" required />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Message</label>
              <textarea className="form-control" rows="4" placeholder="Write your message" required></textarea>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              type="submit"
              className="btn btn-dark w-100"
            >
              Send Message ✉️
            </motion.button>
          </form>
        </div>
      </motion.section>

      {/* Footer Call-to-Action */}
      <footer className="bg-dark text-white text-center py-4">
        <div className="container">
          <h4 className="mb-3">Ready to Find or Hire Top Talent?</h4>
          <a href="/register" className="btn btn-outline-light btn-lg">Join TalentIQ Today</a>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
