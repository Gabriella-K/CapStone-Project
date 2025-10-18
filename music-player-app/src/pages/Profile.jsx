import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const isLoggedIn = false;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="profile-page">
      <h1>Welcome to your profile</h1>
    </div>
  );
}

export default Profile;
