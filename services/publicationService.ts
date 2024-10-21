import { baseData } from '../utils/api';
import { Publication } from '../models/Publication';

export class PublicationService {
    
    static async getPublications(token:string): Promise<Publication[]> {
        const options: RequestInit = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        };
    
        return baseData('/publications', options);
    }

    static async createPublication(data:any, token:string): Promise<Publication> {
        const options: RequestInit = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(data)
        }
    
        return baseData('/publications', options);
    }

}