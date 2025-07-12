const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const defaultHeaders = {
  "Content-Type": "application/json",
};

export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface RequestOptions<TPayload = unknown> {
  method: RequestMethod;
  url: string;
  payload?: TPayload;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
}

/**
 * Generic function to make API requests.
 * Supports GET, POST, PUT, DELETE methods.
 *
 * @template TResponse - The expected response type.
 * @template TPayload - The type of the request payload.
 * @param {RequestOptions<TPayload>} options - The request options.
 * @returns {Promise<TResponse>} The response data.
 */
export async function request<TResponse = unknown, TPayload = unknown>({
  method,
  url,
  payload,
  headers = {},
  params,
}: RequestOptions<TPayload>): Promise<TResponse> {
  const fullHeaders = { ...defaultHeaders, ...headers };

  // Build full URL with query params if any
  let fullUrl = `${API_BASE_URL}${url}`;

  if (params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      searchParams.append(key, String(value));
    }
    fullUrl += `?${searchParams.toString()}`;
  }

  try {
    const response = await fetch(fullUrl, {
      method,
      headers: fullHeaders,
      body: payload ? JSON.stringify(payload) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      throw { status: response.status, data };
    }

    return data;
  } catch (error) {
    console.error(`❌ API Error at ${url}:`, error);
    throw error;
  }
}
