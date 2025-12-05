import { useQuery } from "@tanstack/react-query";
export const useGetCards = () => {
  return useQuery({
    queryKey: ["cards"],
    queryFn: getcards,
    refetchInterval: (query) => {
      if (!query) return false;
      const haspending =
        Array.isArray(query.state.data) &&
        query.state.data.some((c) => c.summaryStatus === "pending");
      return haspending ? 2500 : false;
    },
  });
};
async function getcards() {
  const token = localStorage.getItem("token");
  const responses = await fetch("http://localhost:3000/api/v1/content", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: token ? token : "",
    },
  });
  return responses.json();
}
