import { baseData } from '../utils/api';
import { Category } from '../models/Categories';

export class CategoryService {

  static async getCategories(): Promise<Category[]> {
    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    };

    const data:any = await baseData('/categories', options);
    return data.data;
  }
  
}