import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/usersettings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/usersettings"!</div>
}
