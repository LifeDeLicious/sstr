import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../context/AuthContext.jsx";

const AuthForm = ({ type }) => {
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();

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
      try {
        if (type === "login") {
          await refreshAuth();

          window.location.href = "/sessions";
        } else if (type === "register") {
          await refreshAuth();
          console.log("Registration successful");
          window.location.href = "/sessions";
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
    </>
  );
};

export default AuthForm;
