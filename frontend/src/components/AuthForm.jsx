import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../context/AuthContext.jsx";

//import { useAuthStore } from "../App";

const AuthForm = ({ type }) => {
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();

  //const { setAuthState } = useAuthStore();

  const authMutation = useMutation({
    mutationFn: async (userData) => {
      const endpoint = type === "register" ? "/register" : "/login";
      const res = await fetch(`https://api.sstr.reinis.space${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`${type} failed`);
      }
      return res.json();
    },

    onSuccess: async (data) => {
      // try {
      //   console.log(`${type} successful, server response:`, data);

      //   // Allow a small delay before refreshing auth state
      //   console.log("Waiting briefly before refreshing auth state...");
      //   await new Promise((resolve) => setTimeout(resolve, 300));

      //   // Try to refresh auth state
      //   console.log("Refreshing auth state...");
      //   const authResult = await refreshAuth();
      //   console.log("Auth refresh result:", authResult);

      //   if (!authResult) {
      //     console.error("Auth refresh returned null/undefined");
      //     // You might want to show an error message to the user here
      //     return;
      //   }

      //   // If we got here, auth refresh worked
      //   console.log(`${type} complete, navigating to sessions page`);
      //   navigate({ to: "/sessions" });
      // } catch (error) {
      //   console.error(`Error during ${type} process:`, error);
      //   // You might want to show an error message to the user here
      // }

      //!old onsucces
      try {
        if (type === "login") {
          await refreshAuth();

          //navigate({ to: "/sessions" });
          window.location.href = "/sessions";
        } else if (type === "register") {
          await refreshAuth();
          //! set auth state to true
          //setAuthState(true);
          console.log("Registration successful");
          navigate({ to: "/sessions" });
        }
      } catch (error) {
        console.error(`Error during ${type} process:`, error);
      }
    },
  });

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          authMutation.mutate(Object.fromEntries(formData));
        }}
        className=""
      >
        <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
          <legend className="fieldset-legend">
            {type === "register" ? "Sign up" : "Log in"}
          </legend>

          {type === "register" && (
            <>
              <label className="fieldset-label">Username</label>
              <input
                type="text"
                name="username"
                required
                className="input"
                placeholder="Username"
              />
            </>
          )}

          <label className="fieldset-label">Email</label>
          <input
            type="email"
            name="email"
            required
            className="input validator"
            placeholder="Email address"
          />

          <label className="fieldset-label">Password</label>
          <input
            name="password"
            type="password"
            className="input"
            required
            placeholder="Password"
          />

          <button type="submit" className="btn btn-neutral mt-4">
            {type === "register" ? "Sign up" : "Log in"}
          </button>
        </fieldset>
      </form>
      {/* <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          authMutation.mutate(Object.fromEntries(formData));
        }}
      >
        <input name="email" type="email" required placeholder="Email address" />
        <br></br>
        <br></br>
        <input
          name="password"
          type="password"
          required
          placeholder="Password"
        />
        <br></br>
        <br></br>
        <button className="btn" type="submit">
          {type === "register" ? "Register" : "Login"}
        </button>
      </form> */}
    </>
  );
};

export default AuthForm;
