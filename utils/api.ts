export const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const baseData = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${apiBaseUrl}${endpoint}`, options);

  if (!response.ok) {
    throw {
      status: response.status,
      message: response.statusText,
    };
  }
  
  return response.json();
};
