import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    fetch("https://lms-system-zm6u.onrender.com/check-auth", {
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 200) return res.json();
        throw new Error("Unauthorized");
      })
      .then((data) => {
        // Optional: Role check (student / faculty / admin)
        if (role && data.user.role !== role) {
          setIsAuth(false);
        } else {
          setIsAuth(true);
        }
      })
      .catch(() => setIsAuth(false));
  }, [role]);

  if (isAuth === null) return <p>Checking authentication...</p>;

  return isAuth ? children : <Navigate to="/" />;
}
