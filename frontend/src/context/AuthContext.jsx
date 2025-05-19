import { createContext, useContext, useState, useEffect } from "react";
//import { checkAuthStatus } from "../../../backend/controllers/userController.js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  //    const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  const { data: user, isLoading: loading } = useQuery({
    queryKey: ["authStatus"],
    queryFn: async () => {
      const response = await fetch(
        "https://api.sstr.reinis.space/auth/status",
        {
          credentials: "include",
        }
      );

      console.log("auth status", response.status);

      if (!response.ok) {
        if (response.status === 401) {
          return null;
        }
        throw new Error("Failed to fetch auth status");
      }

      const data = await response.json();
      //return response.json();
      return {
        UserID: data.UserID,
        Username: data.Username,
        IsAdmin: data.IsAdmin,
      };
    },
    retry: false,
    // onSuccess: (data) => {
    //   setUser(data);
    // },
    // onError: () => {
    //   setUser(null);
    // },
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await fetch("https://api.sstr.reinis.space/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      //   setUser(data);

      queryClient.invalidateQueries({ queryKey: ["authStatus"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("https://api.sstr.reinis.space/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      return response.json();
    },
    onSuccess: () => {
      //   setUser(null);

      queryClient.invalidateQueries({ queryKey: ["authStatus"] });
    },
  });

  const login = (credentials) => {
    return loginMutation.mutateAsync(credentials);
  };

  const logout = () => {
    return logoutMutation.mutateAsync();
  };

  const refreshAuth = () => {
    queryClient.invalidateQueries({ queryKey: ["authStatus"] });
  };

  const value = {
    user,
    loading: loading || loginMutation.isPending || logoutMutation.isPending,
    login,
    logout,
    refreshAuth,
    loginError: loginMutation.error,
    logoutError: logoutMutation.error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
