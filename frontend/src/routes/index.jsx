import { createFileRoute } from "@tanstack/react-router";
import AuthForm from "../components/AuthForm.jsx";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <br></br>
        <AuthForm type="login" className="mb-4" />
        <br></br>
        <AuthForm type="register" className="" />
      </div>
      <div className="p-2">
        {/* <h3 className="text-bold">Welcome Home!</h3> */}
      </div>
    </>
  );
}
