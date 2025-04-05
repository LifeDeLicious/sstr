import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

//import { useAuthStore } from "../App";

const AuthForm = ({ type }) => {
  const navigate = useNavigate();

  //const { setAuthState } = useAuthStore();

  const authMutation = useMutation({
    mutationFn: async (userData) => {
      const endpoint = type === "register" ? "/register" : "/login";
      const res = await fetch(`https://orca.reinis.space/api${endpoint}`, {
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

    onSuccess: () => {
      if (type !== "login") {
        navigate({ to: "/" });
      } else {
        //! set auth state to true
        setAuthState(true);
        console.log("auth state set to true");
        navigate({ to: "/data" });
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
