import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sessions")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <h1 className="ml-65 text-3xl mb-8">Recent activity</h1>
      <div className="flex flex-col items-center ">
        <div className="w-350 bg-amber-400">Hello "/sessions"!</div>
      </div>
    </>
  );
}
