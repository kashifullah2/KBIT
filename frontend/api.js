const API_URL =
  import.meta.env.VITE_API_URL || "https://kbit-d6xwq.sevalla.app";

export const analyzeSentiment = async (text) => {
  const res = await fetch(`${API_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) throw new Error("Server error");
  return res.json();
};
