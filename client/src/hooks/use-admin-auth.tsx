import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

interface AdminUser {
  username: string;
  role: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Create context with a default value
const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

// Default admin credentials (in a real app, these would be stored server-side)
const ADMIN_CREDENTIALS = {
  username: "admin@crowelogic.com",
  password: "CroweLogic2025!",
  role: "admin"
};

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const { toast } = useToast();
  
  // Check if user is already logged in (from sessionStorage)
  useEffect(() => {
    const savedUser = sessionStorage.getItem("adminUser");
    if (savedUser) {
      try {
        setAdminUser(JSON.parse(savedUser));
      } catch (error) {
        // If parsing fails, clear the storage
        sessionStorage.removeItem("adminUser");
      }
    }
  }, []);
  
  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    // In a real app, this would make an API call to verify credentials
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      const user = {
        username: ADMIN_CREDENTIALS.username,
        role: ADMIN_CREDENTIALS.role
      };
      
      setAdminUser(user);
      sessionStorage.setItem("adminUser", JSON.stringify(user));
      
      toast({
        title: "Login successful",
        description: "Welcome to the Crowe Logic Admin Portal",
      });
      
      return true;
    } else {
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
      
      return false;
    }
  };
  
  // Logout function
  const logout = () => {
    setAdminUser(null);
    sessionStorage.removeItem("adminUser");
    
    toast({
      title: "Logged out",
      description: "You have been logged out of the admin portal",
    });
  };
  
  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        isAuthenticated: !!adminUser,
        login,
        logout
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}