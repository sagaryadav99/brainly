const API = import.meta.env.VITE_BASE_URL;
export async function gettags(token: string | null) {
  const resp = await fetch(API + "/api/v1/tagname", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? token : "",
    },
  });
  if (!resp.ok) {
    const error = await resp.json();
    throw new Error(error.message || "fetch failed");
  }
  return resp.json();
}
