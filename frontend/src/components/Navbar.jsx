// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';

// const Navbar = () => {
//     const navigate = useNavigate();
//     const isLoggedIn = !!localStorage.getItem('token');

//     const handleLogout = () => {
//         localStorage.removeItem('token');
//         navigate('/');
//     };

//     return (
//         <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm fixed-top">
//             <div className="container">
//                 <Link className="navbar-brand" to="/">
//                     <h3 className="fw-bold mb-0">🚀 TalentIQ</h3>
//                 </Link>

//                 <button
//                     className="navbar-toggler"
//                     type="button"
//                     data-bs-toggle="collapse"
//                     data-bs-target="#navbarNav"
//                 >
//                     <span className="navbar-toggler-icon"></span>
//                 </button>

//                 <div className="collapse navbar-collapse" id="navbarNav">
//                     <ul className="navbar-nav ms-auto">
//                         {!isLoggedIn ? (
//                             <>
//                                 <li className="nav-item">
//                                     <Link className="nav-link text-light" to="/">
//                                         Home
//                                     </Link>
//                                 </li>
//                                 <li className="nav-item">
//                                     <Link className="nav-link text-light" to="/about">
//                                         About
//                                     </Link>
//                                 </li>
//                                 <li className="nav-item">
//                                     <Link className="nav-link text-light" to="/login">
//                                         Login
//                                     </Link>
//                                 </li>
//                                 <li className="nav-item">
//                                     <Link className="nav-link text-light" to="/register">
//                                         Register
//                                     </Link>
//                                 </li>
//                             </>
//                         ) : (
//                             <>
//                                 <li className="nav-item">
//                                     <Link
//                                         className="nav-link text-light"
//                                         to="/candidate-dashboard"
//                                     >
//                                         Candidate Dashboard
//                                     </Link>
//                                 </li>
//                                 <li className="nav-item">
//                                     <Link
//                                         className="nav-link text-light"
//                                         to="/recruiter-dashboard"
//                                     >
//                                         Recruiter Dashboard
//                                     </Link>
//                                 </li>
//                                 <li className="nav-item">
//                                     <button
//                                         className="btn nav-link text-danger"
//                                         onClick={handleLogout}
//                                     >
//                                         Logout
//                                     </button>
//                                 </li>
//                             </>
//                         )}
//                     </ul>
//                 </div>
//             </div>
//         </nav>
//     );
// };

// export default Navbar;


import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('token');

    // ✅ Read role directly from the stored user object
    const savedUser = JSON.parse(localStorage.getItem('user') || 'null');
    const userRole = savedUser?.role;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');   // remove the user object as well
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm fixed-top">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <h3 className="fw-bold mb-0">🚀 TalentIQ</h3>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {!isLoggedIn ? (
                            <>
                                <li className="nav-item"><Link className="nav-link text-light" to="/">Home</Link></li>
                                <li className="nav-item"><Link className="nav-link text-light" to="/about">About</Link></li>
                                <li className="nav-item"><Link className="nav-link text-light" to="/login">Login</Link></li>
                                <li className="nav-item"><Link className="nav-link text-light" to="/register">Register</Link></li>
                            </>
                        ) : (
                            <>
                                {userRole === 'candidate' && (
                                    <li className="nav-item">
                                        <Link className="nav-link text-light" to="/candidate-dashboard">
                                            Candidate Dashboard
                                        </Link>
                                    </li>
                                )}
                                {userRole === 'recruiter' && (
                                    <li className="nav-item">
                                        <Link className="nav-link text-light" to="/recruiter-dashboard">
                                            Recruiter Dashboard
                                        </Link>
                                    </li>
                                )}
                                <li className="nav-item">
                                    <button className="btn nav-link text-danger" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
