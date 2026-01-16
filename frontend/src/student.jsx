import './student.css';
import { NavLink, Outlet, Link } from "react-router-dom";
import { useState, useEffect } from 'react';

function Student() {
    const [theme, setTheme] = useState("dark");
    useEffect(() => {
        document.body.setAttribute("data-theme", theme);
    }, [theme]);
    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <div className="main-content">

            {/* Sidebar */}
            <div className="nav">
                <div className="logo">
                    <img src=".\Screenshot_2026-01-09_024540-removebg-preview.png" alt="pic" />
                    <h2 style={{ color: "#2563EB" }}>PEC</h2>
                </div>

                <ul>
                    <NavLink to="/student/dashboard"><li>Dashboard</li></NavLink>
                    <NavLink to="/student/courses"><li>Available Courses</li></NavLink>
                    <NavLink to="/student/mycourses"><li>My Courses</li></NavLink>
                    <NavLink to="/student/assignment"><li>Assignment</li></NavLink>
                    <NavLink to="/student/quiz"><li>Quiz</li></NavLink>
                    <NavLink to="/student/attendance"><li>Attendance</li></NavLink>
                    <NavLink to="/student/grade"><li>Grade</li></NavLink>
                    <NavLink to="/student/exam"><li>Exam</li></NavLink>
                    <NavLink to="/student/profile"><li>Profile</li></NavLink>
                    <NavLink to="/"><li>LogOut</li></NavLink>
                </ul>
            </div>

            {/* Right Side Content */}
            <div className="hero-content">
                <div className="nav-top">
                    <div className="search">
                        <input id='search-bar' type="search" placeholder='Search' />
                    </div>
                    <div className="important-link">
                        <button className="theme-btn" onClick={toggleTheme}>
                            {theme === "dark" ? "☀️" : "🌙"}
                        </button>
                        <ul>
                            <Link className='link' to="https://www.kiet.edu/#/Home"><li>KIET</li></Link>
                            <Link className='link' to="https://aktu.ac.in/"><li>AKTU</li></Link>
                            <Link className='link' to="https://www.aicte.gov.in/"><li>AICTE</li></Link>
                            <Link className='link' to="/student/profile"><li>YOU</li></Link>
                        </ul>

                    </div>
                </div>

                {/* 🔥 This is where pages will change */}
                <Outlet />
            </div>
        </div>
    );
}

export default Student;
