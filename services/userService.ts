import { baseData } from '../utils/api';
import { User } from '../models/User';

export class UserService {

  static async getAuthUser(token:string): Promise<User[]> {
    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    };

    const data:any = await baseData('/users/auth', options);
    return data.data;
  }

  static async getUsers(token:string): Promise<User[]> {
    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    };

    const data:any = await baseData('/users', options);
    return data.data;
  }

  static async getUser(token:string, UserID:number): Promise<User[]> {
    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    };

    const data:any = await baseData(`/users/${UserID}`, options);
    return data.data;
  }
  
}