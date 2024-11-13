import { baseData } from '../utils/api';
import { User, filterUser } from '../models/User';

export class UserService {

  static async getAuthUser(token:string|undefined): Promise<User[]> {
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

  static async getUsers(data:filterUser, token:string|undefined): Promise<User[]> {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    };

    return baseData('/users/filter', options);
  }

  static async getUser(token:string|undefined, UserID:number): Promise<User[]> {
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