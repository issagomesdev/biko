import { baseData } from '../utils/api';

export class authService {

  static async login(email: string, password: string): Promise<any> {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, password }),
    };

    return baseData('/login', options);
  }

  static async register(data:any): Promise<any> {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data),
    };

    return baseData('/register', options);
  }

  static async logout(token:string): Promise<any> {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };

    return baseData('/logout', options);
  }
  
}