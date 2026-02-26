"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface User {
  email: string;
  full_name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
}

export interface SignupData {
  email: string;
  full_name: string;
  password: string;
  role?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_ATLAS_BACKEND_URL || "http://localhost:8000";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("atlas_token");
    const storedUser = localStorage.getItem("atlas_user");
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        // Invalid stored data, clear it
        localStorage.removeItem("atlas_token");
        localStorage.removeItem("atlas_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Login failed" }));
      throw new Error(error.detail || "Login failed");
    }

    const data = await response.json();
    
    // Store token and user info
    localStorage.setItem("atlas_token", data.access_token);
    localStorage.setItem("atlas_user", JSON.stringify({
      email,
      full_name: data.full_name,
      role: data.role,
    }));
    
    setToken(data.access_token);
    setUser({
      email,
      full_name: data.full_name,
      role: data.role,
    });
  };

  const signup = async (data: SignupData) => {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        full_name: data.full_name,
        password: data.password,
        role: data.role || "analyst",
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Signup failed" }));
      throw new Error(error.detail || "Signup failed");
    }

    // After successful signup, automatically log in
    await login(data.email, data.password);
  };

  const logout = () => {
    localStorage.removeItem("atlas_token");
    localStorage.removeItem("atlas_user");
    setToken(null);
    setUser(null);
    window.location.href = "/login";
  };

  const forgotPassword = async (email: string) => {
    const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Request failed" }));
      throw new Error(error.detail || "Failed to send reset link");
    }

    // Always return success to prevent user enumeration
    return;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        signup,
        logout,
        forgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
