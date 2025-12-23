import { useQuery } from "@tanstack/react-query";
export const useGetCards = (token: string | null) => {
  return useQuery({
    queryKey: ["cards"],
    queryFn: getcards,
    retry: false,
    enabled: !!token,
    refetchInterval: (query) => {
      if (query.state.status !== "success") return false;
      const haspending =
        Array.isArray(query.state.data) &&
        query.state.data.some((c) => c.summaryStatus === "pending");
      return haspending ? 2500 : false;
    },
  });
};
async function getcards() {
  const token = localStorage.getItem("token");
  const responses = await fetch("http://192.168.1.8:3000/api/v1/content", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: token ? token : "",
    },
  });
  if (!responses.ok) {
    const error = await responses.json();
    throw new Error(error.message || "request failed");
  }
  return responses.json();
}
export const useGetSharedCards = (shareId: string | undefined) => {
  return useQuery({
    queryKey: ["sharedCards", shareId],
    queryFn: () => getsharedcards(shareId),
    enabled: !!shareId,
    retry: false,
  });
};
async function getsharedcards(shareId: string | undefined) {
  const response = await fetch(
    "http://192.168.1.8:3000/api/v1/brain/" + shareId,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Request failed");
  }
  return response.json();
}
