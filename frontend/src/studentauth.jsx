import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function Studentauth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [step, setStep] = useState(1); // 1=email, 2=otp+new pass
  const [loading, setLoading] = useState(true);
  const [sendingOTP, setSendingOTP] = useState(false);

  const rk = useRef();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "",
    newPassword: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useGSAP(
    () => {
      if (!rk.current) return;

      gsap.from(rk.current, {
        y: -500,
        opacity: 0,
        duration: 1.5,
        ease: "power1.out",
      });
    },
    { dependencies: [loading] }
  );

  if (loading) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <DotLottieReact
          src="https://lottie.host/0dc282d9-0f1d-49aa-8d00-02c32da87c0a/H6a3oLn2ne.lottie"
          loop
          autoplay
        />
      </div>
    );
  }

  // 🔐 LOGIN
  async function handleSubmit(e) {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:5000/student-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
      credentials: "include",   // 👈 important for cookies
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Login failed");
      return;
    }

    // 🔑 ROLE-BASED REDIRECT
    const role = data.role;

    if (role === "admin") {
      navigate("/admin");
    } else if (role === "faculty") {
      navigate("/faculty");
    } else {
      navigate("/student");
    }

  } catch (error) {
    console.error("Fetch error:", error);
    alert("Something went wrong. Check console.");
  }
}


  // 📩 SEND OTP
  async function handleSendOTP(e) {
    e.preventDefault();
    setSendingOTP(true);
    try {
      const res = await fetch("http://localhost:5000/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();

      if (res.status === 200) {
        alert("OTP sent to your email");
        setStep(2);
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Error sending OTP");
    } finally {
      setSendingOTP(false); // 👈 stop loading
    }
  }

  // 🔁 RESET PASSWORD
  async function handleResetPassword(e) {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.newPassword,
        }),
      });

      const data = await res.json();

      if (res.status === 200) {
        alert("Password reset successful. Please login.");
        setIsForgot(false);
        setStep(1);
        setFormData({
          email: "",
          password: "",
          otp: "",
          newPassword: "",
        });
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Error resetting password");
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div ref={rk} className="studentauthform">
        <div className="gyanstuauth">
          <h2>
            {isForgot
              ? "Reset Password"
              : isLogin
              ? "Student Login"
              : "Student Signup"}
          </h2>

          {/* 🔐 LOGIN FORM */}
          {!isForgot && (
            <form onSubmit={handleSubmit}>
              <input
                required
                autoComplete="on"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              <input
                required
                autoComplete="on"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />

              <button type="submit">Login</button>
            </form>
          )}

          {/* 📩 FORGOT PASSWORD STEP 1 */}
          {isForgot && step === 1 && (
            <form onSubmit={handleSendOTP}>
              <input
                required
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <button type="submit" disabled={sendingOTP}>
                {sendingOTP ? (
                  <DotLottieReact
                    src="https://lottie.host/57284e22-8424-45f9-80a7-13b99c0984d7/zU8HgZj5Bw.lottie"
                    loop
                    autoplay
                  />
                ) : (
                  "Send OTP"
                )}
              </button>
            </form>
          )}

          {/* 🔁 FORGOT PASSWORD STEP 2 */}
          {isForgot && step === 2 && (
            <form onSubmit={handleResetPassword}>
              <input
                required
                type="text"
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={(e) =>
                  setFormData({ ...formData, otp: e.target.value })
                }
              />

              <input
                required
                type="password"
                placeholder="New Password"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
              />

              <button type="submit">Reset Password</button>
            </form>
          )}

          <p
            style={{ cursor: "pointer", color: "blue" }}
            onClick={() => {
              setIsForgot(!isForgot);
              setStep(1);
            }}
          >
            {isForgot ? "Back to Login" : "Forgot Password?"}
          </p>
        </div>

        <img
          src=".\ChatGPT Image Jan 12, 2026, 04_24_37 AM.png"
          alt="studentPic"
        />
      </div>
    </div>
  );
}
