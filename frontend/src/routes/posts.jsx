import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/posts")({
  component: Posts,
});

function Posts() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["mydata"], //unique key for caching ?? huuuuuuuh okay
    queryFn: () =>
      fetch("https://sstr.reinis.space/laps").then((res) => res.json()),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  return <pre className="underline">{JSON.stringify(data, null, 2)}</pre>;

  // return (
  //   <div className="p-2">
  //     <h3>Hello from Post!</h3>
  //   </div>
  // );
}
