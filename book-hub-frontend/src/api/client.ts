/**
 * API response interface for consistent error handling
 */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Generic GET request handler with error handling and typing
 * @param url - The endpoint URL
 * @returns Promise with typed response data
 * @throws ApiError
 */
export async function get<T = unknown>(url: string): Promise<T> {
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      throw new ApiError(
        res.status,
        data.message || 'An error occurred while fetching data'
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Network error or server unavailable');
  }
}

export default { get };
