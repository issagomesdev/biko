import { parse } from 'cookie';

export const isAuthenticated = (req: any) => {
  const cookies = parse(req.headers.cookie || '');
  return !!cookies.token;
};