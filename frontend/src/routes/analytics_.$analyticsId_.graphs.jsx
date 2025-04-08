import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/analytics_/$analyticsId_/graphs")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/analytics/$analyticsId/graphs"!</div>;
}
