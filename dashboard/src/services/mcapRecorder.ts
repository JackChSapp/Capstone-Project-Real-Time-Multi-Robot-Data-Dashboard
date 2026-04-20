const BASE_URL = import.meta.env.VITE_MCAP_RECORDER_URL ?? "http://localhost:8000";

export async function startRecording(
  wsUrl: string,
  topics: string[] | null
): Promise<{ output: string }> {
  const res = await fetch(`${BASE_URL}/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ws_url: wsUrl, topics }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function stopRecording(): Promise<{ path: string }> {
  const res = await fetch(`${BASE_URL}/stop`, { method: "POST" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
