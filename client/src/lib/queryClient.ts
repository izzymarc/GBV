import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Get the API base URL based on environment
const getApiBaseUrl = () => {
  // Use the environment variable if available
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // In production (Netlify), use the /.netlify/functions/ path
  if (import.meta.env.PROD) {
    return "/.netlify/functions/api";
  }
  // In development, use the local server
  return "";
};

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Adjust the URL for production environment
  let adjustedUrl = url;
  
  // If we're in production and it's an API call
  if (url.startsWith('/api')) {
    if (import.meta.env.VITE_API_URL) {
      // If using the environment variable
      adjustedUrl = import.meta.env.VITE_API_URL + url;
    } else if (import.meta.env.PROD) {
      // Default Netlify functions path
      adjustedUrl = "/.netlify/functions/api" + url;
    }
  }

  const res = await fetch(adjustedUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Adjust the URL for production environment
    let url = queryKey[0] as string;
    
    // If it's an API call, adjust URL for production/Netlify
    if (url.startsWith('/api')) {
      if (import.meta.env.VITE_API_URL) {
        // If using the environment variable
        url = import.meta.env.VITE_API_URL + url;
      } else if (import.meta.env.PROD) {
        // Default Netlify functions path
        url = "/.netlify/functions/api" + url;
      }
    }

    const res = await fetch(url, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
