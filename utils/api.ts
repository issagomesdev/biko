export const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const baseData = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${apiBaseUrl}${endpoint}`, options);
  
  return response.json();
};
