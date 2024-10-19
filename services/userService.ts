import { baseData } from '../utils/api';
import { User } from '../models/Users';

export class UserService {

  static async getUsers(): Promise<User[]> {
    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    };

    const data:any = await baseData('/users', options);
    return data.data;
  }
  
}