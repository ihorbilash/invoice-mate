export async function useAPIFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = {
    "Content-Type": "application/json",
  };

  const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
    ...options,
    headers: Object.assign(headers, options.headers),
  });
  try {
    return await response.json();
  } catch {
    return response as unknown as T;
  }
}
