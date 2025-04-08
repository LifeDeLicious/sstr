import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <h1 className="ml-65 text-3xl mb-8">Admin panel</h1>
      <div className="flex flex-col items-center ">
        <div className="w-350 bg-amber-400">Hello "/sessions"!</div>
      </div>
    </>
  );
}
