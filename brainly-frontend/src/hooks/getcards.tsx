import { useQuery } from "@tanstack/react-query";
export const useGetCards = () => {
  return useQuery({
    queryKey: ["cards"],
    queryFn: getcards,
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
