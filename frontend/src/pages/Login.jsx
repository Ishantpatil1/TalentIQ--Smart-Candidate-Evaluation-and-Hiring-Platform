import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/auth/login",
        { email, password }
      );

      login(data); // stores token + user in context

      // ✅ redirect based on role
      navigate(
        data.role === "recruiter"
          ? "/recruiter-dashboard"
          : "/candidate-dashboard"
      );
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="d-flex justify-content-center align-items-center vh-100 px-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="p-4 p-md-5 rounded shadow w-100"
        style={{ maxWidth: "420px" }}
      >
        <h2 className="mb-4 text-center fw-bold">Login Here</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <div
              className="alert alert-danger text-center py-2"
              role="alert"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-success w-100 mt-3"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="mt-3 text-center small">
            Don&apos;t have an account?{" "}
            <a href="/register">Register here</a>
          </p>
        </form>
      </div>
    </motion.div>
  );
}


// import React, { useState, useContext } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";

// export default function Login() {
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async e => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const { data } = await axios.post("http://localhost:3000/api/auth/login", {
//         email,
//         password,
//       });

//       /**
//        *  data should contain something like:
//        *  { token: "...", role: "candidate" or "recruiter", user: {...} }
//        */

//       // ✅ save role in localStorage so Navbar can read it
//       localStorage.setItem("role", data.role);

//       // store token + user in context (your existing logic)
//       login(data);

//       // ✅ redirect based on role
//       navigate(data.role === "recruiter" ? "/recruiter-dashboard" : "/candidate-dashboard");
//     } catch (err) {
//       setError(err.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <motion.div
//       className="d-flex justify-content-center align-items-center vh-100 px-3"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//     >
//       <div className="p-4 p-md-5 rounded shadow w-100" style={{ maxWidth: "420px" }}>
//         <h2 className="mb-4 text-center fw-bold">Login Here</h2>

//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label htmlFor="email" className="form-label">Email address</label>
//             <input
//               type="email"
//               id="email"
//               className="form-control"
//               value={email}
//               onChange={e => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div className="mb-3">
//             <label htmlFor="password" className="form-label">Password</label>
//             <div className="input-group">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 id="password"
//                 className="form-control"
//                 value={password}
//                 onChange={e => setPassword(e.target.value)}
//                 required
//               />
//               <button
//                 type="button"
//                 className="btn btn-outline-secondary"
//                 onClick={() => setShowPassword(!showPassword)}
//                 tabIndex={-1}
//               >
//                 {showPassword ? "Hide" : "Show"}
//               </button>
//             </div>
//           </div>

//           {error && (
//             <div className="alert alert-danger text-center py-2" role="alert">
//               {error}
//             </div>
//           )}

//           <button type="submit" className="btn btn-success w-100 mt-3" disabled={loading}>
//             {loading ? "Logging in..." : "Login"}
//           </button>

//           <p className="mt-3 text-center small">
//             Don&apos;t have an account? <a href="/register">Register here</a>
//           </p>
//         </form>
//       </div>
//     </motion.div>
//   );
// }
