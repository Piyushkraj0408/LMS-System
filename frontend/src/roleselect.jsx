import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Home from "./spline";


export default function RoleSelect() {
  const navigate = useNavigate();
  const r1 = useRef();
  const r2 = useRef();

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from(r1.current, {
      y: 500,
      opacity: 0,
      duration: 1.5,
      ease: "power1.out",
    })
    .from(r2.current, {
      y: 500,
      opacity: 0,
      duration: 1.5,
      ease: "power1.out",
    }, "-=0.5"); // overlap animation slightly
  }, []);

  return (
   <div className="split-container">

  <div className="spline-layer">
    <Home />
  </div>

  <div ref={r1} className="side student">
    <h1 style={{fontSize:"20vh"}}>Student</h1>
    <p>Login to your dashboard</p>
  </div>

  <div ref={r2} className="side faculty">
    <h1 style={{fontSize:"20vh"}}>Faculty</h1>
    <p>Manage classes & students</p>
  </div>

  <div className="top-ui">
  <button className="stubutton" onClick={() => navigate("/studentauth")}>Student</button>
  <button className="facbutton" onClick={() => navigate("/facultyAuth")}>Faculty</button>
</div>


</div>

  )
}
