import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    try {
      console.log("Attempting login with:", { email, password });

      // Get all registered users
      const usersJson = localStorage.getItem("users");
      console.log("Users from localStorage:", usersJson);

      const users = usersJson ? JSON.parse(usersJson) : [];
      console.log("Parsed users:", users);

      // Find user with matching credentials
      const foundUser = users.find(
        (u) => u.email === email && u.password === password
      );

      console.log("Found user:", foundUser);

      if (foundUser) {
        const userData = { name: foundUser.name, email: foundUser.email };
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(userData));
        console.log("Login successful:", userData);
        return true;
      }

      // Test account
      if (email === "test@example.com" && password === "1234") {
        const testUser = { name: "Test User", email };
        setUser(testUser);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(testUser));
        console.log("Test account login successful");
        return true;
      }

      console.log("Login failed: No matching user found");
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const signup = (name, email, password) => {
    try {
      console.log("Attempting signup with:", { name, email, password });

      // Validate input
      if (!name || !email || !password) {
        console.error("Missing required fields");
        return false;
      }

      // Get existing users
      const usersJson = localStorage.getItem("users");
      const existingUsers = usersJson ? JSON.parse(usersJson) : [];
      console.log("Existing users:", existingUsers);

      // Check if email already exists
      if (existingUsers.some((u) => u.email === email)) {
        console.error("Email already registered");
        return false;
      }

      // Create new user
      const newUser = { name, email, password };
      existingUsers.push(newUser);

      // Save to localStorage
      localStorage.setItem("users", JSON.stringify(existingUsers));
      console.log("Saved users:", existingUsers);

      // Set current user as logged in
      const userData = { name, email };
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userData));

      console.log("Signup successful:", userData);
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    console.log("Logout successful");
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
