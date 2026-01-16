import './student.css';
import { NavLink, Outlet, Link } from "react-router-dom";
import { useState, useEffect } from 'react';

function Faculty() {
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
                    <NavLink to="/faculty/dashboard"><li>Dashboard</li></NavLink>
                    <NavLink to="/faculty/courses"><li>My Courses</li></NavLink>
                    <NavLink to="/faculty/assignment"><li>Assignment</li></NavLink>
                    <NavLink to="/faculty/quiz"><li>Quiz</li></NavLink>
                    <NavLink to="/faculty/attendance"><li>Attendance</li></NavLink>
                    <NavLink to="/faculty/grade"><li>Grade</li></NavLink>
                    <NavLink to="/faculty/exam"><li>Exam</li></NavLink>
                    <NavLink to="/faculty/mystudents"><li>Students</li></NavLink>
                    {/* <NavLink to="/faculty/exam"><li>Exam</li></NavLink> */}
                    <NavLink to="/faculty/profile"><li>Profile</li></NavLink>
                    <NavLink to="/"><li>LogOut</li></NavLink>
                </ul>
            </div>

            {/* Right Side Content */}
            <div className="hero-content">
                <div className="nav-top">
                    <div className="search">
                        <Link className='link' to="/student/profile"><li>YOU</li></Link>
                    </div>
                    <div className="important-link">
                        <button className="theme-btn" onClick={toggleTheme}>
                            {theme === "dark" ? "☀️" : "🌙"}
                        </button>
                        <ul>
                            <Link className='link' to="https://www.kiet.edu/#/Home"><li>KIET</li></Link>
                            <Link className='link' to="https://aktu.ac.in/"><li>AKTU</li></Link>
                            <Link className='link' to="https://www.aicte.gov.in/"><li>AICTE</li></Link>
                        </ul>

                    </div>
                </div>

                {/* 🔥 This is where pages will change */}
                <Outlet />
            </div>
        </div>
    );
}

export default Faculty;
